import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  Rocket,
  Calculator,
  Calendar,
  Users,
  FileText,
  CheckCircle2,
  Circle,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back, User!</h1>
        <p className="text-muted-foreground">
          Let&apos;s continue building and launching your SaaS
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools Used</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 / 5</div>
            <p className="text-xs text-muted-foreground">
              60% of toolkit explored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Launches Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Active</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              23 days until launch
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started Checklist</CardTitle>
          <CardDescription>
            Complete these steps to maximize your launch success
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Create your account</p>
              <p className="text-sm text-muted-foreground">
                You&apos;re all set up and ready to go
              </p>
            </div>
            <Badge variant="secondary">Complete</Badge>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Define your pricing strategy</p>
              <p className="text-sm text-muted-foreground">
                Use the Pricing Calculator to find the optimal price point
              </p>
            </div>
            <Badge variant="outline">Pending</Badge>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Plan your ProductHunt launch</p>
              <p className="text-sm text-muted-foreground">
                Prepare your launch materials and strategy
              </p>
            </div>
            <Badge variant="outline">Pending</Badge>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Set up your 30-day launch sequence</p>
              <p className="text-sm text-muted-foreground">
                Get your personalized daily action plan
              </p>
            </div>
            <Badge variant="outline">Pending</Badge>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Generate your marketing assets</p>
              <p className="text-sm text-muted-foreground">
                Create compelling copy for your landing page and campaigns
              </p>
            </div>
            <Badge variant="outline">Pending</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump into the tools you need most</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/producthunt-optimizer">
            <Button variant="outline" className="w-full h-auto flex-col items-start p-4 gap-2">
              <Rocket className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold">ProductHunt Optimizer</p>
                <p className="text-xs text-muted-foreground font-normal">
                  Plan your launch
                </p>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/pricing-calculator">
            <Button variant="outline" className="w-full h-auto flex-col items-start p-4 gap-2">
              <Calculator className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold">Pricing Calculator</p>
                <p className="text-xs text-muted-foreground font-normal">
                  Find your price
                </p>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/launch-sequence">
            <Button variant="outline" className="w-full h-auto flex-col items-start p-4 gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold">Launch Sequence</p>
                <p className="text-xs text-muted-foreground font-normal">
                  30-day plan
                </p>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/customer-acquisition">
            <Button variant="outline" className="w-full h-auto flex-col items-start p-4 gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold">Get Customers</p>
                <p className="text-xs text-muted-foreground font-normal">
                  First 100 playbook
                </p>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/marketing-assets">
            <Button variant="outline" className="w-full h-auto flex-col items-start p-4 gap-2">
              <FileText className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold">Marketing Assets</p>
                <p className="text-xs text-muted-foreground font-normal">
                  Generate copy
                </p>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
