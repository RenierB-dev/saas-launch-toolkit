export interface LaunchTask {
  day: number
  title: string
  description: string
  category: 'planning' | 'building' | 'marketing' | 'preparation' | 'launch' | 'post_launch'
}

export const DEFAULT_LAUNCH_TASKS: LaunchTask[] = [
  // Days 1-5: Planning & Foundation
  {
    day: 1,
    title: "Define Your Value Proposition",
    description: "Clearly articulate what problem your SaaS solves and for whom. Write a one-sentence value proposition.",
    category: "planning",
  },
  {
    day: 2,
    title: "Research Your Competition",
    description: "Identify 5-10 competitors. Analyze their pricing, features, and positioning. Find your unique angle.",
    category: "planning",
  },
  {
    day: 3,
    title: "Set Your Pricing Strategy",
    description: "Use the Pricing Calculator to model different scenarios. Choose your pricing tiers and test messaging.",
    category: "planning",
  },
  {
    day: 4,
    title: "Create Landing Page Wireframe",
    description: "Sketch or wireframe your landing page. Include hero section, features, pricing, and CTA.",
    category: "planning",
  },
  {
    day: 5,
    title: "Build Your Email List Setup",
    description: "Set up email marketing tool (ConvertKit, Mailchimp, etc.). Create welcome email sequence.",
    category: "planning",
  },

  // Days 6-15: Building & Content
  {
    day: 6,
    title: "Launch Your Landing Page",
    description: "Build and deploy a simple landing page with email capture. Keep it minimal but clear.",
    category: "building",
  },
  {
    day: 7,
    title: "Set Up Analytics",
    description: "Install Google Analytics, Plausible, or similar. Set up conversion tracking for signups.",
    category: "building",
  },
  {
    day: 8,
    title: "Create Social Media Accounts",
    description: "Set up Twitter/X and LinkedIn accounts for your product. Complete profiles with clear branding.",
    category: "marketing",
  },
  {
    day: 9,
    title: "Write Your First Blog Post",
    description: "Publish a problem-focused blog post related to your product. Optimize for SEO.",
    category: "marketing",
  },
  {
    day: 10,
    title: "Build Your Beta Tester List",
    description: "Reach out to 20-30 people in your network. Offer early access in exchange for feedback.",
    category: "marketing",
  },
  {
    day: 11,
    title: "Create Demo Video",
    description: "Record a 60-90 second product demo. Show the core value proposition clearly.",
    category: "building",
  },
  {
    day: 12,
    title: "Prepare Customer Support",
    description: "Set up support email, help docs, or FAQ page. Define response time expectations.",
    category: "building",
  },
  {
    day: 13,
    title: "Launch Beta to Testers",
    description: "Send beta access to your tester list. Set up feedback collection system.",
    category: "building",
  },
  {
    day: 14,
    title: "Gather & Implement Feedback",
    description: "Review beta feedback. Fix critical bugs and implement quick wins.",
    category: "building",
  },
  {
    day: 15,
    title: "Polish Your Product",
    description: "Final UI/UX improvements. Ensure onboarding is smooth. Test all critical paths.",
    category: "building",
  },

  // Days 16-20: Pre-Launch Marketing
  {
    day: 16,
    title: "Create Social Proof Assets",
    description: "Collect testimonials from beta users. Create case studies or screenshots of results.",
    category: "marketing",
  },
  {
    day: 17,
    title: "Build Your Launch Day Content",
    description: "Write social media posts, email announcements, and blog post for launch day.",
    category: "marketing",
  },
  {
    day: 18,
    title: "Research Launch Channels",
    description: "List communities, subreddits, Facebook groups, and forums where your audience hangs out.",
    category: "marketing",
  },
  {
    day: 19,
    title: "Create Launch Week Schedule",
    description: "Plan exactly when and where you'll announce. Schedule posts in advance where possible.",
    category: "preparation",
  },
  {
    day: 20,
    title: "Start ProductHunt Preparation",
    description: "Create ProductHunt profile. Research successful launches. Draft your ProductHunt post.",
    category: "preparation",
  },

  // Days 21-25: ProductHunt Launch Prep
  {
    day: 21,
    title: "Finalize ProductHunt Assets",
    description: "Prepare logo, screenshots, demo video, and tagline. Write compelling description.",
    category: "preparation",
  },
  {
    day: 22,
    title: "Find a ProductHunt Hunter",
    description: "Research and reach out to hunters in your space. Personalize outreach messages.",
    category: "preparation",
  },
  {
    day: 23,
    title: "Build Launch Day Support Team",
    description: "Line up 10-20 people to upvote and comment on launch day. Brief them on timing.",
    category: "preparation",
  },
  {
    day: 24,
    title: "Set Up Launch Day Monitoring",
    description: "Prepare to monitor ProductHunt, Twitter, email, and support. Clear your calendar.",
    category: "preparation",
  },
  {
    day: 25,
    title: "Final Pre-Launch Check",
    description: "Test all systems. Verify payment flows, emails, and onboarding work perfectly.",
    category: "preparation",
  },

  // Days 26-27: Launch!
  {
    day: 26,
    title: "Launch on ProductHunt (12:01 AM PST)",
    description: "Go live on ProductHunt. Post immediately to social media. Engage with every comment.",
    category: "launch",
  },
  {
    day: 27,
    title: "Launch Everywhere Else",
    description: "Post in communities, forums, and groups. Send email announcement. Share on LinkedIn/Twitter.",
    category: "launch",
  },

  // Days 28-30: Post-Launch
  {
    day: 28,
    title: "Collect Launch Feedback",
    description: "Reach out to new users. Send feedback survey. Identify quick wins and urgent bugs.",
    category: "post_launch",
  },
  {
    day: 29,
    title: "Analyze Launch Data",
    description: "Review analytics, conversion rates, and user behavior. What worked? What didn't?",
    category: "post_launch",
  },
  {
    day: 30,
    title: "Plan Next 30 Days",
    description: "Based on launch learnings, create plan for next month. Set growth goals and priorities.",
    category: "post_launch",
  },
]

export function getCategoryColor(category: LaunchTask['category']): string {
  const colors = {
    planning: 'bg-blue-500',
    building: 'bg-purple-500',
    marketing: 'bg-green-500',
    preparation: 'bg-yellow-500',
    launch: 'bg-red-500',
    post_launch: 'bg-gray-500',
  }
  return colors[category]
}

export function getCategoryLabel(category: LaunchTask['category']): string {
  const labels = {
    planning: 'Planning',
    building: 'Building',
    marketing: 'Marketing',
    preparation: 'Preparation',
    launch: 'Launch',
    post_launch: 'Post-Launch',
  }
  return labels[category]
}

export function getProgressPercentage(completedCount: number, totalCount: number): number {
  return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
}
