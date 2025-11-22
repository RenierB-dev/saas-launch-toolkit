"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  Rocket,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  Mail,
  CheckSquare,
  Clock,
  Copy,
  Download,
  AlertTriangle,
  Info,
  Sparkles
} from "lucide-react"

// Title/Tagline Generation Templates
const titleTemplates = [
  (desc: string) => `Launch Your ${desc.split(' ').slice(0, 3).join(' ')}`,
  (desc: string) => `The Smart Way to ${desc.split(' ').slice(0, 3).join(' ')}`,
  (desc: string) => `${desc.split(' ')[0]} Made Simple`,
  (desc: string) => `Your AI-Powered ${desc.split(' ').slice(0, 2).join(' ')} Solution`,
  (desc: string) => `Build Better ${desc.split(' ').slice(0, 2).join(' ')}`,
  (desc: string) => `Ship ${desc.split(' ').slice(0, 2).join(' ')} Faster`,
  (desc: string) => `Modern ${desc.split(' ').slice(0, 3).join(' ')} Platform`,
  (desc: string) => `Transform Your ${desc.split(' ').slice(0, 2).join(' ')}`,
]

const taglineTemplates = [
  (desc: string) => `Everything you need to ${desc.toLowerCase().slice(0, 60)}`,
  (desc: string) => `${desc.slice(0, 60)} without the complexity`,
  (desc: string) => `Ship faster, launch better - ${desc.slice(0, 40)}`,
  (desc: string) => `The all-in-one platform for ${desc.slice(0, 50)}`,
  (desc: string) => `Stop struggling with ${desc.slice(0, 40)}. Start shipping today`,
  (desc: string) => `Built by founders, for founders who ${desc.slice(0, 40)}`,
  (desc: string) => `${desc.slice(0, 50)} in minutes, not months`,
  (desc: string) => `10x your ${desc.split(' ').slice(0, 3).join(' ')} productivity`,
]

// Email Templates
const emailTemplates = [
  {
    id: 1,
    title: "Cold Outreach to Top Hunter",
    subject: "Quick question about hunting [Product Name]",
    body: `Hi [Hunter Name],

I've been following your hunts on ProductHunt and really respect your taste in [their niche] products.

I'm launching [Product Name] - [one sentence pitch] - and I think it would resonate with your audience.

Would you be interested in hunting it? I'd love to share early access and more details.

Best,
[Your Name]`
  },
  {
    id: 2,
    title: "Warm Intro Request",
    subject: "Introduction to [Hunter Name]?",
    body: `Hey [Mutual Connection],

Hope you're doing well! I'm reaching out because I'm launching [Product Name] on ProductHunt next week.

I noticed you're connected to [Hunter Name] - would you feel comfortable making an introduction? I think they'd be genuinely interested in what we're building.

No pressure at all if it doesn't feel right!

Thanks,
[Your Name]`
  },
  {
    id: 3,
    title: "Post-Launch Thank You",
    subject: "Thank you for hunting [Product Name]!",
    body: `Hi [Hunter Name],

Just wanted to send a quick thank you for hunting [Product Name] today. Really appreciate you taking the time to support the launch!

The community response has been incredible - [share a metric or interesting feedback].

Let me know if there's anything I can help you with in the future.

Grateful,
[Your Name]`
  },
  {
    id: 4,
    title: "Follow-up If No Response",
    subject: "Following up on [Product Name]",
    body: `Hi [Hunter Name],

Following up on my previous email about [Product Name]. I know you're probably swamped with requests!

Just wanted to share that we've [recent achievement/traction]. I think this could be a strong ProductHunt launch.

Would love to chat if you're interested. If timing isn't right, totally understand.

Best,
[Your Name]`
  },
  {
    id: 5,
    title: "Collaboration Pitch",
    subject: "Collaboration opportunity - [Product Name]",
    body: `Hi [Hunter Name],

I'm [Your Name], building [Product Name] - [one sentence pitch].

What makes this different: [unique angle that aligns with hunter's interests].

Instead of just asking you to hunt it, I'd love to collaborate on the launch strategy. I value your expertise in [their niche].

Interested in a quick 15-min call?

Best,
[Your Name]`
  }
]

// Pre-Launch Checklist Items
const checklistItems = [
  "Set up ProductHunt Upcoming page (2 weeks before)",
  "Prepare all gallery assets (thumbnail, hero, 4 images, video/GIF)",
  "Write compelling first comment with key features",
  "Schedule social media posts across all platforms",
  "Email subscriber list with launch announcement",
  "Brief team on launch day responsibilities",
  "Set up analytics and tracking links",
  "Prepare and send hunter outreach emails",
  "Test all product links thoroughly",
  "Create press kit and media assets",
  "Plan 24-hour response and engagement strategy",
  "Engage beta users to support launch",
  "Prepare FAQ responses for common questions",
  "Set up dedicated support channels",
  "Get good sleep the night before launch!"
]

// Launch Day Schedule
const launchSchedule = [
  { time: "12:01 AM PST", task: "Launch goes live - Post first comment immediately", priority: "High", tips: "Be ready right at midnight. Your first comment sets the tone." },
  { time: "1:00 AM", task: "Monitor initial traction and respond to early comments", priority: "High", tips: "Early engagement signals are crucial for ranking." },
  { time: "6:00 AM", task: "Morning social media push (Twitter, LinkedIn)", priority: "High", tips: "Share with your audience. Use relevant hashtags." },
  { time: "9:00 AM", task: "Engage with every comment personally", priority: "High", tips: "Personal responses build community trust." },
  { time: "12:00 PM", task: "Peak traffic time - Be highly active", priority: "High", tips: "This is prime time. Maximum engagement." },
  { time: "3:00 PM", task: "Check ranking and continue engaging", priority: "Medium", tips: "Share progress milestones with supporters." },
  { time: "6:00 PM", task: "Evening social push, share milestones", priority: "Medium", tips: "Thank supporters publicly. Build momentum." },
  { time: "9:00 PM", task: "Final engagement push before day ends", priority: "High", tips: "Last chance for upvotes and comments." },
  { time: "11:00 PM", task: "Review day's metrics and thank everyone", priority: "Low", tips: "Reflect on learnings. Celebrate the launch!" }
]

export default function ProductHuntOptimizerPage() {
  const { toast } = useToast()
  const [launchDate, setLaunchDate] = useState<Date | undefined>()
  const [productDescription, setProductDescription] = useState("")
  const [titles, setTitles] = useState<string[]>([])
  const [taglines, setTaglines] = useState<string[]>([])
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(checklistItems.length).fill(false))
  const [scheduleChecked, setScheduleChecked] = useState<boolean[]>(new Array(launchSchedule.length).fill(false))

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  const generateTitlesAndTaglines = () => {
    if (!productDescription.trim()) {
      toast({
        title: "Description needed",
        description: "Please describe your product first",
        variant: "destructive"
      })
      return
    }

    const newTitles = titleTemplates.map(template =>
      template(productDescription).slice(0, 60)
    )
    const newTaglines = taglineTemplates.map(template =>
      template(productDescription).slice(0, 80)
    )

    setTitles(newTitles)
    setTaglines(newTaglines)

    toast({
      title: "Generated!",
      description: "8 title and tagline variations created",
    })
  }

  const checklistProgress = (checkedItems.filter(Boolean).length / checkedItems.length) * 100
  const scheduleProgress = (scheduleChecked.filter(Boolean).length / scheduleChecked.length) * 100

  const isWeekendOrBadDay = (date: Date | undefined) => {
    if (!date) return false
    const day = date.getDay()
    return day === 0 || day === 1 || day === 5 || day === 6 // Sun, Mon, Fri, Sat
  }

  const getOptimalTime = () => {
    if (!launchDate) return "Select a launch date first"
    const localTime = new Date(launchDate)
    localTime.setUTCHours(8, 1, 0) // 12:01 AM PST = 8:01 AM UTC
    return localTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const daysUntilLaunch = launchDate
    ? Math.ceil((launchDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-orange-600 flex items-center justify-center">
          <Rocket className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">ProductHunt Launch Optimizer</h1>
          <p className="text-muted-foreground">
            Plan, prepare, and execute the perfect ProductHunt launch
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="timing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="timing" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Timing</span>
          </TabsTrigger>
          <TabsTrigger value="title" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Title</span>
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Gallery</span>
          </TabsTrigger>
          <TabsTrigger value="outreach" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Outreach</span>
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Checklist</span>
          </TabsTrigger>
          <TabsTrigger value="playbook" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Playbook</span>
          </TabsTrigger>
        </TabsList>

        {/* LAUNCH TIMING TAB */}
        <TabsContent value="timing" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pick Your Launch Date</CardTitle>
                <CardDescription>Choose when to launch on ProductHunt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Calendar
                  mode="single"
                  selected={launchDate}
                  onSelect={setLaunchDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
                {launchDate && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected: {launchDate.toLocaleDateString()}</p>
                    {daysUntilLaunch !== null && (
                      <Badge variant="secondary">
                        {daysUntilLaunch} days until launch
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Optimal Launch Time</CardTitle>
                  <CardDescription>Best time to maximize visibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-orange-500/10 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">ProductHunt Recommendation</p>
                    <p className="text-2xl font-bold">Tuesday-Thursday</p>
                    <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">12:01 AM PST</p>
                  </div>

                  {launchDate && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Your local time</p>
                      <p className="text-xl font-bold">{getOptimalTime()}</p>
                    </div>
                  )}

                  <Button className="w-full" onClick={() => copyToClipboard(getOptimalTime(), "Launch time")}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Time to Clipboard
                  </Button>
                </CardContent>
              </Card>

              {launchDate && isWeekendOrBadDay(launchDate) && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Suboptimal Day</AlertTitle>
                  <AlertDescription>
                    Launching on Mondays, Fridays, or weekends typically gets less traction.
                    Consider Tuesday-Thursday for best results.
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <CardTitle>Why This Matters</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• <strong>12:01 AM PST:</strong> ProductHunt resets daily at this time</p>
                  <p>• <strong>Tue-Thu:</strong> Highest traffic and engagement days</p>
                  <p>• <strong>Avoid Mon:</strong> Makers catch up from weekend</p>
                  <p>• <strong>Avoid Fri-Sun:</strong> Lower community activity</p>
                  <p>• <strong>Early engagement:</strong> Critical for ranking algorithm</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TITLE & TAGLINE TAB */}
        <TabsContent value="title" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Title & Tagline Ideas</CardTitle>
              <CardDescription>AI-powered suggestions based on your product description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Describe your product in 2-3 sentences</Label>
                <Textarea
                  id="description"
                  placeholder="Example: A tool that helps solo founders launch their SaaS products in 30 days. It provides step-by-step guidance, templates, and automation for ProductHunt launches, pricing strategy, and customer acquisition."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={generateTitlesAndTaglines} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Ideas
              </Button>
            </CardContent>
          </Card>

          {titles.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Title Variations (Max 60 chars)</CardTitle>
                  <CardDescription>Click to copy any title</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-3">
                  {titles.map((title, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors group"
                      onClick={() => copyToClipboard(title, "Title")}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium flex-1">{title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {title.length}/60
                          </Badge>
                          <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tagline Variations (Max 80 chars)</CardTitle>
                  <CardDescription>Click to copy any tagline</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-3">
                  {taglines.map((tagline, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors group"
                      onClick={() => copyToClipboard(tagline, "Tagline")}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="flex-1">{tagline}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {tagline.length}/80
                          </Badge>
                          <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* GALLERY ASSETS TAB */}
        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Asset Checklist</CardTitle>
              <CardDescription>Prepare all required images and media for your launch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: "Thumbnail", size: "240x240px", required: true },
                { name: "Hero Image", size: "1270x760px", required: true },
                { name: "Gallery Image 1", size: "1270x760px", required: false },
                { name: "Gallery Image 2", size: "1270x760px", required: false },
                { name: "Gallery Image 3", size: "1270x760px", required: false },
                { name: "Gallery Image 4", size: "1270x760px", required: false },
                { name: "Demo Video/GIF", size: "Max 30 seconds", required: false },
                { name: "Logo", size: "Square, transparent", required: true },
              ].map((asset, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Checkbox id={`asset-${idx}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`asset-${idx}`} className="font-medium">
                        {asset.name}
                      </Label>
                      {asset.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{asset.size}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Upload
                  </Button>
                </div>
              ))}

              <Separator />

              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Template Pack
              </Button>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Pro Tips</AlertTitle>
                <AlertDescription className="space-y-1">
                  <p>• Use bright, high-contrast images that stand out</p>
                  <p>• Show your product in action, not just screenshots</p>
                  <p>• Maintain consistent branding across all assets</p>
                  <p>• Compress images to load fast (use TinyPNG)</p>
                  <p>• Test how they look on mobile devices</p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HUNTER OUTREACH TAB */}
        <TabsContent value="outreach" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {emailTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`Subject: ${template.subject}\n\n${template.body}`, template.title)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <CardDescription>Subject: {template.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm whitespace-pre-wrap font-sans bg-muted p-4 rounded-lg">
                      {template.body}
                    </pre>
                    <p className="text-xs text-muted-foreground mt-2">
                      {template.subject.length + template.body.length} characters
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How to Find Hunters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold mb-1">1. Browse Top Hunters</p>
                    <p className="text-muted-foreground">Visit producthunt.com/hunters and filter by category</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">2. Check Similar Products</p>
                    <p className="text-muted-foreground">See who hunted products similar to yours</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">3. Look at Engagement</p>
                    <p className="text-muted-foreground">Hunters who actively comment and engage</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">4. Twitter Search</p>
                    <p className="text-muted-foreground">Search &quot;ProductHunt hunter&quot; to find active hunters</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>When to Reach Out</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <Alert>
                    <CalendarIcon className="h-4 w-4" />
                    <AlertTitle>2-3 Weeks Before Launch</AlertTitle>
                    <AlertDescription>
                      Ideal timeframe to connect with hunters. Not too early, not too last-minute.
                    </AlertDescription>
                  </Alert>
                  <p className="text-muted-foreground">• Give them time to review your product</p>
                  <p className="text-muted-foreground">• Build a genuine connection first</p>
                  <p className="text-muted-foreground">• Follow up once if no response</p>
                  <p className="text-muted-foreground">• Offer early access or demo</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Personalize every outreach email</p>
                  <p>✓ Show you know their previous hunts</p>
                  <p>✓ Be genuine, not salesy</p>
                  <p>✓ Respect their time and decision</p>
                  <p>✓ Offer value (exclusive access, insights)</p>
                  <p>✗ Don&apos;t mass email hunters</p>
                  <p>✗ Don&apos;t be pushy or desperate</p>
                  <p>✗ Don&apos;t reach out day before launch</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* PRE-LAUNCH CHECKLIST TAB */}
        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pre-Launch Checklist</CardTitle>
                  <CardDescription>
                    Complete these tasks before your launch
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{checkedItems.filter(Boolean).length}/{checklistItems.length}</p>
                  <p className="text-sm text-muted-foreground">tasks completed</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Progress</p>
                  <p className="text-sm text-muted-foreground">{Math.round(checklistProgress)}%</p>
                </div>
                <Progress value={checklistProgress} className="h-3" />
              </div>

              <div className="space-y-3">
                {checklistItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <Checkbox
                      id={`check-${idx}`}
                      checked={checkedItems[idx]}
                      onCheckedChange={(checked) => {
                        const newChecked = [...checkedItems]
                        newChecked[idx] = checked as boolean
                        setCheckedItems(newChecked)
                      }}
                    />
                    <Label
                      htmlFor={`check-${idx}`}
                      className={`flex-1 cursor-pointer ${checkedItems[idx] ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Checklist
                </Button>
              </div>

              {checklistProgress === 100 && (
                <Alert>
                  <CheckSquare className="h-4 w-4" />
                  <AlertTitle>You&apos;re Ready to Launch! 🎉</AlertTitle>
                  <AlertDescription>
                    All pre-launch tasks completed. Review your Launch Day Playbook next!
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* LAUNCH DAY PLAYBOOK TAB */}
        <TabsContent value="playbook" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Launch Day Playbook</CardTitle>
                  <CardDescription>
                    Your hour-by-hour guide for launch day success
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{scheduleChecked.filter(Boolean).length}/{launchSchedule.length}</p>
                  <p className="text-sm text-muted-foreground">tasks done</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Day Progress</p>
                  <p className="text-sm text-muted-foreground">{Math.round(scheduleProgress)}%</p>
                </div>
                <Progress value={scheduleProgress} className="h-3" />
              </div>

              <div className="space-y-4">
                {launchSchedule.map((item, idx) => (
                  <Card key={idx} className={scheduleChecked[idx] ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id={`schedule-${idx}`}
                          checked={scheduleChecked[idx]}
                          onCheckedChange={(checked) => {
                            const newChecked = [...scheduleChecked]
                            newChecked[idx] = checked as boolean
                            setScheduleChecked(newChecked)
                          }}
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`schedule-${idx}`} className="text-base font-semibold cursor-pointer">
                              {item.time}
                            </Label>
                            <Badge variant={
                              item.priority === "High" ? "destructive" :
                              item.priority === "Medium" ? "default" :
                              "secondary"
                            }>
                              {item.priority}
                            </Badge>
                          </div>
                          <p className={scheduleChecked[idx] ? 'line-through text-muted-foreground' : ''}>
                            {item.task}
                          </p>
                          <p className="text-sm text-muted-foreground italic">
                            💡 {item.tips}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const schedule = launchSchedule.map(item =>
                      `${item.time} - ${item.task}\n${item.tips}`
                    ).join('\n\n')
                    copyToClipboard(schedule, "Launch day schedule")
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Entire Schedule
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email to Me
                </Button>
              </div>

              {scheduleProgress === 100 && (
                <Alert>
                  <CheckSquare className="h-4 w-4" />
                  <AlertTitle>Launch Day Complete! 🚀</AlertTitle>
                  <AlertDescription>
                    Congratulations on your ProductHunt launch! Take a moment to celebrate, then analyze the results and engage with your new community.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
