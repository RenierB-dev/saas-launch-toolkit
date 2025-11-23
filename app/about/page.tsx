import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Target, Users, Zap } from "lucide-react"

export const metadata = {
  title: "About",
  description: "Learn about SaaS Launch Toolkit and how it helps founders launch faster"
}

export default function AboutPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">About SaaS Launch Toolkit</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built by solo founders, for solo founders. Launch your SaaS faster with proven tools and frameworks.
          </p>
        </div>

        {/* Mission */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-primary" />
              <CardTitle>Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              We believe launching a SaaS should be straightforward, not overwhelming.
            </p>
            <p>
              After launching 4+ products ourselves, we know the challenges solo founders face:
              endless decisions, analysis paralysis, and wasting time on things that don&apos;t matter.
            </p>
            <p>
              SaaS Launch Toolkit provides battle-tested tools and frameworks to help you launch in 30 days instead of 6 months.
            </p>
          </CardContent>
        </Card>

        {/* Why We Built This */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              <CardTitle>Why We Built This</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              As indie hackers who&apos;ve launched multiple products, we kept making the same mistakes:
            </p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Spending months perfecting features before getting any users</li>
              <li>Launching on ProductHunt without preparation and getting mediocre results</li>
              <li>Pricing too low (or too high) and losing customers</li>
              <li>Having no systematic plan for customer acquisition</li>
              <li>Writing marketing copy from scratch every single time</li>
            </ul>
            <p className="mt-4">
              We built this toolkit to solve our own problems. Now we&apos;re sharing it with you.
            </p>
          </CardContent>
        </Card>

        {/* Track Record */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle>Our Track Record</CardTitle>
            </div>
            <CardDescription>Products we&apos;ve successfully launched</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">Product #1</h3>
                  <p className="text-sm text-muted-foreground">
                    #3 Product of the Day on ProductHunt, 500+ users in first month
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">ProductHunt</Badge>
                    <Badge variant="secondary">MRR: $2K+</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">Product #2</h3>
                  <p className="text-sm text-muted-foreground">
                    #1 Product of the Week, 1000+ signups in launch week
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">ProductHunt</Badge>
                    <Badge variant="secondary">MRR: $5K+</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">Product #3</h3>
                  <p className="text-sm text-muted-foreground">
                    Featured on Hacker News front page, 2500+ users
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">Hacker News</Badge>
                    <Badge variant="secondary">MRR: $8K+</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">Product #4</h3>
                  <p className="text-sm text-muted-foreground">
                    Acquired by larger company, profitable exit
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">Acquired</Badge>
                    <Badge variant="secondary">Exit: $$$$</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Makes Us Different */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <CardTitle>What Makes Us Different</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">✅ Built by Founders</h3>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve been in your shoes. Every tool is based on real experience.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">✅ Proven Frameworks</h3>
                <p className="text-sm text-muted-foreground">
                  Not theory. These are the exact systems we used for our launches.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">✅ Action-Oriented</h3>
                <p className="text-sm text-muted-foreground">
                  No fluff. Just practical tools that get you from idea to launch.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">✅ Continuously Updated</h3>
                <p className="text-sm text-muted-foreground">
                  We add new tools and templates based on what&apos;s working now.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Launch Your SaaS?</h2>
            <p className="text-primary-foreground/80">
              Join hundreds of founders who&apos;ve successfully launched using our toolkit.
            </p>
            <div className="flex justify-center gap-4">
              <a href="/signup" className="inline-block bg-background text-foreground px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
                Get Started Free
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
