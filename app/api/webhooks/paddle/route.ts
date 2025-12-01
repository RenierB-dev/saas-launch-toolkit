import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required")
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required")
}
if (!process.env.PADDLE_WEBHOOK_SECRET) {
  throw new Error("PADDLE_WEBHOOK_SECRET is required for webhook security")
}

// Initialize Supabase client with service role key for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Paddle webhook event types we care about
type PaddleEventType =
  | "transaction.completed"
  | "transaction.updated"
  | "subscription.created"
  | "subscription.updated"
  | "subscription.canceled"
  | "subscription.paused"
  | "subscription.resumed"

interface PaddleWebhookEvent {
  event_id: string
  event_type: PaddleEventType
  occurred_at: string
  data: any
}

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text()

    // Verify Paddle webhook signature
    const signature = req.headers.get("paddle-signature")

    if (!signature) {
      console.error("Missing Paddle signature header")
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      )
    }

    // Paddle signature format: "ts=timestamp;h1=signature"
    const signatureParts = signature.split(";")
    const timestamp = signatureParts.find((part) => part.startsWith("ts="))?.split("=")[1]
    const signatureHash = signatureParts.find((part) => part.startsWith("h1="))?.split("=")[1]

    if (!timestamp || !signatureHash) {
      console.error("Invalid signature format")
      return NextResponse.json(
        { error: "Invalid signature format" },
        { status: 401 }
      )
    }

    // Verify signature
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET!
    const signedPayload = `${timestamp}:${rawBody}`
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload)
      .digest("hex")

    if (signatureHash !== expectedSignature) {
      console.error("Invalid webhook signature")
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      )
    }

    // Prevent replay attacks - reject old webhooks (older than 3 minutes)
    const currentTime = Math.floor(Date.now() / 1000)
    const webhookAge = currentTime - parseInt(timestamp)
    if (webhookAge > 180) {
      console.error("Webhook timestamp too old:", webhookAge, "seconds")
      return NextResponse.json(
        { error: "Webhook expired" },
        { status: 401 }
      )
    }

    // Parse the verified body
    const body = JSON.parse(rawBody)
    const event = body as PaddleWebhookEvent

    console.log("Received verified Paddle webhook:", event.event_type)

    // Check if we've already processed this event (prevents duplicate processing)
    const { data: existingEvent } = await supabaseAdmin
      .from("webhook_events")
      .select("id")
      .eq("event_id", event.event_id)
      .single()

    if (existingEvent) {
      console.log("Duplicate webhook event detected, skipping:", event.event_id)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Record this event as being processed
    const { error: eventError } = await supabaseAdmin
      .from("webhook_events")
      .insert({
        event_id: event.event_id,
        event_type: event.event_type,
      })

    if (eventError) {
      console.error("Failed to record webhook event:", eventError)
      // Continue processing even if we can't record the event
      // This prevents webhook failures if the table doesn't exist yet
    }

    // Handle different event types
    switch (event.event_type) {
      case "transaction.completed":
        await handleTransactionCompleted(event.data)
        break

      case "subscription.created":
        await handleSubscriptionCreated(event.data)
        break

      case "subscription.updated":
        await handleSubscriptionUpdated(event.data)
        break

      case "subscription.canceled":
        await handleSubscriptionCanceled(event.data)
        break

      case "subscription.paused":
        await handleSubscriptionPaused(event.data)
        break

      case "subscription.resumed":
        await handleSubscriptionResumed(event.data)
        break

      default:
        console.log("Unhandled event type:", event.event_type)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function handleTransactionCompleted(data: any) {
  const userId = data.custom_data?.userId
  const customerId = data.customer_id
  const transactionId = data.id
  const items = data.items || []
  const priceId = items[0]?.price?.id

  if (!userId) {
    console.error("No userId in transaction data")
    return
  }

  // Determine plan type from price ID
  const oneTimePriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_ONETIME
  const monthlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY

  let planType: "one_time" | "monthly" = "one_time"
  if (priceId === monthlyPriceId) {
    planType = "monthly"
  }

  // For one-time purchases, create/update subscription record
  if (planType === "one_time") {
    const { error } = await supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: userId,
        paddle_customer_id: customerId,
        paddle_transaction_id: transactionId,
        paddle_price_id: priceId,
        status: "active",
        plan_type: "one_time",
        price_amount: data.details?.totals?.total || 0,
        current_period_start: new Date().toISOString(),
        current_period_end: null, // One-time has no end date
        cancel_at_period_end: false,
        metadata: {
          transaction_details: data.details,
        },
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    )

    if (error) {
      console.error("Error creating one-time subscription:", error)
    } else {
      console.log("One-time purchase recorded for user:", userId)
    }
  }

  // For monthly subscriptions, the subscription.created event will handle it
  console.log("Transaction completed:", transactionId)
}

async function handleSubscriptionCreated(data: any) {
  const userId = data.custom_data?.userId
  const customerId = data.customer_id
  const subscriptionId = data.id
  const items = data.items || []
  const priceId = items[0]?.price?.id

  if (!userId) {
    console.error("No userId in subscription data")
    return
  }

  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      paddle_customer_id: customerId,
      paddle_subscription_id: subscriptionId,
      paddle_price_id: priceId,
      status: data.status,
      plan_type: "monthly",
      price_amount: data.items[0]?.price?.unit_price?.amount || 0,
      current_period_start: data.current_billing_period?.starts_at,
      current_period_end: data.current_billing_period?.ends_at,
      cancel_at_period_end: data.scheduled_change?.action === "cancel",
      metadata: {
        billing_cycle: data.billing_cycle,
        collection_mode: data.collection_mode,
      },
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    }
  )

  if (error) {
    console.error("Error creating subscription:", error)
  } else {
    console.log("Subscription created for user:", userId)
  }
}

async function handleSubscriptionUpdated(data: any) {
  const subscriptionId = data.id

  // Find subscription by paddle_subscription_id
  const { data: existingSubscription } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("paddle_subscription_id", subscriptionId)
    .single()

  if (!existingSubscription) {
    console.error("Subscription not found:", subscriptionId)
    return
  }

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      status: data.status,
      current_period_start: data.current_billing_period?.starts_at,
      current_period_end: data.current_billing_period?.ends_at,
      cancel_at_period_end: data.scheduled_change?.action === "cancel",
      updated_at: new Date().toISOString(),
    })
    .eq("paddle_subscription_id", subscriptionId)

  if (error) {
    console.error("Error updating subscription:", error)
  } else {
    console.log("Subscription updated:", subscriptionId)
  }
}

async function handleSubscriptionCanceled(data: any) {
  const subscriptionId = data.id

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("paddle_subscription_id", subscriptionId)

  if (error) {
    console.error("Error canceling subscription:", error)
  } else {
    console.log("Subscription canceled:", subscriptionId)
  }
}

async function handleSubscriptionPaused(data: any) {
  const subscriptionId = data.id

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "paused",
      updated_at: new Date().toISOString(),
    })
    .eq("paddle_subscription_id", subscriptionId)

  if (error) {
    console.error("Error pausing subscription:", error)
  } else {
    console.log("Subscription paused:", subscriptionId)
  }
}

async function handleSubscriptionResumed(data: any) {
  const subscriptionId = data.id

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("paddle_subscription_id", subscriptionId)

  if (error) {
    console.error("Error resuming subscription:", error)
  } else {
    console.log("Subscription resumed:", subscriptionId)
  }
}
