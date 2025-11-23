"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Loader2 } from "lucide-react"

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  toolName: string
}

export function PaywallModal({ isOpen, onClose, toolName }: PaywallModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)

    try {
      // Call API to create Stripe checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          planType: 'monthly'
        })
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade to Pro</DialogTitle>
          <DialogDescription>
            You&apos;ve reached your free limit for {toolName}. Unlock unlimited access with Pro.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-lg">Free</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Limited access to all tools
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-4 w-4" />
                  3 ProductHunt launches
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-4 w-4" />
                  2 pricing calculations
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-4 w-4" />
                  1 launch sequence
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-4 w-4" />
                  Limited marketing assets
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary shadow-lg">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500">
              <Crown className="h-3 w-3 mr-1" />
              RECOMMENDED
            </Badge>
            <CardHeader className="pt-6">
              <CardTitle className="text-lg">Pro</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Badge variant="secondary" className="w-fit mt-2">
                Launch Special: $17.40/mo (40% off)
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 font-semibold">
                  <Check className="h-4 w-4 text-green-500" />
                  Unlimited everything
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  All 5 tools unlocked
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Export to PDF/CSV
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Early access to new features
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Advanced analytics
                </li>
              </ul>

              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            ✓ Cancel anytime · ✓ 30-day money-back guarantee · ✓ Instant access
          </p>
          <Button variant="ghost" onClick={onClose} className="text-sm">
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
