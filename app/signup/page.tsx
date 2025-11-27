"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { openCheckout } from "@/lib/paddle/paddle"
import { toast } from "sonner"
import { CheckCircle2, Loader2, Rocket, Zap, Shield, TrendingUp } from "lucide-react"

type PlanType = "one_time" | "monthly"

interface PricingPlan {
  id: PlanType
  name: string
  price: string
  period: string
  description: string
  features: string[]
  priceId: string
  badge?: string
  gradient: string
}

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<"plan" | "account">("plan")
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  // Pricing plans
  const plans: PricingPlan[] = [
    {
      id: "one_time",
      name: "Launch Toolkit",
      price: "$49",
      period: "one-time",
      description: "Everything you need to launch your SaaS",
      badge: "Best Value",
      gradient: "from-purple-600 to-blue-600",
      priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_ONETIME || "",
      features: [
        "All 5 Launch Tools",
        "30-Day Launch Sequence",
        "Pricing Calculator",
        "Launch Checklist",
        "Lifetime Access",
        "One-time payment",
      ],
    },
    {
      id: "monthly",
      name: "Pro Monthly",
      price: "$19",
      period: "/month",
      description: "For founders launching multiple products",
      gradient: "from-orange-600 to-pink-600",
      priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY || "",
      features: [
        "All 5 Launch Tools",
        "30-Day Launch Sequence",
        "Pricing Calculator",
        "Launch Checklist",
        "Monthly Updates",
        "Priority Support",
        "Launch Multiple Products",
        "Cancel Anytime",
      ],
    },
  ]

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    setStep("account")
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlan) {
      toast.error("Please select a plan first")
      return
    }

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Create Supabase account
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (error) {
        console.error("Signup error:", error)
        toast.error(error.message || "Failed to create account")
        setLoading(false)
        return
      }

      if (!data.user) {
        toast.error("Failed to create account. Please try again.")
        setLoading(false)
        return
      }

      // Account created successfully
      toast.success("Account created! Opening payment...")

      // Open Paddle checkout with user ID
      setTimeout(() => {
        openCheckout(selectedPlan.priceId, data.user!.id, formData.email)
      }, 500)

      // Don't stop loading - let user complete payment
      // They'll be redirected to success page after payment
    } catch (error) {
      console.error("Unexpected error:", error)
      toast.error("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-purple-800/20 p-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {step === "plan" ? "Choose Your Plan" : "Create Your Account"}
          </h1>
          <p className="text-muted-foreground">
            {step === "plan"
              ? "Start launching your SaaS in 30 days"
              : "Almost there! Create your account to continue"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "plan"
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/20 text-primary"
              }`}
            >
              {step === "account" ? <CheckCircle2 className="w-5 h-5" /> : "1"}
            </div>
            <span className="text-sm font-medium">Select Plan</span>
          </div>
          <div className="w-12 h-[2px] bg-border self-center" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "account"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium">Create Account</span>
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {step === "plan" && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {plan.badge}
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-4`}
                  >
                    {plan.id === "one_time" ? (
                      <Rocket className="w-6 h-6 text-white" />
                    ) : (
                      <Zap className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90`}
                    size="lg"
                  >
                    Select Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Step 2: Account Creation */}
        {step === "account" && selectedPlan && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>
                  Selected: <strong>{selectedPlan.name}</strong> ({selectedPlan.price}
                  {selectedPlan.period})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      disabled={loading}
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 6 characters
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="font-medium">What happens next:</span>
                    </div>
                    <ol className="text-xs text-muted-foreground space-y-1 ml-6 list-decimal">
                      <li>Your account will be created instantly</li>
                      <li>You&apos;ll be redirected to secure Paddle checkout</li>
                      <li>After payment, access all tools immediately</li>
                    </ol>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full bg-gradient-to-r ${selectedPlan.gradient} hover:opacity-90`}
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Continue to Payment
                        <TrendingUp className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep("plan")}
                    disabled={loading}
                  >
                    ← Back to plans
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <p className="text-xs text-center text-muted-foreground">
                  By continuing, you agree to our{" "}
                  <Link href="#" className="underline hover:text-primary">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline hover:text-primary">
                    Privacy Policy
                  </Link>
                </p>
                <div className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
