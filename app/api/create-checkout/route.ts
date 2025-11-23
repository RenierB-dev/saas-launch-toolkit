import { NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  })
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe()
    const { priceId, planType } = await request.json()

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: planType === 'one-time' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
