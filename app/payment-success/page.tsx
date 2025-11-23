"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, PartyPopper, Twitter } from "lucide-react"
import Link from "next/link"
import Confetti from "react-confetti"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [showConfetti, setShowConfetti] = useState(true)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const tweetText = encodeURIComponent(
    "Just upgraded to @SaaSLaunchKit Pro! 🚀 Excited to launch my SaaS in 30 days with unlimited access to all tools."
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
            <Crown className="h-8 w-8 text-white" />
          </div>

          <div className="space-y-2">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
              <Check className="h-3 w-3 mr-1" />
              Payment Successful
            </Badge>
            <CardTitle className="text-3xl">Welcome to Pro! 🎉</CardTitle>
            <CardDescription className="text-lg">
              You now have unlimited access to all SaaS Launch Toolkit features
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* What's Unlocked */}
          <div className="bg-muted rounded-lg p-6 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-primary" />
              What&apos;s Now Unlocked
            </h3>
            <ul className="grid md:grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Unlimited ProductHunt launches
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Unlimited pricing calculations
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Unlimited launch sequences
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Unlimited customer tracking
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Unlimited marketing assets
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
            </ul>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold">Next Steps</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Check your email for your receipt</p>
              <p>2. Start using all Pro features in your dashboard</p>
              <p>3. Need help? Our priority support team is here for you</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="w-full">
              <Button size="lg" className="w-full">
                Go to Dashboard
              </Button>
            </Link>

            <a
              href={`https://twitter.com/intent/tweet?text=${tweetText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="outline" size="lg" className="w-full">
                <Twitter className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
            </a>
          </div>

          {/* Session ID */}
          {sessionId && (
            <p className="text-xs text-center text-muted-foreground">
              Session ID: {sessionId}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
