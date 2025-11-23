import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  })
}

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase environment variables are not set')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request: Request) {
  const stripe = getStripe()
  const supabase = getSupabase()
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Get customer email from session
      const customerEmail = session.customer_email || session.customer_details?.email

      if (customerEmail) {
        // Update user's plan in profiles table
        const { error } = await supabase
          .from('profiles')
          .update({
            plan_type: 'pro',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            updated_at: new Date().toISOString()
          })
          .eq('email', customerEmail)

        if (error) {
          console.error('Error updating user plan:', error)
        }

        // TODO: Send confirmation email
        console.log(`Payment successful for ${customerEmail}`)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      // Downgrade user to free plan
      const { error } = await supabase
        .from('profiles')
        .update({
          plan_type: 'free',
          stripe_subscription_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', subscription.customer)

      if (error) {
        console.error('Error downgrading user:', error)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription

      // Update subscription status
      const { error } = await supabase
        .from('profiles')
        .update({
          plan_type: subscription.status === 'active' ? 'pro' : 'free',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', subscription.customer)

      if (error) {
        console.error('Error updating subscription:', error)
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
