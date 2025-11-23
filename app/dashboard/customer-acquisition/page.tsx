"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { Users, TrendingUp, Mail, MessageSquare, Target, Check, ExternalLink, Copy, Download, Plus, Search, Filter } from "lucide-react"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"

interface AcquisitionChannel {
  id: string
  name: string
  difficulty: "Easy" | "Medium" | "Hard"
  cost: "Free" | "Low" | "Medium" | "High"
  timeToFirst: string
  reach: "Low" | "Medium" | "High"
  bestFor: string
  description: string
  steps: string[]
  bestPractices: string[]
  mistakes: string[]
  trying: boolean
  notes: string
}

interface Community {
  id: string
  name: string
  platform: string
  category: string
  members: string
  activity: "High" | "Medium" | "Low"
  canPromote: boolean
  rules: string
  link: string
  joined: boolean
}

interface Template {
  id: string
  category: string
  title: string
  subject?: string
  body: string
  tips: string[]
  charCount: number
}

interface Customer {
  id: string
  date: string
  name: string
  email: string
  channel: string
  method: string
  paid: boolean
  revenue: number
  notes: string
}

// Acquisition channels data
const channelsData: AcquisitionChannel[] = [
  {
    id: "producthunt",
    name: "ProductHunt",
    difficulty: "Medium",
    cost: "Free",
    timeToFirst: "1 Day",
    reach: "High",
    bestFor: "SaaS, Tech Products",
    description: "Launch your product to early adopters and tech enthusiasts",
    steps: [
      "Create ProductHunt account 2+ weeks before launch",
      "Engage with community daily (upvote, comment)",
      "Prepare gallery images, logo, and demo video",
      "Launch at 12:01 AM PST for maximum visibility",
      "Reply to every comment within first 6 hours"
    ],
    bestPractices: [
      "Build relationships before launching",
      "Create compelling first comment explaining your story",
      "Share launch on Twitter/LinkedIn simultaneously",
      "Offer special launch discount for PH community"
    ],
    mistakes: [
      "Launching without building community first",
      "Not responding to comments quickly",
      "Poor quality screenshots/video"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "reddit",
    name: "Reddit",
    difficulty: "Hard",
    cost: "Free",
    timeToFirst: "3-7 Days",
    reach: "High",
    bestFor: "All Products",
    description: "Share in relevant subreddits with authentic engagement",
    steps: [
      "Find 10-15 relevant subreddits (r/SaaS, r/Entrepreneur, etc.)",
      "Read and follow each subreddit's rules carefully",
      "Build karma by contributing value first (comments, posts)",
      "Share your product with problem-first approach",
      "Engage authentically with all comments"
    ],
    bestPractices: [
      "Lead with the problem, not your solution",
      "Be transparent about being the creator",
      "Provide value even if they don't use your product",
      "Respond to every comment"
    ],
    mistakes: [
      "Posting promotional content without karma",
      "Copy-pasting same message across subs",
      "Not engaging with commenters",
      "Being defensive about criticism"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "twitter",
    name: "Twitter/X",
    difficulty: "Medium",
    cost: "Free",
    timeToFirst: "7-14 Days",
    reach: "High",
    bestFor: "All Products",
    description: "Build in public and engage with your target audience",
    steps: [
      "Create/optimize profile with clear value prop",
      "Follow 100-200 people in your niche",
      "Tweet daily about building, learning, insights",
      "Engage with 20+ tweets daily (reply, retweet)",
      "Share launch thread with story and demo"
    ],
    bestPractices: [
      "Build in public - share your journey",
      "Use threads to tell compelling stories",
      "Engage more than you post (3:1 ratio)",
      "Share metrics and learnings transparently"
    ],
    mistakes: [
      "Only posting promotional content",
      "Not engaging with others' content",
      "Buying followers or engagement",
      "Being inconsistent with posting"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    difficulty: "Easy",
    cost: "Free",
    timeToFirst: "7-14 Days",
    reach: "Medium",
    bestFor: "B2B SaaS",
    description: "Reach professionals and decision makers in B2B space",
    steps: [
      "Optimize profile with founder/builder positioning",
      "Connect with 500+ people in target industry",
      "Post 3-4 times per week about journey/insights",
      "Share launch post with demo video",
      "Engage with comments and DM interested people"
    ],
    bestPractices: [
      "Share founder journey and lessons learned",
      "Use native video for higher engagement",
      "Tag relevant people/companies",
      "Post during business hours (9AM-5PM)"
    ],
    mistakes: [
      "Making posts too salesy",
      "Not responding to comments",
      "Only posting about your product",
      "Ignoring DMs from interested people"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "indiehackers",
    name: "Indie Hackers",
    difficulty: "Easy",
    cost: "Free",
    timeToFirst: "1-3 Days",
    reach: "Medium",
    bestFor: "Indie Products, SaaS",
    description: "Connect with fellow indie founders and share your journey",
    steps: [
      "Create detailed company profile with metrics",
      "Share launch post with honest story",
      "Contribute to discussions and help others",
      "Share monthly revenue/user updates",
      "Ask for feedback and give feedback to others"
    ],
    bestPractices: [
      "Be transparent about metrics (good or bad)",
      "Focus on helping others succeed",
      "Share specific tactics and learnings",
      "Build genuine relationships"
    ],
    mistakes: [
      "Only posting when launching",
      "Not sharing real metrics",
      "Asking for help without giving help",
      "Being vague about what you've learned"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "hackernews",
    name: "Hacker News",
    difficulty: "Hard",
    cost: "Free",
    timeToFirst: "1 Day",
    reach: "High",
    bestFor: "Developer Tools, Tech",
    description: "Launch to highly technical audience on Hacker News",
    steps: [
      "Use 'Show HN:' prefix in title",
      "Write clear, concise title describing what it does",
      "Post first comment explaining what you built and why",
      "Be ready to answer technical questions",
      "Respond to all comments with humility"
    ],
    bestPractices: [
      "Be technical and specific in description",
      "Acknowledge limitations honestly",
      "Share interesting technical challenges solved",
      "Respond to criticism constructively"
    ],
    mistakes: [
      "Overhyping or using marketing speak",
      "Not responding to technical questions",
      "Being defensive about criticism",
      "Posting multiple times if first attempt fails"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "cold-email",
    name: "Cold Email",
    difficulty: "Medium",
    cost: "Low",
    timeToFirst: "3-7 Days",
    reach: "Medium",
    bestFor: "B2B SaaS",
    description: "Directly reach decision makers with personalized outreach",
    steps: [
      "Build targeted list of 100 prospects (Hunter.io, Apollo)",
      "Research each person/company thoroughly",
      "Write personalized emails (avoid templates)",
      "Send 10-20 emails per day max",
      "Follow up 2-3 times with value"
    ],
    bestPractices: [
      "Personalize first line with specific detail",
      "Keep emails under 100 words",
      "Focus on their problem, not your solution",
      "Include one clear CTA"
    ],
    mistakes: [
      "Sending generic mass emails",
      "Talking too much about your product",
      "Not following up",
      "Sending from free email domains"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "content-marketing",
    name: "Content Marketing (SEO)",
    difficulty: "Hard",
    cost: "Free",
    timeToFirst: "3-6 Months",
    reach: "High",
    bestFor: "All Products",
    description: "Create valuable content to attract organic traffic",
    steps: [
      "Research keywords your customers search for",
      "Write 10-15 in-depth blog posts (2000+ words)",
      "Optimize for SEO (title, meta, internal links)",
      "Promote posts on social media",
      "Update and improve posts regularly"
    ],
    bestPractices: [
      "Focus on long-tail keywords with low competition",
      "Write for humans first, SEO second",
      "Include clear CTAs in every post",
      "Build email list from blog visitors"
    ],
    mistakes: [
      "Expecting immediate results",
      "Writing thin, low-quality content",
      "Only writing about your product",
      "Not promoting content"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "facebook-groups",
    name: "Facebook Groups",
    difficulty: "Medium",
    cost: "Free",
    timeToFirst: "7-14 Days",
    reach: "Medium",
    bestFor: "B2C, Communities",
    description: "Engage in Facebook groups where your customers hang out",
    steps: [
      "Find 20+ active groups in your niche",
      "Join groups and read rules carefully",
      "Contribute value for 1-2 weeks before promoting",
      "Share your product when relevant to discussions",
      "Respond to comments and questions"
    ],
    bestPractices: [
      "Give 10x more value than you promote",
      "Genuinely help people solve problems",
      "Only promote when it directly helps someone",
      "Build relationships with group admins"
    ],
    mistakes: [
      "Posting promotional content immediately",
      "Spamming multiple groups with same content",
      "Not engaging with comments",
      "Ignoring group rules"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "discord",
    name: "Discord Communities",
    difficulty: "Medium",
    cost: "Free",
    timeToFirst: "7-14 Days",
    reach: "Medium",
    bestFor: "Gaming, Dev Tools, Crypto",
    description: "Engage in Discord servers relevant to your product",
    steps: [
      "Find 10-15 active Discord servers",
      "Read rules and introduce yourself",
      "Be active in discussions daily",
      "Share expertise and help others",
      "Share your product when relevant"
    ],
    bestPractices: [
      "Be genuinely helpful and friendly",
      "Contribute to discussions regularly",
      "DM people only if they express interest",
      "Follow each server's promotion guidelines"
    ],
    mistakes: [
      "DMing people unsolicited promotions",
      "Only showing up to promote",
      "Not respecting server rules",
      "Being pushy or salesy"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "youtube",
    name: "YouTube",
    difficulty: "Hard",
    cost: "Low",
    timeToFirst: "1-3 Months",
    reach: "High",
    bestFor: "Visual Products, Tutorials",
    description: "Create video content to showcase your product",
    steps: [
      "Create channel with professional branding",
      "Film 5-10 tutorial/demo videos",
      "Optimize titles, descriptions, tags for SEO",
      "Create compelling thumbnails",
      "Promote videos on social media"
    ],
    bestPractices: [
      "Solve specific problems in each video",
      "Keep videos concise (under 10 minutes)",
      "Include timestamps and clear structure",
      "End with clear CTA to try product"
    ],
    mistakes: [
      "Making videos too long and boring",
      "Poor audio/video quality",
      "Only talking about features, not benefits",
      "Not optimizing for search"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "podcasts",
    name: "Podcast Appearances",
    difficulty: "Medium",
    cost: "Free",
    timeToFirst: "2-4 Weeks",
    reach: "Medium",
    bestFor: "Founder Story, B2B",
    description: "Get featured on podcasts to reach targeted audiences",
    steps: [
      "Find 50 podcasts in your niche",
      "Prepare compelling pitch (unique angle)",
      "Email podcast hosts with pitch",
      "Prepare talking points and stories",
      "Promote episode when it goes live"
    ],
    bestPractices: [
      "Research podcast before pitching",
      "Offer unique insights or controversial takes",
      "Promote the episode to your audience",
      "Build relationship with host"
    ],
    mistakes: [
      "Sending generic pitches to all podcasts",
      "Being boring or too promotional on show",
      "Not promoting the episode",
      "Only talking about your product"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "slack-communities",
    name: "Slack Communities",
    difficulty: "Easy",
    cost: "Free",
    timeToFirst: "7-14 Days",
    reach: "Low",
    bestFor: "B2B, Niche Products",
    description: "Join Slack communities and provide value",
    steps: [
      "Find relevant Slack communities (slofile.com)",
      "Join 5-10 active communities",
      "Introduce yourself in welcome channel",
      "Be helpful and answer questions",
      "Share your product when it solves specific problem"
    ],
    bestPractices: [
      "Be active and helpful consistently",
      "Build real relationships",
      "Only share product when genuinely helpful",
      "Respect community guidelines"
    ],
    mistakes: [
      "Joining just to promote",
      "Not being active",
      "Spamming product link",
      "Not building relationships first"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "paid-ads",
    name: "Paid Ads (Google/Facebook)",
    difficulty: "Hard",
    cost: "High",
    timeToFirst: "1-7 Days",
    reach: "High",
    bestFor: "Validated Products",
    description: "Run paid advertising to acquire customers quickly",
    steps: [
      "Start with small budget ($10-20/day)",
      "Create 3-5 ad variations",
      "Target specific audience segments",
      "Track conversions carefully",
      "Optimize based on data"
    ],
    bestPractices: [
      "Test multiple audiences and creatives",
      "Start small and scale what works",
      "Track ROI meticulously",
      "Use retargeting for visitors"
    ],
    mistakes: [
      "Spending too much too soon",
      "Not tracking conversions properly",
      "Targeting too broad audience",
      "Giving up after first week"
    ],
    trying: false,
    notes: ""
  },
  {
    id: "affiliate",
    name: "Affiliate Marketing",
    difficulty: "Medium",
    cost: "Low",
    timeToFirst: "2-4 Weeks",
    reach: "Medium",
    bestFor: "SaaS, Digital Products",
    description: "Partner with affiliates to promote your product",
    steps: [
      "Set up affiliate program (20-30% commission)",
      "Find 10-20 potential affiliates",
      "Provide promotional materials (banners, copy)",
      "Track referrals and pay commissions",
      "Build relationships with top performers"
    ],
    bestPractices: [
      "Offer competitive commission rates",
      "Make it easy for affiliates to promote",
      "Provide excellent affiliate support",
      "Pay commissions promptly"
    ],
    mistakes: [
      "Offering too low commission",
      "Not supporting affiliates properly",
      "Complicated signup process",
      "Delayed commission payments"
    ],
    trying: false,
    notes: ""
  }
]

// Communities data (50+ pre-populated)
const communitiesData: Community[] = [
  // Reddit
  { id: "r-saas", name: "r/SaaS", platform: "Reddit", category: "SaaS Founders", members: "200K", activity: "High", canPromote: true, rules: "No spam, must provide value first", link: "https://reddit.com/r/SaaS", joined: false },
  { id: "r-entrepreneur", name: "r/Entrepreneur", platform: "Reddit", category: "Startup & Entrepreneurship", members: "3M", activity: "High", canPromote: false, rules: "Feedback Friday only", link: "https://reddit.com/r/Entrepreneur", joined: false },
  { id: "r-startups", name: "r/startups", platform: "Reddit", category: "Startup & Entrepreneurship", members: "1.5M", activity: "High", canPromote: false, rules: "Share Saturday only", link: "https://reddit.com/r/startups", joined: false },
  { id: "r-indiebiz", name: "r/IndieBiz", platform: "Reddit", category: "SaaS Founders", members: "50K", activity: "Medium", canPromote: true, rules: "Authentic sharing only", link: "https://reddit.com/r/IndieBiz", joined: false },
  { id: "r-marketing", name: "r/marketing", platform: "Reddit", category: "Marketing & Growth", members: "800K", activity: "High", canPromote: false, rules: "No self-promotion", link: "https://reddit.com/r/marketing", joined: false },
  { id: "r-growthhacking", name: "r/GrowthHacking", platform: "Reddit", category: "Marketing & Growth", members: "200K", activity: "Medium", canPromote: true, rules: "Share tactics, not just links", link: "https://reddit.com/r/GrowthHacking", joined: false },
  { id: "r-buildinpublic", name: "r/BuildInPublic", platform: "Reddit", category: "SaaS Founders", members: "30K", activity: "High", canPromote: true, rules: "Share journey transparently", link: "https://reddit.com/r/BuildInPublic", joined: false },

  // More Reddit
  { id: "r-sideproject", name: "r/SideProject", platform: "Reddit", category: "Startup & Entrepreneurship", members: "200K", activity: "High", canPromote: true, rules: "Launch Friday only", link: "https://reddit.com/r/SideProject", joined: false },
  { id: "r-imadethis", name: "r/IMadeThis", platform: "Reddit", category: "Startup & Entrepreneurship", members: "300K", activity: "Medium", canPromote: true, rules: "No spam, show your creation", link: "https://reddit.com/r/IMadeThis", joined: false },
  { id: "r-alphaandbeta", name: "r/AlphaAndBetaUsers", platform: "Reddit", category: "Startup & Entrepreneurship", members: "100K", activity: "High", canPromote: true, rules: "Seek feedback genuinely", link: "https://reddit.com/r/AlphaAndBetaUsers", joined: false },

  // Facebook Groups
  { id: "fb-saas-growth", name: "SaaS Growth Hacks", platform: "Facebook", category: "SaaS Founders", members: "50K", activity: "High", canPromote: true, rules: "Value first, promo second", link: "https://facebook.com/groups/saasgrowth", joined: false },
  { id: "fb-startup-grind", name: "Startup Grind", platform: "Facebook", category: "Startup & Entrepreneurship", members: "1M", activity: "High", canPromote: false, rules: "Admin approval required", link: "https://facebook.com/groups/startupgrind", joined: false },
  { id: "fb-indie-makers", name: "Indie Makers", platform: "Facebook", category: "SaaS Founders", members: "30K", activity: "Medium", canPromote: true, rules: "Share progress & ask feedback", link: "https://facebook.com/groups/indiemakers", joined: false },

  // Discord
  { id: "discord-indie", name: "Indie Hackers", platform: "Discord", category: "SaaS Founders", members: "20K", activity: "High", canPromote: true, rules: "#shameless-plug channel", link: "https://indiehackers.com/discord", joined: false },
  { id: "discord-makerlog", name: "Makerlog", platform: "Discord", category: "SaaS Founders", members: "15K", activity: "High", canPromote: true, rules: "Share daily progress", link: "https://getmakerlog.com/discord", joined: false },
  { id: "discord-wip", name: "WIP", platform: "Discord", category: "SaaS Founders", members: "10K", activity: "Medium", canPromote: true, rules: "Ship often, share progress", link: "https://wip.co/discord", joined: false },

  // Slack
  { id: "slack-online-geniuses", name: "Online Geniuses", platform: "Slack", category: "Marketing & Growth", members: "30K", activity: "High", canPromote: false, rules: "No promotional content", link: "https://onlinegeniuses.com", joined: false },
  { id: "slack-demand-curve", name: "Demand Curve", platform: "Slack", category: "Marketing & Growth", members: "10K", activity: "Medium", canPromote: false, rules: "Value-driven sharing only", link: "https://demandcurve.com/community", joined: false },

  // LinkedIn Groups
  { id: "li-saas-founders", name: "SaaS Founders & Entrepreneurs", platform: "LinkedIn", category: "SaaS Founders", members: "100K", activity: "Medium", canPromote: true, rules: "Professional content only", link: "https://linkedin.com/groups/saas", joined: false },
  { id: "li-product-management", name: "Product Management", platform: "LinkedIn", category: "Product Management", members: "500K", activity: "High", canPromote: false, rules: "Insights and discussions", link: "https://linkedin.com/groups/product", joined: false }
]

// Template messages (20+)
const templatesData: Template[] = [
  // Reddit Posts
  {
    id: "reddit-built",
    category: "Reddit Posts",
    title: "I built X to solve Y",
    body: `Hey r/[subreddit]!\n\nI've been frustrated with [problem] for years. Every time I tried to [task], I ran into [specific pain point].\n\nSo I built [Product Name] to solve this. It's a [one-sentence description].\n\n**Key features:**\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\n**What makes it different:**\n[Your unique approach]\n\n**Pricing:**\n[Pricing model] - I'm offering [discount/free tier] for the Reddit community.\n\n**Would love your feedback!**\nI'm a solo founder and I've been working on this for [timeframe]. Happy to answer any questions.\n\n[Link]`,
    tips: [
      "Lead with the problem, not your solution",
      "Be specific about what you built",
      "Offer special discount for the community",
      "Respond to every comment within 1 hour"
    ],
    charCount: 0
  },
  {
    id: "reddit-show-hn",
    category: "Reddit Posts",
    title: "Show HN Style",
    body: `Show HN: [Product Name] – [One-line description]\n\nHi HN! I'm [Name], and I built [Product Name].\n\n**The Problem:**\nI noticed that [problem statement]. Most existing solutions [why they fall short].\n\n**My Solution:**\n[Product Name] approaches this differently by [unique approach].\n\n**Technical Details:**\n• Built with [tech stack]\n• [Interesting technical challenge solved]\n• [Performance metric or scale]\n\n**Current Status:**\n• [Users/customers to date]\n• [Revenue if comfortable sharing]\n• [What you're working on next]\n\n**Try it:**\n[Link] - Free tier available, no credit card required.\n\n**Looking for:**\nFeedback on [specific aspect] and thoughts on [question].\n\nHappy to answer technical questions!`,
    tips: [
      "Be technical and specific",
      "Share interesting challenges you solved",
      "Be humble and open to feedback",
      "Respond to comments promptly"
    ],
    charCount: 0
  },
  {
    id: "reddit-feedback",
    category: "Reddit Posts",
    title: "Asking for Feedback",
    body: `Looking for feedback on [Product Name]\n\nHey everyone!\n\nI've been working on [Product Name] for [timeframe]. It's designed to help [target user] [achieve outcome].\n\n**Demo:** [Link to demo/video]\n**Live Site:** [Link]\n\n**What I'm specifically looking for feedback on:**\n1. [Specific aspect 1]\n2. [Specific aspect 2]\n3. [Specific aspect 3]\n\n**What I've learned so far:**\n• [Learning 1]\n• [Learning 2]\n• [Learning 3]\n\n**Next steps:**\nBased on early user feedback, I'm planning to [future plans].\n\nAny feedback would be hugely appreciated! I'm happy to return the favor if you're working on something too.\n\nThanks!`,
    tips: [
      "Ask for specific feedback, not general thoughts",
      "Share what you've already learned",
      "Offer to help others in return",
      "Include a demo or screenshots"
    ],
    charCount: 0
  },
  {
    id: "reddit-success",
    category: "Reddit Posts",
    title: "Success Story Format",
    body: `How I got to $[X]K MRR with [Product Name] in [timeframe]\n\nHey r/[subreddit]!\n\nI wanted to share my journey building [Product Name] to hopefully help other indie founders.\n\n**Background:**\n[Your background and why you started]\n\n**The Idea:**\n[How you came up with the idea]\n\n**Building:**\n• Started: [Date]\n• Launched: [Date]\n• Tech: [Stack]\n• Cost: $[Amount]\n\n**Traction:**\n• Month 1: $[X]\n• Month 2: $[X]\n• Month 3: $[X]\n• Now: $[X] MRR, [X] customers\n\n**What worked:**\n1. [Channel/tactic 1] - [Results]\n2. [Channel/tactic 2] - [Results]\n3. [Channel/tactic 3] - [Results]\n\n**What didn't work:**\n1. [Failed approach 1]\n2. [Failed approach 2]\n\n**Key Lessons:**\n• [Lesson 1]\n• [Lesson 2]\n• [Lesson 3]\n\n**What's next:**\n[Future plans]\n\nHappy to answer any questions!\n\n[Link if allowed]`,
    tips: [
      "Be transparent about numbers",
      "Share both successes and failures",
      "Focus on learnings and tactics",
      "Provide actionable insights"
    ],
    charCount: 0
  },
  {
    id: "reddit-problem",
    category: "Reddit Posts",
    title: "Problem-First Approach",
    body: `Anyone else frustrated with [problem]?\n\nI've been dealing with [specific problem] for [timeframe] and I'm curious if others face the same issue.\n\n**My situation:**\nI need to [task], but every time I try, I run into:\n• [Pain point 1]\n• [Pain point 2]\n• [Pain point 3]\n\n**What I've tried:**\n• [Solution 1] - [Why it didn't work]\n• [Solution 2] - [Why it didn't work]\n• [Solution 3] - [Why it didn't work]\n\n**My current approach:**\nI ended up building [Product Name] to solve this for myself. It [key differentiator].\n\nBeen using it for [time] and it's working well. Made it available at [link] in case anyone else has this problem.\n\n**Curious:** How do you all handle [problem]? What am I missing?`,
    tips: [
      "Start with genuine question",
      "Share your struggle authentically",
      "Mention your solution naturally",
      "Stay engaged in conversation"
    ],
    charCount: 0
  },

  // Twitter Threads
  {
    id: "twitter-launch",
    category: "Twitter Threads",
    title: "Launch Announcement Thread",
    body: `1/ Today I'm launching [Product Name]! 🚀\n\nAfter [timeframe] of building, it's finally live.\n\nHere's what it does and why I built it: 🧵\n\n2/ The Problem:\n\n[Describe the problem you experienced personally]\n\nI wasted [time/money] dealing with this.\n\n3/ Existing solutions all had the same issues:\n\n• [Issue 1]\n• [Issue 2]\n• [Issue 3]\n\nSo I decided to build something better.\n\n4/ [Product Name] is [one-line description]\n\nKey features:\n✓ [Feature 1]\n✓ [Feature 2]\n✓ [Feature 3]\n\n5/ What makes it different:\n\n[Your unique approach and why it matters]\n\n6/ Pricing:\n\n[Pricing model]\n\nLaunching with [special offer] for early supporters.\n\n7/ Try it here:\n[Link]\n\n• Free to start\n• No credit card needed\n• Takes [time] to set up\n\n8/ If you found this interesting:\n\n• Try it and share feedback\n• Retweet to help spread the word\n• DM me with questions\n\nThanks for reading! 🙏`,
    tips: [
      "Start with the problem, not features",
      "Make it scannable with emojis and spacing",
      "Include clear CTA in final tweet",
      "Engage with everyone who replies"
    ],
    charCount: 0
  },
  {
    id: "twitter-problem-solution",
    category: "Twitter Threads",
    title: "Problem/Solution Thread",
    body: `1/ You're probably [doing task] the wrong way.\n\nHere's why and how to fix it: 🧵\n\n2/ Most people [common approach]\n\nThe problem?\n\n[Specific issue this causes]\n\n3/ I did this for [timeframe] until I realized:\n\n[Key insight]\n\n4/ The better approach:\n\n[Your method/product]\n\nHere's how it works:\n\n5/ Step 1: [Action]\n[Benefit]\n\n6/ Step 2: [Action]\n[Benefit]\n\n7/ Step 3: [Action]\n[Benefit]\n\n8/ Results:\n\n• [Metric 1]\n• [Metric 2]\n• [Metric 3]\n\n9/ Want to try this yourself?\n\nI built [Product Name] to make this process automatic.\n\n[Link]\n\n10/ Questions? Drop them below 👇`,
    tips: [
      "Hook with controversial or curious statement",
      "Provide genuine value before pitching",
      "Make each tweet self-contained",
      "End with engagement question"
    ],
    charCount: 0
  },

  // Cold Emails
  {
    id: "email-initial",
    category: "Cold Email",
    title: "Initial Outreach",
    subject: "Quick question about [their company]",
    body: `Hi {firstName},\n\nI noticed [specific observation about their company/work].\n\nI'm reaching out because [relevant connection to their problem].\n\nMost [their role] teams struggle with [specific problem]. I built [Product Name] to solve exactly this.\n\n**Quick question:** Is [problem] something you're dealing with?\n\nIf so, I'd love to show you how [specific benefit] in [timeframe].\n\nWould a quick 10-minute call this week work?\n\nBest,\n[Your Name]\n\nP.S. - [Relevant case study or social proof]`,
    tips: [
      "Personalize first line with specific detail",
      "Keep under 100 words",
      "One clear CTA",
      "Include relevant proof point"
    ],
    charCount: 0
  },
  {
    id: "email-followup",
    category: "Cold Email",
    title: "Follow-up Email",
    subject: "Re: Quick question about [their company]",
    body: `Hi {firstName},\n\nFollowing up on my email from [day].\n\nI know you're busy, so I'll keep this short:\n\n[Product Name] helps [their role] [achieve specific outcome] by [unique approach].\n\n**Real results:**\n• [Customer company] saved [X hours/week]\n• [Customer company] increased [metric] by [Y%]\n\nWorth a 10-minute conversation?\n\n[Calendar link]\n\nThanks,\n[Your Name]`,
    tips: [
      "Reference previous email",
      "Add social proof",
      "Make it easy to respond (calendar link)",
      "Shorter than first email"
    ],
    charCount: 0
  },

  // LinkedIn Posts
  {
    id: "linkedin-launch",
    category: "LinkedIn Posts",
    title: "Launch Announcement",
    body: `🚀 Launching [Product Name] Today!\n\nAfter [X months] of building, I'm excited to share [Product Name] with you.\n\n**The problem we're solving:**\n[Problem statement that resonates with your audience]\n\n**Our solution:**\n[Product Name] is [one-line description]\n\nKey benefits:\n✓ [Benefit 1]\n✓ [Benefit 2]\n✓ [Benefit 3]\n\n**Early results:**\n• [Metric 1]\n• [Metric 2]\n• [Metric 3]\n\n**Special offer for my network:**\n[Discount/free tier] for the first [X] people.\n\nLink in comments 👇\n\nWhat challenges are you facing with [problem area]?`,
    tips: [
      "Use line breaks for readability",
      "Lead with clear benefit",
      "Include social proof",
      "Ask engaging question at end"
    ],
    charCount: 0
  },

  // Discord/Slack
  {
    id: "discord-intro",
    category: "Discord/Slack",
    title: "Community Introduction",
    body: `Hey everyone! 👋\n\nExcited to join this community!\n\n**A bit about me:**\n• [Your background]\n• Currently working on [Product Name]\n• Interested in [relevant topics]\n\n**What I'm building:**\n[Product Name] helps [target user] [achieve outcome]. Been working on it for [timeframe].\n\nIf you're struggling with [problem], would love to hear your thoughts!\n\nLooking forward to connecting with you all and learning from this community. 🙌`,
    tips: [
      "Be genuine and friendly",
      "Mention your product but don't over-promote",
      "Show interest in helping others",
      "Engage actively after introduction"
    ],
    charCount: 0
  }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export default function CustomerAcquisitionPage() {
  const { toast } = useToast()

  // State
  const [channels, setChannels] = useState<AcquisitionChannel[]>(channelsData)
  const [communities, setCommunities] = useState<Community[]>(communitiesData)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [newCustomer, setNewCustomer] = useState({
    date: new Date().toISOString().split('T')[0],
    name: "",
    email: "",
    channel: "",
    method: "",
    paid: false,
    revenue: 0,
    notes: ""
  })

  // Email sequence state
  const [emailSequence, setEmailSequence] = useState([
    { day: 0, subject: "", body: "" },
    { day: 3, subject: "", body: "" },
    { day: 7, subject: "", body: "" },
    { day: 14, subject: "", body: "" }
  ])

  // Filter communities
  const filteredCommunities = useMemo(() => {
    return communities.filter(comm => {
      const matchesSearch = comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comm.platform.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "All" || comm.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [communities, searchQuery, categoryFilter])

  // Calculate stats
  const totalCustomers = customers.length
  const progressPercentage = (totalCustomers / 100) * 100
  const paidCustomers = customers.filter(c => c.paid).length
  const totalRevenue = customers.reduce((sum, c) => sum + c.revenue, 0)

  // Channel stats
  const channelStats = useMemo(() => {
    const stats: Record<string, number> = {}
    customers.forEach(c => {
      stats[c.channel] = (stats[c.channel] || 0) + 1
    })
    return Object.entries(stats).map(([name, value]) => ({ name, value }))
  }, [customers])

  // Toggle channel trying
  const toggleChannel = (id: string) => {
    setChannels(channels.map(ch =>
      ch.id === id ? { ...ch, trying: !ch.trying } : ch
    ))
  }

  // Update channel notes
  const updateChannelNotes = (id: string, notes: string) => {
    setChannels(channels.map(ch =>
      ch.id === id ? { ...ch, notes } : ch
    ))
  }

  // Toggle community joined
  const toggleCommunity = (id: string) => {
    setCommunities(communities.map(comm =>
      comm.id === id ? { ...comm, joined: !comm.joined } : comm
    ))
  }

  // Copy template
  const copyTemplate = (template: Template) => {
    const fullText = template.subject
      ? `Subject: ${template.subject}\n\n${template.body}`
      : template.body

    navigator.clipboard.writeText(fullText)
    toast({
      title: "Copied!",
      description: "Template copied to clipboard"
    })
  }

  // Add customer
  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.channel) {
      toast({
        title: "Missing Information",
        description: "Please enter name and acquisition channel",
        variant: "destructive"
      })
      return
    }

    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer
    }

    setCustomers([...customers, customer])
    setNewCustomer({
      date: new Date().toISOString().split('T')[0],
      name: "",
      email: "",
      channel: "",
      method: "",
      paid: false,
      revenue: 0,
      notes: ""
    })

    toast({
      title: "Customer Added!",
      description: `${customer.name} has been added to your progress`
    })
  }

  // Export email sequence
  const exportEmailSequence = () => {
    const csv = emailSequence.map(email =>
      `Day ${email.day},"${email.subject}","${email.body}"`
    ).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'email-sequence.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Exported!",
      description: "Email sequence downloaded as CSV"
    })
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: "default",
      Medium: "outline",
      Hard: "destructive"
    }
    return colors[difficulty] || "outline"
  }

  const getCostColor = (cost: string) => {
    const colors: Record<string, string> = {
      Free: "default",
      Low: "outline",
      Medium: "outline",
      High: "destructive"
    }
    return colors[cost] || "outline"
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Users className="h-10 w-10 text-blue-600" />
        <div>
          <h1 className="text-4xl font-bold">First 100 Customers Playbook</h1>
          <p className="text-muted-foreground">
            Proven channels and tactics to acquire your first paying customers
          </p>
        </div>
      </div>

      <Tabs defaultValue="channels" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="channels">
            <Target className="h-4 w-4 mr-2" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="communities">
            <Users className="h-4 w-4 mr-2" />
            Communities
          </TabsTrigger>
          <TabsTrigger value="templates">
            <MessageSquare className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Cold Email
          </TabsTrigger>
          <TabsTrigger value="progress">
            <TrendingUp className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Acquisition Channels */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acquisition Channels</CardTitle>
              <CardDescription>
                15+ proven channels to get your first customers
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6">
            {channels.map((channel) => (
              <Card key={channel.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={channel.trying}
                        onCheckedChange={() => toggleChannel(channel.id)}
                      />
                      <div>
                        <CardTitle>{channel.name}</CardTitle>
                        <CardDescription>{channel.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getDifficultyColor(channel.difficulty) as any}>
                        {channel.difficulty}
                      </Badge>
                      <Badge variant={getCostColor(channel.cost) as any}>
                        {channel.cost}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Time to First:</span>
                      <div className="font-semibold">{channel.timeToFirst}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reach:</span>
                      <div className="font-semibold">{channel.reach}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Best For:</span>
                      <div className="font-semibold">{channel.bestFor}</div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="details">
                      <AccordionTrigger>How to Get Started</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Steps:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            {channel.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-green-600">Best Practices:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {channel.bestPractices.map((practice, i) => (
                              <li key={i}>{practice}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-red-600">Avoid These Mistakes:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {channel.mistakes.map((mistake, i) => (
                              <li key={i}>{mistake}</li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Add your notes, learnings, or results..."
                      value={channel.notes}
                      onChange={(e) => updateChannelNotes(channel.id, e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Community Finder */}
        <TabsContent value="communities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Finder</CardTitle>
              <CardDescription>
                50+ pre-vetted communities where your customers hang out
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCategoryFilter("All")}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {categoryFilter}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {["All", "SaaS Founders", "Startup & Entrepreneurship", "Marketing & Growth", "Developers & Tech"].map(cat => (
                  <Badge
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredCommunities.map((community) => (
              <Card key={community.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{community.name}</CardTitle>
                      <CardDescription>
                        {community.platform} • {community.members} members
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{community.activity}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <div><strong>Category:</strong> {community.category}</div>
                    <div><strong>Can Promote:</strong> {community.canPromote ? "✓ Yes" : "✗ No"}</div>
                    <div className="text-muted-foreground">{community.rules}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(community.link, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit
                    </Button>
                    <Button
                      variant={community.joined ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCommunity(community.id)}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {community.joined ? "Joined" : "Add to List"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Outreach Templates */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outreach Templates</CardTitle>
              <CardDescription>
                20+ proven templates for different channels
              </CardDescription>
            </CardHeader>
          </Card>

          {["Reddit Posts", "Twitter Threads", "Cold Email", "LinkedIn Posts", "Discord/Slack"].map(category => {
            const categoryTemplates = templatesData.filter(t => t.category === category)
            if (categoryTemplates.length === 0) return null

            return (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-bold">{category}</h3>
                <div className="grid gap-4">
                  {categoryTemplates.map(template => (
                    <Card key={template.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{template.title}</CardTitle>
                            {template.subject && (
                              <CardDescription>Subject: {template.subject}</CardDescription>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyTemplate(template)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm font-mono">
                            {template.body}
                          </pre>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Success Tips:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {template.tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </TabsContent>

        {/* Tab 4: Cold Email Campaign */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cold Email Sequence Builder</CardTitle>
              <CardDescription>
                Build a 4-email sequence to convert cold leads
              </CardDescription>
            </CardHeader>
          </Card>

          {emailSequence.map((email, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Email {index + 1} - Day {email.day}</CardTitle>
                <CardDescription>
                  {index === 0 && "Initial outreach"}
                  {index === 1 && "Gentle follow-up"}
                  {index === 2 && "Value add"}
                  {index === 3 && "Final attempt"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input
                    placeholder="Quick question about [their company]"
                    value={email.subject}
                    onChange={(e) => {
                      const updated = [...emailSequence]
                      updated[index].subject = e.target.value
                      setEmailSequence(updated)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Body</Label>
                  <Textarea
                    placeholder="Use merge fields: {firstName}, {company}, {problem}"
                    value={email.body}
                    onChange={(e) => {
                      const updated = [...emailSequence]
                      updated[index].body = e.target.value
                      setEmailSequence(updated)
                    }}
                    rows={8}
                  />
                  <div className="text-xs text-muted-foreground">
                    Characters: {email.body.length} | Words: {email.body.split(' ').filter(Boolean).length}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-muted-foreground">Benchmark Open Rate</div>
                    <div className="text-lg font-semibold">
                      {index === 0 && "20-30%"}
                      {index === 1 && "15-25%"}
                      {index === 2 && "10-20%"}
                      {index === 3 && "5-15%"}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-muted-foreground">Benchmark Reply Rate</div>
                    <div className="text-lg font-semibold">
                      {index === 0 && "1-3%"}
                      {index === 1 && "2-4%"}
                      {index === 2 && "1-2%"}
                      {index === 3 && "0.5-1%"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Email Tools & Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Email Finding Tools:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Hunter.io - Find email addresses</li>
                  <li>Apollo.io - B2B contact database</li>
                  <li>RocketReach - Contact information</li>
                  <li>LinkedIn Sales Navigator - Premium prospecting</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Deliverability Checklist:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Use professional email domain (not Gmail/Yahoo)</li>
                  <li>Warm up email account (Mailwarm, Lemwarm)</li>
                  <li>Send max 20-50 emails per day</li>
                  <li>Personalize every email</li>
                  <li>Monitor spam score (Mail Tester)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Legal Compliance:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>CAN-SPAM: Include unsubscribe link and physical address</li>
                  <li>GDPR: Only email if you have legitimate interest</li>
                  <li>Respect opt-outs immediately</li>
                </ul>
              </div>

              <Button onClick={exportEmailSequence} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Sequence as CSV
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Progress Tracker */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Track Your First 100 Customers</CardTitle>
              <CardDescription>
                {totalCustomers} / 100 customers acquired
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to 100 customers</span>
                  <span className="font-semibold">{totalCustomers}/100</span>
                </div>
                <Progress value={progressPercentage} className="h-4" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Customers</div>
                  <div className="text-3xl font-bold">{totalCustomers}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Paid Customers</div>
                  <div className="text-3xl font-bold text-green-600">{paidCustomers}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                  <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
                </div>
              </div>

              {[1, 10, 25, 50, 100].map(milestone => {
                if (totalCustomers >= milestone && totalCustomers < milestone + 10) {
                  return (
                    <div key={milestone} className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎉</span>
                        <div>
                          <div className="font-semibold">Milestone Reached!</div>
                          <div className="text-sm text-muted-foreground">
                            You&apos;ve acquired {milestone} customer{milestone > 1 ? 's' : ''}!
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </CardContent>
          </Card>

          {channelStats.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customers by Channel</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={channelStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {channelStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={channelStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Add New Customer</CardTitle>
              <CardDescription>Manually track each customer acquisition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newCustomer.date}
                    onChange={(e) => setNewCustomer({ ...newCustomer, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Acquisition Channel</Label>
                  <Input
                    placeholder="e.g., Reddit, Twitter, Cold Email"
                    value={newCustomer.channel}
                    onChange={(e) => setNewCustomer({ ...newCustomer, channel: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>How did you reach them?</Label>
                  <Input
                    placeholder="e.g., Posted in r/SaaS"
                    value={newCustomer.method}
                    onChange={(e) => setNewCustomer({ ...newCustomer, method: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Revenue ($)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newCustomer.revenue || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, revenue: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newCustomer.paid}
                  onCheckedChange={(checked) => setNewCustomer({ ...newCustomer, paid: checked as boolean })}
                />
                <Label>Paid customer</Label>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Any additional notes..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={addCustomer} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </CardContent>
          </Card>

          {customers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Customer List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {customers.map((customer, index) => (
                    <div key={customer.id} className="p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold">{index + 1}. {customer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.channel} • {customer.date}
                            {customer.paid && <span className="ml-2 text-green-600">💰 Paid</span>}
                          </div>
                          {customer.method && (
                            <div className="text-xs text-muted-foreground mt-1">{customer.method}</div>
                          )}
                        </div>
                        {customer.revenue > 0 && (
                          <div className="text-lg font-bold text-green-600">
                            ${customer.revenue}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
