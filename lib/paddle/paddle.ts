import { initializePaddle, Paddle } from "@paddle/paddle-js"

let paddleInstance: Paddle | null = null

export async function getPaddle(): Promise<Paddle | null> {
  if (paddleInstance) {
    return paddleInstance
  }

  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production"

  if (!clientToken) {
    console.error("Paddle client token not found")
    return null
  }

  try {
    paddleInstance = await initializePaddle({
      token: clientToken,
      environment: environment || "sandbox",
    }) || null
    return paddleInstance
  } catch (error) {
    console.error("Failed to initialize Paddle:", error)
    return null
  }
}

export function openCheckout(priceId: string, userId: string, email?: string) {
  getPaddle().then((paddle) => {
    if (!paddle) {
      console.error("Paddle not initialized")
      return
    }

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: email ? { email } : undefined,
      customData: {
        userId: userId, // ✅ Now accepts actual user ID
      },
      settings: {
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/signup/success?userId=${userId}`,
      },
    })
  })
}
