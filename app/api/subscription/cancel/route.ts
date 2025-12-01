import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  // Initialize Supabase admin client for server-side operations
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  try {
    // Get the session token from cookies
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "") || req.cookies.get("sb-access-token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No session token" },
        { status: 401 }
      )
    }

    // Verify user is authenticated using the token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid session" },
        { status: 401 }
      )
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (subError || !subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      )
    }

    // Only monthly subscriptions can be canceled
    if (subscription.plan_type !== "monthly") {
      return NextResponse.json(
        { error: "One-time purchases cannot be canceled" },
        { status: 400 }
      )
    }

    if (!subscription.paddle_subscription_id) {
      return NextResponse.json(
        { error: "No Paddle subscription ID found" },
        { status: 400 }
      )
    }

    // Call Paddle API (server-side only)
    const paddleApiKey = process.env.PADDLE_API_KEY
    const paddleEnvironment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox"

    if (!paddleApiKey) {
      console.error("PADDLE_API_KEY not configured")
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      )
    }

    const baseUrl =
      paddleEnvironment === "production"
        ? "https://api.paddle.com"
        : "https://sandbox-api.paddle.com"

    const response = await fetch(
      `${baseUrl}/subscriptions/${subscription.paddle_subscription_id}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paddleApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          effective_from: "next_billing_period",
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Paddle cancellation failed:", errorText)
      return NextResponse.json(
        { error: "Failed to cancel subscription with Paddle" },
        { status: response.status }
      )
    }

    const paddleData = await response.json()
    console.log("Subscription canceled successfully:", subscription.paddle_subscription_id)

    return NextResponse.json({
      success: true,
      message: "Subscription will cancel at end of billing period",
      data: paddleData
    })
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
