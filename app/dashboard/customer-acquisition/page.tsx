import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

export default function CustomerAcquisitionPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Users className="h-10 w-10 text-blue-600" />
        <div>
          <h1 className="text-4xl font-bold">First 100 Customers Playbook</h1>
          <p className="text-muted-foreground">
            Acquire your first paying customers
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
            This tool is currently being built. Check back soon for proven acquisition channels and tactics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">What to expect:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Zero-budget marketing channels</li>
              <li>• Community engagement strategies</li>
              <li>• Cold outreach templates</li>
              <li>• Partnership opportunities</li>
              <li>• Referral program setup</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
