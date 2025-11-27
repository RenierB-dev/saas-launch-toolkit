"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  CreditCard,
  Calendar,
  DollarSign,
  Shield,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2
} from "lucide-react"
import {
  getUserSubscription,
  cancelSubscription,
  getSubscriptionStatusColor,
  getSubscriptionStatusLabel,
  formatPlanType,
  formatPrice,
  type Subscription
} from "@/lib/paddle/subscription-helpers"

export default function SettingsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [canceling, setCanceling] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)

  useEffect(() => {
    loadSubscription()
  }, [])

  async function loadSubscription() {
    const sub = await getUserSubscription()
    setSubscription(sub)
    setLoading(false)
  }

  async function handleCancelSubscription() {
    if (!subscription?.paddle_subscription_id) return

    setCanceling(true)
    const success = await cancelSubscription(subscription.paddle_subscription_id)

    if (success) {
      setCancelSuccess(true)
      toast.success("Subscription canceled", {
        description: "You'll still have access until the end of your billing period."
      })
      // Reload subscription data
      await loadSubscription()
    } else {
      toast.error("Failed to cancel subscription", {
        description: "Please contact support for assistance."
      })
    }
    setCanceling(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your subscription and billing preferences
        </p>
      </div>

      {/* Success Message */}
      {cancelSuccess && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-900 dark:text-green-100">
              Subscription Canceled
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your subscription will remain active until the end of your billing period.
            </p>
          </div>
        </div>
      )}

      {/* No Subscription */}
      {!subscription && (
        <Card className="border-orange-500/50 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">No Active Subscription</CardTitle>
                <CardDescription className="mt-1">
                  Subscribe to unlock all features and launch your SaaS successfully
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Choose a Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Subscription */}
      {subscription && (
        <div className="space-y-6">
          {/* Current Plan Card */}
          <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Current Plan</CardTitle>
                    <CardDescription className="mt-1 text-base">
                      {formatPlanType(subscription.plan_type)}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={`${getSubscriptionStatusColor(subscription.status)} px-3 py-1 text-sm`}>
                  {getSubscriptionStatusLabel(subscription.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">
                  {formatPrice(subscription.price_amount)}
                </span>
                {subscription.plan_type === "monthly" && (
                  <span className="text-muted-foreground text-lg">/month</span>
                )}
                {subscription.plan_type === "one_time" && (
                  <Badge variant="secondary" className="ml-2">Lifetime Access</Badge>
                )}
              </div>

              <Separator />

              {/* Subscription Details */}
              <div className="grid gap-4">
                {/* Payment Method */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-muted rounded">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Payment Method</p>
                    <p className="text-muted-foreground">Managed by Paddle</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    Update
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>

                {/* Billing Period */}
                {subscription.plan_type === "monthly" && subscription.current_period_end && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-muted rounded">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Next Billing Date</p>
                      <p className="text-muted-foreground">
                        {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Started Date */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-muted rounded">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Member Since</p>
                    <p className="text-muted-foreground">
                      {new Date(subscription.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancel Subscription (Monthly Only) */}
              {subscription.plan_type === "monthly" && subscription.status === "active" && !subscription.cancel_at_period_end && (
                <>
                  <Separator />
                  <div className="pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900"
                        >
                          Cancel Subscription
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="space-y-3 pt-2">
                            <p>
                              This will cancel your subscription at the end of your current billing period.
                            </p>
                            <p className="font-medium">
                              You&apos;ll still have access until{" "}
                              {subscription.current_period_end &&
                                new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              }
                            </p>
                            <p className="text-sm text-muted-foreground">
                              You can resubscribe at any time.
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancelSubscription}
                            disabled={canceling}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {canceling ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Canceling...
                              </>
                            ) : (
                              "Cancel Subscription"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}

              {/* Scheduled Cancellation Notice */}
              {subscription.cancel_at_period_end && (
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-900 dark:text-orange-100">
                        Subscription Ending Soon
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Your subscription will end on{" "}
                        {subscription.current_period_end &&
                          new Date(subscription.current_period_end).toLocaleDateString()
                        }. You won&apos;t be charged again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Included */}
          <Card>
            <CardHeader>
              <CardTitle>What&apos;s Included</CardTitle>
              <CardDescription>
                Features available in your {formatPlanType(subscription.plan_type)} plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Pricing Strategy Calculator",
                  "30-Day Launch Sequence",
                  "ProductHunt Launch Guide",
                  "First 100 Customers Playbook",
                  "Marketing Asset Generator",
                  subscription.plan_type === "monthly" ? "Priority Support" : "Email Support",
                  subscription.plan_type === "monthly" ? "Monthly Updates" : "Lifetime Access",
                  "All Future Tools"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Invoices are managed by Paddle</p>
                <Button variant="outline" className="mt-4 gap-2">
                  View Billing Portal
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
