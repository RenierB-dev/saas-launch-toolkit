import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface Subscription {
  id: string
  user_id: string
  paddle_customer_id: string | null
  paddle_subscription_id: string | null
  paddle_transaction_id: string | null
  paddle_price_id: string | null
  status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing" | "unpaid" | "paused"
  plan_type: "one_time" | "monthly"
  price_amount: number
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  metadata: any
  created_at: string
  updated_at: string
}

export async function getUserSubscription(): Promise<Subscription | null> {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError) {
      console.error("Error getting user:", userError)
      toast.error("Failed to load user information")
      return null
    }

    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      // Don't show error if no subscription found (expected for new users)
      if (error.code !== "PGRST116") {
        console.error("Error fetching subscription:", error)
        toast.error("Failed to load subscription details")
      }
      return null
    }

    return data as Subscription
  } catch (error) {
    console.error("Unexpected error fetching subscription:", error)
    toast.error("Failed to load subscription")
    return null
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  const paddleApiKey = process.env.PADDLE_API_KEY
  const paddleEnvironment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox"

  if (!paddleApiKey) {
    console.error("Paddle API key not configured")
    toast.error("Payment system not configured")
    return false
  }

  // Get correct API URL based on environment
  const baseUrl =
    paddleEnvironment === "production"
      ? "https://api.paddle.com"
      : "https://sandbox-api.paddle.com"

  try {
    const response = await fetch(
      `${baseUrl}/subscriptions/${subscriptionId}/cancel`,
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
      console.error("Failed to cancel subscription:", errorText)
      toast.error("Failed to cancel subscription. Please try again.")
      return false
    }

    toast.success("Subscription cancelled successfully")
    return true
  } catch (error) {
    console.error("Error canceling subscription:", error)
    toast.error("Failed to cancel subscription. Please try again.")
    return false
  }
}

export function getSubscriptionStatusColor(status: Subscription["status"]): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "trialing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "canceled":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    case "past_due":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "paused":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    default:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  }
}

export function getSubscriptionStatusLabel(status: Subscription["status"]): string {
  switch (status) {
    case "active":
      return "Active"
    case "trialing":
      return "Trial"
    case "canceled":
      return "Canceled"
    case "past_due":
      return "Past Due"
    case "paused":
      return "Paused"
    case "incomplete":
      return "Incomplete"
    case "incomplete_expired":
      return "Expired"
    case "unpaid":
      return "Unpaid"
    default:
      return "Unknown"
  }
}

export function formatPlanType(planType: "one_time" | "monthly"): string {
  return planType === "one_time" ? "One-Time Purchase" : "Pro Monthly"
}

export function formatPrice(amount: number): string {
  return `$${(amount / 100).toFixed(2)}`
}
