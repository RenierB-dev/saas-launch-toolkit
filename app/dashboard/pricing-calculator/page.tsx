import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator } from "lucide-react"

export default function PricingCalculatorPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Calculator className="h-10 w-10 text-blue-600" />
        <div>
          <h1 className="text-4xl font-bold">Pricing Strategy Calculator</h1>
          <p className="text-muted-foreground">
            Find the optimal pricing for your SaaS
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Coming Soon</CardTitle>
            <Badge>Under Development</Badge>
          </div>
          <CardDescription>
            This tool is currently being built. Check back soon for pricing models, revenue projections, and competitor analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">What to expect:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• One-time vs subscription revenue comparison</li>
              <li>• Tiered pricing strategy builder</li>
              <li>• Lifetime value calculator</li>
              <li>• Competitive pricing analysis</li>
              <li>• Price optimization recommendations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
