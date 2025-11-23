"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Crown, CreditCard, Receipt, AlertTriangle } from "lucide-react"

export default function BillingPage() {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isPro, setIsPro] = useState(true) // TODO: Get from user context

  const handleManageSubscription = async () => {
    // TODO: Create Stripe customer portal session
    console.log("Opening Stripe customer portal...")
  }

  const handleCancelSubscription = async () => {
    // TODO: Implement cancellation
    console.log("Cancelling subscription...")
    setShowCancelDialog(false)
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </div>
            {isPro && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                <Crown className="h-3 w-3 mr-1" />
                Pro Plan
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Plan Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">{isPro ? 'Pro' : 'Free'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">{isPro ? '$29/month' : '$0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={isPro ? "default" : "secondary"}>
                    {isPro ? 'Active' : 'Free Plan'}
                  </Badge>
                </div>
                {isPro && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next billing:</span>
                    <span className="font-medium">Jan 23, 2026</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What&apos;s Included</h3>
              <ul className="space-y-1 text-sm">
                {isPro ? (
                  <>
                    <li>✓ Unlimited access to all tools</li>
                    <li>✓ Export to PDF/CSV</li>
                    <li>✓ Priority support</li>
                    <li>✓ Early access to features</li>
                  </>
                ) : (
                  <>
                    <li>• Limited access to tools</li>
                    <li>• Community support</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {isPro && (
            <div className="flex gap-3 pt-4">
              <Button onClick={handleManageSubscription}>
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Payment Method
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setShowCancelDialog(true)}
              >
                Cancel Subscription
              </Button>
            </div>
          )}

          {!isPro && (
            <div className="pt-4">
              <a href="/pricing">
                <Button>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            <CardTitle>Billing History</CardTitle>
          </div>
          <CardDescription>View your past invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          {isPro ? (
            <div className="space-y-3">
              {/* Sample invoice */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Pro Plan - Monthly</p>
                  <p className="text-sm text-muted-foreground">Dec 23, 2025</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-medium">$29.00</p>
                  <Badge variant="outline" className="text-xs">Paid</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Pro Plan - Monthly</p>
                  <p className="text-sm text-muted-foreground">Nov 23, 2025</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-medium">$29.00</p>
                  <Badge variant="outline" className="text-xs">Paid</Badge>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View All Invoices
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No billing history available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <DialogTitle>Cancel Subscription</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to cancel your Pro subscription?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <p className="text-sm">You&apos;ll lose access to:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Unlimited tool usage</li>
              <li>• Export to PDF/CSV</li>
              <li>• Priority support</li>
              <li>• Early access to new features</li>
            </ul>
            <p className="text-sm font-medium">
              Your Pro access will continue until the end of your current billing period.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Pro
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
            >
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
