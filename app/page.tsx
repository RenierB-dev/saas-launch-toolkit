import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Rocket, DollarSign, Calendar, Users, FileText, Check } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 opacity-10" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="mb-4">Built by a founder who shipped 4 products</Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Launch Your SaaS in 30 Days
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Stop overthinking. Start shipping. Everything you need to launch your SaaS product and get your first customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Launch</h2>
          <p className="text-xl text-muted-foreground">Five battle-tested tools to accelerate your launch</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-purple-500 transition-colors">
            <CardHeader>
              <Rocket className="h-10 w-10 mb-2 text-purple-600" />
              <CardTitle>ProductHunt Launch Optimizer</CardTitle>
              <CardDescription>
                Maximize your ProductHunt launch with proven templates, timing strategies, and engagement tactics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <DollarSign className="h-10 w-10 mb-2 text-blue-600" />
              <CardTitle>Pricing Strategy Calculator</CardTitle>
              <CardDescription>
                Find the perfect pricing model for your SaaS. Compare one-time vs subscription revenue projections.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-500 transition-colors">
            <CardHeader>
              <Calendar className="h-10 w-10 mb-2 text-purple-600" />
              <CardTitle>30-Day Launch Sequence</CardTitle>
              <CardDescription>
                Step-by-step daily checklist to go from idea to launched product in just 30 days.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Users className="h-10 w-10 mb-2 text-blue-600" />
              <CardTitle>First 100 Customers Playbook</CardTitle>
              <CardDescription>
                Proven channels and tactics to acquire your first paying customers without a marketing budget.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-500 transition-colors">
            <CardHeader>
              <FileText className="h-10 w-10 mb-2 text-purple-600" />
              <CardTitle>Marketing Asset Generator</CardTitle>
              <CardDescription>
                Generate landing page copy, social media posts, and email templates tailored to your product.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-colors bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader>
              <CardTitle className="text-center">+ More Tools Coming</CardTitle>
              <CardDescription className="text-center">
                Continuous updates with new launch tools and strategies based on real founder feedback.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-24 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground">Choose the plan that works for you</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">One-Time Purchase</CardTitle>
              <CardDescription>Perfect for a single launch</CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold">$49</span>
                <span className="text-muted-foreground ml-2">once</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Launch once, access forever</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>All 5 launch tools included</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Lifetime access to tools</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>30-day money-back guarantee</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/signup" className="w-full">
                <Button className="w-full" size="lg">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-2 border-purple-600 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro Monthly</CardTitle>
              <CardDescription>For ongoing launches and updates</CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold">$19</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Everything in One-Time</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Monthly tool updates & new features</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Priority email support</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Launch multiple products</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/signup" className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600" size="lg">
                  Start Free Trial
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Trusted by Solo Founders</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600" />
                <div>
                  <CardTitle className="text-base">Sarah Chen</CardTitle>
                  <CardDescription className="text-sm">@sarahbuilds</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                &ldquo;Launched my SaaS in 28 days using this toolkit. Got my first 50 customers within the first week. Best $49 I&apos;ve spent.&rdquo;
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600" />
                <div>
                  <CardTitle className="text-base">Marcus Rodriguez</CardTitle>
                  <CardDescription className="text-sm">@marcuscodes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                &ldquo;The pricing calculator alone saved me weeks of spreadsheet hell. Finally confident in my pricing strategy.&rdquo;
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600" />
                <div>
                  <CardTitle className="text-base">Emily Park</CardTitle>
                  <CardDescription className="text-sm">@emilyships</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                &ldquo;ProductHunt launch went better than expected. Hit #2 Product of the Day following the optimizer checklist.&rdquo;
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">SaaS Launch Toolkit</h3>
              <p className="text-sm text-muted-foreground">
                Launch your SaaS in 30 days with battle-tested tools and strategies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">Documentation</Link></li>
                <li><Link href="#">Blog</Link></li>
                <li><Link href="#">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">Privacy Policy</Link></li>
                <li><Link href="#">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 SaaS Launch Toolkit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
