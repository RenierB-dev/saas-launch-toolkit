import { initializePaddle, Paddle } from "@paddle/paddle-js"

let paddleInstance: Paddle | null = null

export async function getPaddle(): Promise<Paddle | null> {
  // Only run in browser
  if (typeof window === 'undefined') {
    return null
  }

  if (paddleInstance) {
    return paddleInstance
  }

  // ✅ Direct access - Next.js inlines these at build time
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  const environment = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox") as "sandbox" | "production"

  if (!clientToken) {
    console.error("Paddle client token not found in environment variables")
    return null
  }

  try {
    paddleInstance = await initializePaddle({
      token: clientToken,
      environment: environment,
    }) || null
    return paddleInstance
  } catch (error) {
    console.error("Failed to initialize Paddle:", error)
    return null
  }
}

export function openCheckout(
  priceId: string,
  userId: string,
  email?: string,
  onError?: (message: string) => void
) {
  getPaddle()
    .then((paddle) => {
      if (!paddle) {
        const errorMsg = "Payment system unavailable. Please refresh and try again."
        console.error("Paddle not initialized")
        onError?.(errorMsg)
        return
      }

      try {
        paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customer: email ? { email } : undefined,
          customData: {
            userId: userId,
          },
          settings: {
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/signup/success?userId=${userId}`,
          },
        })
      } catch (error) {
        const errorMsg = "Failed to open payment checkout. Please try again."
        console.error("Checkout error:", error)
        onError?.(errorMsg)
      }
    })
    .catch((error) => {
      const errorMsg = "Payment initialization failed. Please refresh the page."
      console.error("Paddle initialization error:", error)
      onError?.(errorMsg)
    })
}
