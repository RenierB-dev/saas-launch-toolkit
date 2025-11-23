import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

export default function LaunchSequencePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Calendar className="h-10 w-10 text-purple-600" />
        <div>
          <h1 className="text-4xl font-bold">30-Day Launch Sequence</h1>
          <p className="text-muted-foreground">
            Your step-by-step plan to launch
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
            This tool is currently being built. Check back soon for your personalized 30-day launch roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">What to expect:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Daily action items and milestones</li>
              <li>• Week-by-week progress tracking</li>
              <li>• Pre-launch preparation checklist</li>
              <li>• Launch day execution plan</li>
              <li>• Post-launch optimization tasks</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
