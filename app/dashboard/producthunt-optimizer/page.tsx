import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket } from "lucide-react"

export default function ProductHuntOptimizerPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Rocket className="h-10 w-10 text-purple-600" />
        <div>
          <h1 className="text-4xl font-bold">ProductHunt Launch Optimizer</h1>
          <p className="text-muted-foreground">
            Maximize your ProductHunt launch success
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
            This tool is currently being built. Check back soon for launch templates, timing strategies, and engagement tactics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">What to expect:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Launch day timeline and checklist</li>
              <li>• ProductHunt post templates</li>
              <li>• Hunter outreach strategies</li>
              <li>• Community engagement tactics</li>
              <li>• Post-launch follow-up plan</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
