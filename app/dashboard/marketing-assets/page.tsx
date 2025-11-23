"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Share2, Mail, FileText, Copy, Sparkles } from "lucide-react"

interface SocialPost {
  id: string
  text: string
  characterCount: number
}

interface EmailTemplate {
  id: string
  subject: string
  body: string
}

interface LaunchCopy {
  headlines: string[]
  taglines: string[]
  ctas: string[]
}

export default function MarketingAssetsPage() {
  const { toast } = useToast()

  // Social Media state
  const [productName, setProductName] = useState("")
  const [keyBenefit, setKeyBenefit] = useState("")
  const [platform, setPlatform] = useState("twitter")
  const [tone, setTone] = useState("professional")
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])

  // Email state
  const [emailType, setEmailType] = useState("launch")
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])

  // Launch Copy state
  const [launchProductName, setLaunchProductName] = useState("")
  const [whatItDoes, setWhatItDoes] = useState("")
  const [whoItsFor, setWhoItsFor] = useState("")
  const [launchCopy, setLaunchCopy] = useState<LaunchCopy | null>(null)

  // Generate Social Media Posts
  const generateSocialPosts = () => {
    if (!productName || !keyBenefit) {
      toast({
        title: "Missing Information",
        description: "Please fill in product name and key benefit",
        variant: "destructive"
      })
      return
    }

    const posts: SocialPost[] = []

    if (platform === "twitter") {
      const twitterPosts = [
        `🚀 Introducing ${productName}!\n\nWe help you ${keyBenefit}.\n\nTry it free → [link]`,
        `${productName} makes it easy to ${keyBenefit}.\n\nNo credit card required.\nGet started in 2 minutes.\n\n→ [link]`,
        `Tired of complicated solutions?\n\n${productName} helps you ${keyBenefit} with zero hassle.\n\nStart free: [link]`,
        `${productName} = ${keyBenefit}\n\nSimple as that. ✨\n\nJoin 1000+ users → [link]`,
        `What if you could ${keyBenefit} in half the time?\n\n${productName} makes it possible.\n\nTry it now → [link]`
      ]

      if (tone === "casual") {
        posts.push({
          id: "1",
          text: `hey! just launched ${productName} 👋\n\nit helps you ${keyBenefit}\n\nwould love your feedback! → [link]`,
          characterCount: 0
        })
        posts.push({
          id: "2",
          text: `${productName} is live! 🎉\n\nfinally, an easy way to ${keyBenefit}\n\ncheck it out → [link]`,
          characterCount: 0
        })
      } else if (tone === "funny") {
        posts.push({
          id: "1",
          text: `we built ${productName} so you can ${keyBenefit}\n\n(and stop doing it the hard way like a caveman 🦴)\n\ntry it → [link]`,
          characterCount: 0
        })
        posts.push({
          id: "2",
          text: `${productName}: because life's too short to not ${keyBenefit} efficiently\n\n😎 get started → [link]`,
          characterCount: 0
        })
      } else {
        twitterPosts.forEach((text, i) => {
          posts.push({
            id: `${i + 1}`,
            text,
            characterCount: text.length
          })
        })
      }
    }

    if (platform === "linkedin") {
      const linkedInPosts = [
        `Excited to announce ${productName}! 🚀\n\nWe've built a solution that helps professionals ${keyBenefit}.\n\nAfter months of development and user feedback, we're ready to share it with the world.\n\nKey features:\n→ Easy to use\n→ Saves time\n→ Gets results\n\nInterested? Let's connect: [link]\n\n#SaaS #Productivity #Innovation`,
        `Problem: Most teams struggle to ${keyBenefit}\n\nSolution: ${productName}\n\nWe're helping companies streamline their workflow and achieve better results.\n\nTry it free: [link]\n\n#Business #Technology #Growth`,
        `${productName} is now live!\n\nOur mission: Make it simple for everyone to ${keyBenefit}.\n\nWe believe that powerful tools should be easy to use.\n\nThat's why we built ${productName}.\n\nLearn more: [link]\n\n#ProductLaunch #StartupLife`,
        `Introducing ${productName} - your new favorite tool to ${keyBenefit}.\n\n✅ Quick setup\n✅ Intuitive interface\n✅ Measurable results\n\nJoin our growing community: [link]\n\n#Tech #Innovation #Productivity`,
        `After working with hundreds of users, we identified a common challenge:\n\n"How can we ${keyBenefit} more efficiently?"\n\n${productName} is our answer.\n\nDiscover how: [link]\n\n#Leadership #Business #Technology`
      ]

      linkedInPosts.forEach((text, i) => {
        posts.push({
          id: `${i + 1}`,
          text,
          characterCount: text.length
        })
      })
    }

    if (platform === "facebook") {
      const facebookPosts = [
        `🎉 We're so excited to share ${productName} with you!\n\nIt's designed to help you ${keyBenefit}.\n\nWe've made it super simple to use - you can get started in just 2 minutes.\n\nTry it free: [link]\n\nLet us know what you think! 💙`,
        `Introducing ${productName}! ✨\n\nThe easiest way to ${keyBenefit}.\n\n👉 No complicated setup\n👉 No credit card required\n👉 Start seeing results today\n\nCheck it out: [link]`,
        `Hey friends! 👋\n\nWe just launched ${productName} and we'd love your feedback!\n\nIt helps you ${keyBenefit} without the usual headaches.\n\nFree to try: [link]\n\nShare with anyone who might benefit! 🙏`,
        `${productName} is here! 🚀\n\nWe built this tool to solve one problem: making it easy to ${keyBenefit}.\n\nOver 1,000 people are already using it.\n\nJoin them: [link]\n\nQuestions? Drop them in the comments! ⬇️`,
        `Looking for a better way to ${keyBenefit}?\n\nMeet ${productName}. 💪\n\nIt's fast, simple, and actually works.\n\nGet started now: [link]\n\n(Your future self will thank you!)`
      ]

      facebookPosts.forEach((text, i) => {
        posts.push({
          id: `${i + 1}`,
          text,
          characterCount: text.length
        })
      })
    }

    // Fill character counts
    posts.forEach(post => {
      post.characterCount = post.text.length
    })

    setSocialPosts(posts)

    toast({
      title: "Posts Generated!",
      description: `Created ${posts.length} ${platform} posts`
    })
  }

  // Generate Email Templates
  const generateEmails = () => {
    const templates: EmailTemplate[] = []

    if (emailType === "launch") {
      templates.push({
        id: "1",
        subject: `🚀 Introducing ${productName || "[Your Product]"} - ${keyBenefit || "[Your Benefit]"}`,
        body: `Hi {firstName},

I'm excited to share something we've been working on for months: ${productName || "[Your Product]"}.

The Problem:
Most people struggle to ${keyBenefit || "[achieve your benefit]"} efficiently. Current solutions are either too complicated, too expensive, or just don't work well.

Our Solution:
${productName || "[Your Product]"} makes it incredibly easy to ${keyBenefit || "[achieve your benefit]"}. We've stripped away all the complexity and focused on what actually matters.

You can get started in less than 2 minutes, and it's completely free to try.

Ready to give it a shot?

[Get Started Free]

Best regards,
[Your Name]

P.S. As an early user, you'll get lifetime access to premium features. This offer won't last long!`
      })

      templates.push({
        id: "2",
        subject: `${productName || "[Your Product]"} is live! 🎉`,
        body: `Hey {firstName},

Big news! ${productName || "[Your Product]"} just launched.

We built this because we were frustrated with how hard it is to ${keyBenefit || "[achieve your benefit]"}. So we created something better.

What makes it different:
• Quick setup (under 2 minutes)
• No learning curve
• Actually works

Try it free: [link]

Let me know what you think!

[Your Name]

P.S. The first 100 users get exclusive early-bird pricing. Claim your spot now!`
      })

      templates.push({
        id: "3",
        subject: `You're invited to try ${productName || "[Your Product]"} (free)`,
        body: `Hi {firstName},

After months of development and testing, ${productName || "[Your Product]"} is finally ready.

It's a new way to ${keyBenefit || "[achieve your benefit]"} that's actually simple to use.

Here's what you can do with it:
→ [Feature 1]
→ [Feature 2]
→ [Feature 3]

The best part? It's free to start, and you'll see results on day one.

[Try ${productName || "[Your Product]"} Free]

Questions? Just reply to this email.

Best,
[Your Name]

P.S. We're offering a 30-day money-back guarantee. Zero risk.`
      })
    }

    if (emailType === "feature") {
      templates.push({
        id: "1",
        subject: `New: [Feature Name] is now available in ${productName || "[Your Product]"}`,
        body: `Hi {firstName},

We just shipped something you've been asking for: [Feature Name]!

This new feature helps you ${keyBenefit || "[achieve your benefit]"} even faster.

What's new:
• [Feature detail 1]
• [Feature detail 2]
• [Feature detail 3]

It's available now in your dashboard.

[Check It Out]

Happy to hear your feedback!

[Your Name]

P.S. More updates coming soon. Stay tuned!`
      })

      templates.push({
        id: "2",
        subject: `${productName || "[Your Product]"} just got better ✨`,
        body: `Hey {firstName},

Great news! We just released [Feature Name] in ${productName || "[Your Product]"}.

Based on your feedback, we've made it easier to ${keyBenefit || "[achieve your benefit]"}.

Here's what you can do now:
→ [Benefit 1]
→ [Benefit 2]
→ [Benefit 3]

Try it out: [link]

Let us know what you think!

[Your Name]

P.S. Check out our roadmap to see what's coming next: [link]`
      })

      templates.push({
        id: "3",
        subject: `📢 Feature Update: ${productName || "[Your Product]"}`,
        body: `Hi {firstName},

Quick update: We've just added [Feature Name] to ${productName || "[Your Product]"}!

This was one of your most requested features, and we're excited to finally deliver it.

Why it matters:
You can now ${keyBenefit || "[achieve your benefit]"} with even less effort.

[See What's New]

As always, we'd love your feedback.

Best,
[Your Name]

P.S. Need help getting started? Our support team is here: [link]`
      })
    }

    if (emailType === "newsletter") {
      templates.push({
        id: "1",
        subject: `${productName || "[Your Product]"} Weekly: Tips, Updates & More`,
        body: `Hi {firstName},

Welcome to this week's ${productName || "[Your Product]"} newsletter!

📰 What's New:
We shipped [Feature/Update] this week. Check it out: [link]

💡 Tip of the Week:
Did you know you can ${keyBenefit || "[achieve your benefit]"} 2x faster by [tip]? Try it today!

📊 By the Numbers:
• [Stat 1]
• [Stat 2]
• [Stat 3]

🎓 Recommended Reading:
[Article title] - [link]

That's all for this week!

[Your Name]

P.S. Have a question or suggestion? Just hit reply!`
      })

      templates.push({
        id: "2",
        subject: `Your weekly dose of ${productName || "[Your Product]"} goodness`,
        body: `Hey {firstName},

Here's what's happening this week in ${productName || "[Your Product]"}:

🚀 New Feature:
[Feature name] is live! [link]

📈 Customer Spotlight:
See how [Customer] used ${productName || "[Your Product]"} to ${keyBenefit || "[achieve benefit]"}: [link]

🔥 Hot Tip:
[Actionable tip that helps users get more value]

📅 Upcoming:
• [Future feature 1]
• [Future feature 2]

See you next week!

[Your Name]

P.S. Forward this to a friend who might benefit!`
      })

      templates.push({
        id: "3",
        subject: `This week in ${productName || "[Your Product]"} 📬`,
        body: `Hi {firstName},

Happy [Day of Week]! Here's your weekly roundup:

✨ Highlights:
• [Update 1]
• [Update 2]
• [Update 3]

🎯 Power User Tip:
[Specific tip to help them ${keyBenefit || "[achieve benefit]"} better]

📚 Resources:
• [Resource 1]: [link]
• [Resource 2]: [link]

💬 Community:
Join our [Slack/Discord/Forum] to connect with other users: [link]

Until next time!

[Your Name]

P.S. We're always improving. Share your feedback: [link]`
      })
    }

    setEmailTemplates(templates)

    toast({
      title: "Emails Generated!",
      description: `Created ${templates.length} email templates`
    })
  }

  // Generate Launch Copy
  const generateLaunchCopy = () => {
    if (!launchProductName || !whatItDoes || !whoItsFor) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    const headlines = [
      `${whatItDoes} for ${whoItsFor}`,
      `The Simple Way to ${whatItDoes}`,
      `${launchProductName}: ${whatItDoes} Made Easy`,
      `${whatItDoes} in Minutes, Not Hours`,
      `Stop Struggling. Start ${whatItDoes.replace(/^[a-z]/, c => c.toUpperCase())}.`
    ]

    const taglines = [
      `${whatItDoes} made simple for ${whoItsFor}`,
      `The easiest way to ${whatItDoes}`,
      `${whatItDoes}. Zero hassle.`,
      `Built for ${whoItsFor} who value simplicity`,
      `${whatItDoes} that actually works`
    ]

    const ctas = [
      `Start ${whatItDoes}`,
      "Get Started Free",
      "Try It Now",
      `See How It Works`,
      "Start Your Free Trial"
    ]

    setLaunchCopy({ headlines, taglines, ctas })

    toast({
      title: "Launch Copy Generated!",
      description: "Created headlines, taglines, and CTAs"
    })
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    })
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Sparkles className="h-10 w-10 text-purple-600" />
        <div>
          <h1 className="text-4xl font-bold">Marketing Asset Generator</h1>
          <p className="text-muted-foreground">
            Create compelling marketing copy in seconds
          </p>
        </div>
      </div>

      <Tabs defaultValue="social" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="social">
            <Share2 className="h-4 w-4 mr-2" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="launch">
            <FileText className="h-4 w-4 mr-2" />
            Launch Copy
          </TabsTrigger>
        </TabsList>

        {/* SOCIAL MEDIA TAB */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Social Media Posts</CardTitle>
              <CardDescription>
                Create engaging posts for Twitter, LinkedIn, and Facebook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., TaskMaster"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key-benefit">Key Benefit</Label>
                  <Input
                    id="key-benefit"
                    placeholder="e.g., manage your tasks effortlessly"
                    value={keyBenefit}
                    onChange={(e) => setKeyBenefit(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter / X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="funny">Funny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={generateSocialPosts} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Posts
              </Button>
            </CardContent>
          </Card>

          {/* Social Posts Results */}
          {socialPosts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Generated Posts ({socialPosts.length})</h3>
              <div className="grid grid-cols-1 gap-4">
                {socialPosts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <p className="whitespace-pre-wrap flex-1">{post.text}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(post.text, "Post")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {post.characterCount} characters
                          </Badge>
                          <Badge variant="outline">
                            {platform === "twitter" && post.characterCount <= 280 && "✓ Fits Twitter"}
                            {platform === "twitter" && post.characterCount > 280 && "⚠ Too long for Twitter"}
                            {platform === "linkedin" && "✓ LinkedIn"}
                            {platform === "facebook" && "✓ Facebook"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* EMAIL TEMPLATES TAB */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Email Templates</CardTitle>
              <CardDescription>
                Create professional email templates for different campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-type">Email Type</Label>
                <Select value={emailType} onValueChange={setEmailType}>
                  <SelectTrigger id="email-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="launch">Launch Announcement</SelectItem>
                    <SelectItem value="feature">Feature Update</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateEmails} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Email Templates
              </Button>
            </CardContent>
          </Card>

          {/* Email Results */}
          {emailTemplates.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Generated Templates ({emailTemplates.length})</h3>
              <div className="grid grid-cols-1 gap-4">
                {emailTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-base">Subject Line</CardTitle>
                          <p className="text-sm font-medium">{template.subject}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(template.subject, "Subject line")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-semibold">Email Body</Label>
                        <div className="mt-2 p-4 bg-muted rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm font-mono">{template.body}</pre>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(template.body, "Email body")}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Email Body
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(`${template.subject}\n\n${template.body}`, "Full email")}
                        >
                          Copy Full Email
                        </Button>
                        <Badge variant="secondary">
                          {template.body.split(" ").length} words
                        </Badge>
                        <Badge variant="outline">
                          ~{Math.ceil(template.body.split(" ").length / 200)} min read
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Best Practices Sidebar */}
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-base">📧 Email Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Optimal send times:</strong> Tuesday-Thursday, 10am-11am or 2pm-3pm</li>
                    <li>• <strong>Subject lines:</strong> Keep under 50 characters for mobile</li>
                    <li>• <strong>A/B test:</strong> Try 2-3 subject line variations</li>
                    <li>• <strong>Personalization:</strong> Use {"{firstName}"} and {"{company}"} tags</li>
                    <li>• <strong>Avoid spam words:</strong> Free, guaranteed, act now, limited time</li>
                    <li>• <strong>CTA:</strong> One clear call-to-action per email</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* LAUNCH COPY TAB */}
        <TabsContent value="launch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Launch Copy</CardTitle>
              <CardDescription>
                Create compelling headlines, taglines, and CTAs for your landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="launch-product-name">Product Name</Label>
                <Input
                  id="launch-product-name"
                  placeholder="e.g., TaskMaster"
                  value={launchProductName}
                  onChange={(e) => setLaunchProductName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="what-it-does">What It Does</Label>
                <Input
                  id="what-it-does"
                  placeholder="e.g., manage your tasks"
                  value={whatItDoes}
                  onChange={(e) => setWhatItDoes(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="who-its-for">Who It&apos;s For</Label>
                <Input
                  id="who-its-for"
                  placeholder="e.g., busy professionals"
                  value={whoItsFor}
                  onChange={(e) => setWhoItsFor(e.target.value)}
                />
              </div>

              <Button onClick={generateLaunchCopy} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Launch Copy
              </Button>
            </CardContent>
          </Card>

          {/* Launch Copy Results */}
          {launchCopy && (
            <div className="space-y-6">
              {/* Headlines */}
              <Card>
                <CardHeader>
                  <CardTitle>Headlines</CardTitle>
                  <CardDescription>Main hero section headlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {launchCopy.headlines.map((headline, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <p className="font-semibold text-lg">{headline}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(headline, "Headline")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Taglines */}
              <Card>
                <CardHeader>
                  <CardTitle>Taglines</CardTitle>
                  <CardDescription>Supporting subheadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {launchCopy.taglines.map((tagline, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <p>{tagline}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(tagline, "Tagline")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTAs */}
              <Card>
                <CardHeader>
                  <CardTitle>Call-to-Action Buttons</CardTitle>
                  <CardDescription>Button text options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {launchCopy.ctas.map((cta, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Button>{cta}</Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(cta, "CTA")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
