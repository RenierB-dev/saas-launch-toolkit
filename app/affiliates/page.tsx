import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, TrendingUp, Gift } from "lucide-react"

export const metadata = {
  title: "Affiliate Program",
  description: "Join our affiliate program and earn 30% commission"
}

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
            <DollarSign className="h-3 w-3 mr-1" />
            Earn 30% Commission
          </Badge>
          <h1 className="text-5xl font-bold">Affiliate Program</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Earn recurring revenue by referring founders to SaaS Launch Toolkit
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <DollarSign className="h-10 w-10 mx-auto text-green-500" />
              <h3 className="font-semibold text-2xl">30%</h3>
              <p className="text-sm text-muted-foreground">
                Recurring commission on all referrals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <Users className="h-10 w-10 mx-auto text-blue-500" />
              <h3 className="font-semibold text-2xl">12 Months</h3>
              <p className="text-sm text-muted-foreground">
                Cookie duration for tracking referrals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <TrendingUp className="h-10 w-10 mx-auto text-purple-500" />
              <h3 className="font-semibold text-2xl">$8.70</h3>
              <p className="text-sm text-muted-foreground">
                Average commission per referral
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Start earning in 3 simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Sign Up</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your affiliate account and get your unique referral link
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Share</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your link with your audience on Twitter, blog, newsletter, or YouTube
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Earn</h3>
                  <p className="text-sm text-muted-foreground">
                    Get 30% recurring commission for every Pro subscriber you refer
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commission Calculator */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle>Earnings Calculator</CardTitle>
            </div>
            <CardDescription>See how much you can earn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">10 referrals/month</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">$87/mo</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">25 referrals/month</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">$217/mo</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">50 referrals/month</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">$435/mo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Form */}
        <Card>
          <CardHeader>
            <CardTitle>Join the Affiliate Program</CardTitle>
            <CardDescription>Start earning today - it&apos;s free to join</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website or Social Profile</Label>
                <Input id="website" placeholder="https://twitter.com/yourusername" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Tell us about your audience</Label>
                <Input id="audience" placeholder="e.g., 10K founders on Twitter" />
              </div>

              <Button className="w-full" size="lg">
                Apply to Join
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                We&apos;ll review your application and get back to you within 24 hours
              </p>
            </form>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">How do I get paid?</h3>
              <p className="text-sm text-muted-foreground">
                Payouts are made monthly via PayPal or bank transfer once you reach $100 in commissions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">How long do cookies last?</h3>
              <p className="text-sm text-muted-foreground">
                Our cookies last 12 months, so you&apos;ll get credit for any purchase made within a year of the initial click.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Is there a minimum traffic requirement?</h3>
              <p className="text-sm text-muted-foreground">
                No! We welcome affiliates of all sizes. Quality content matters more than traffic numbers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Do I get commission on renewals?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You earn 30% on all subscription renewals for the lifetime of the customer.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold">Ready to start earning?</h2>
          <p className="text-muted-foreground">
            Join hundreds of affiliates earning recurring commissions
          </p>
          <Button size="lg">Apply Now</Button>
        </div>
      </div>
    </div>
  )
}
