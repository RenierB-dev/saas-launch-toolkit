"use client"

import { useState, useEffect, ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Crown } from "lucide-react"
import { PaywallModal } from "./paywall-modal"

interface UsageGateProps {
  children: ReactNode
  toolName: string
  freeLimit: number
  currentUsage: number
  isPro?: boolean
}

export function UsageGate({
  children,
  toolName,
  freeLimit,
  currentUsage,
  isPro = false
}: UsageGateProps) {
  const [showPaywall, setShowPaywall] = useState(false)
  const usagePercentage = (currentUsage / freeLimit) * 100
  const isLimitReached = currentUsage >= freeLimit
  const isNearLimit = usagePercentage >= 80

  // Check if limit is reached and show paywall
  useEffect(() => {
    if (!isPro && isLimitReached) {
      setShowPaywall(true)
    }
  }, [isPro, isLimitReached])

  // If Pro user, show content without restrictions
  if (isPro) {
    return (
      <>
        <div className="mb-4">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
            <Crown className="h-3 w-3 mr-1" />
            Pro Plan - Unlimited
          </Badge>
        </div>
        {children}
      </>
    )
  }

  // If limit reached, show paywall instead of content
  if (isLimitReached) {
    return (
      <>
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Free Limit Reached</CardTitle>
            </div>
            <CardDescription>
              You&apos;ve used all {freeLimit} free {toolName} credits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Upgrade to Pro for unlimited access to all tools
              </p>
              <ul className="space-y-1 text-sm">
                <li>✓ Unlimited {toolName} generations</li>
                <li>✓ Access to all premium features</li>
                <li>✓ Priority support</li>
                <li>✓ Export to PDF/CSV</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          toolName={toolName}
        />
      </>
    )
  }

  // Show content with usage warning if near limit
  return (
    <>
      {isNearLimit && (
        <Alert className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <div className="space-y-2">
              <p className="font-semibold">
                You&apos;ve used {currentUsage} of {freeLimit} free credits
              </p>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-sm">
                Upgrade to Pro for unlimited access
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {children}

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        toolName={toolName}
      />
    </>
  )
}
