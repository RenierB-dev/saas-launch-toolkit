import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Zap, Shield, Clock } from "lucide-react"

export const metadata = {
  title: "Pricing",
  description: "Choose the perfect plan to launch your SaaS"
}

export default function PricingPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Early Bird Discount Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6 text-center">
          <div className="space-y-2">
            <Badge className="bg-white text-orange-600 font-semibold">
              🎉 LAUNCH SPECIAL
            </Badge>
            <h2 className="text-3xl font-bold">40% Off First Month!</h2>
            <p className="text-lg opacity-90">
              Use code <span className="font-mono font-bold bg-white/20 px-3 py-1 rounded">LAUNCH40</span> at checkout
            </p>
            <p className="text-sm opacity-75">
              Limited time offer · Only 47 spots remaining · Ends in 7 days
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that&apos;s right for your launch. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for trying out the toolkit</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button className="w-full" variant="outline">
                Get Started Free
              </Button>

              <div className="space-y-3">
                <h4 className="font-semibold">What&apos;s included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Access to all 5 core tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">5 saves per tool</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Basic templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Community support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Unlimited saves</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Early access to new features</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl">
              POPULAR
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For serious founders ready to launch</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Badge variant="secondary" className="w-fit mt-2">
                Save $100 with annual billing
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button className="w-full">
                Start Pro Trial
              </Button>

              <div className="space-y-3">
                <h4 className="font-semibold">Everything in Free, plus:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">Unlimited saves</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">Advanced templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">Priority email support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">Export to PDF/CSV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">Early access to new features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">Analytics & insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">Team collaboration (coming soon)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <Shield className="h-8 w-8 mx-auto text-primary" />
              <h3 className="font-semibold">30-Day Money-Back Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                Not satisfied? Get a full refund within 30 days, no questions asked.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <Zap className="h-8 w-8 mx-auto text-primary" />
              <h3 className="font-semibold">Instant Access</h3>
              <p className="text-sm text-muted-foreground">
                Start using all tools immediately after signing up. No waiting.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <Clock className="h-8 w-8 mx-auto text-primary" />
              <h3 className="font-semibold">Cancel Anytime</h3>
              <p className="text-sm text-muted-foreground">
                No long-term contracts. Cancel your subscription anytime.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>See exactly what&apos;s included in each plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Free</th>
                    <th className="text-center py-3 px-4">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3 px-4">ProductHunt Optimizer</td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Pricing Calculator</td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">30-Day Launch Sequence</td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Customer Acquisition Playbook</td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Marketing Asset Generator</td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Saves per tool</td>
                    <td className="text-center py-3 px-4 text-sm">5</td>
                    <td className="text-center py-3 px-4 text-sm">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Export to PDF/CSV</td>
                    <td className="text-center py-3 px-4"><X className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Priority Support</td>
                    <td className="text-center py-3 px-4"><X className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Early Access Features</td>
                    <td className="text-center py-3 px-4"><X className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Analytics Dashboard</td>
                    <td className="text-center py-3 px-4"><X className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Pricing FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards (Visa, MasterCard, American Express) via Stripe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a long-term contract?</h3>
              <p className="text-sm text-muted-foreground">
                No. All plans are month-to-month. Cancel anytime with no penalties.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens if I cancel?</h3>
              <p className="text-sm text-muted-foreground">
                You&apos;ll retain access until the end of your current billing period. Your data is kept for 30 days in case you want to reactivate.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer discounts for annual plans?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! Annual plans save you $100/year (2 months free). That&apos;s $249/year instead of $348.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-3xl font-bold">Ready to launch your SaaS?</h2>
          <p className="text-muted-foreground">
            Join hundreds of founders who&apos;ve successfully launched using our toolkit
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Start Free Trial</Button>
            <Button size="lg" variant="outline">See Demo</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
