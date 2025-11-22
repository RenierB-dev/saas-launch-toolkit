import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

export default function MarketingAssetsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <FileText className="h-10 w-10 text-purple-600" />
        <div>
          <h1 className="text-4xl font-bold">Marketing Asset Generator</h1>
          <p className="text-muted-foreground">
            Create compelling marketing materials
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
            This tool is currently being built. Check back soon for AI-powered marketing copy generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">What to expect:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Landing page copy templates</li>
              <li>• Social media post generator</li>
              <li>• Email campaign templates</li>
              <li>• Ad copy variations</li>
              <li>• Value proposition builder</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
