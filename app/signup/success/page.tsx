"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Rocket, Calculator, Calendar, ArrowRight, Loader2 } from "lucide-react"
import confetti from "canvas-confetti"
import { createClient } from "@/lib/supabase/client"
import { getUserSubscription } from "@/lib/paddle/subscription-helpers"

export default function SuccessPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [validated, setValidated] = useState(false)
  const [validating, setValidating] = useState(true)

  // Validate user has active subscription before showing success page
  useEffect(() => {
    async function validateAccess() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          console.warn("No user found, redirecting to signup")
          router.replace("/signup")
          return
        }

        // Check if user has a subscription
        const subscription = await getUserSubscription()

        if (!subscription || subscription.status !== "active") {
          console.warn("No active subscription found, redirecting to signup")
          router.replace("/signup")
          return
        }

        // Valid access - show success page
        setValidated(true)
        setValidating(false)
      } catch (error) {
        console.error("Error validating access:", error)
        router.replace("/signup")
      }
    }

    validateAccess()
  }, [router])

  useEffect(() => {
    // Only fire confetti after validation
    if (!validated) return

    // Fire confetti
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Animate checklist items
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 800),
      setTimeout(() => setStep(3), 1200)
    ]

    return () => {
      clearInterval(interval)
      timers.forEach(clearTimeout)
    }
  }, [validated])

  const checklistItems = [
    {
      title: "Account Created",
      description: "Your account is ready to go"
    },
    {
      title: "Payment Confirmed",
      description: "You're all set with your subscription"
    },
    {
      title: "Tools Unlocked",
      description: "Access all features immediately"
    }
  ]

  const quickActions = [
    {
      title: "Pricing Calculator",
      description: "Find your optimal price point",
      icon: Calculator,
      href: "/dashboard/pricing-calculator",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Launch Sequence",
      description: "Start your 30-day plan",
      icon: Calendar,
      href: "/dashboard/launch-sequence",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Dashboard",
      description: "View your overview",
      icon: Rocket,
      href: "/dashboard",
      color: "text-primary"
    }
  ]

  // Show loading state while validating
  if (validating || !validated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying your subscription...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Success Message */}
        <div className="text-center space-y-4 animate-in slide-in-from-bottom-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome Aboard! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Your journey to launching a successful SaaS starts now
          </p>
        </div>

        {/* Checklist */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold">Setup Complete</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklistItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-3 rounded-lg transition-all duration-300 ${
                  step > i
                    ? "opacity-100 translate-x-0 bg-green-50 dark:bg-green-950/20"
                    : "opacity-40 translate-x-4"
                }`}
              >
                <div className={`flex-shrink-0 transition-all duration-300 ${
                  step > i ? "scale-100" : "scale-75"
                }`}>
                  <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center">Get Started</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="group"
              >
                <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 space-y-3">
                    <div className={`inline-flex p-3 rounded-lg bg-muted group-hover:scale-110 transition-transform ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">{action.title}</p>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Continue to Dashboard */}
        <div className="text-center space-y-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground">
            You can access these tools anytime from your dashboard
          </p>
        </div>
      </div>
    </div>
  )
}
