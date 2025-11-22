"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { Calendar as CalendarIcon, CheckSquare, Clock, Download, Mail, Rocket, Filter, FileText, Code, Users, BarChart, FileCheck } from "lucide-react"

interface Task {
  id: string
  title: string
  estimatedTime: string
  priority: "High" | "Medium" | "Low"
  category: string
  completed: boolean
}

interface DayData {
  day: number
  phase: string
  phaseColor: string
  tasks: Task[]
}

// Complete 30-day launch sequence
const launchSequenceData: DayData[] = [
  // Days 1-5: Planning Phase (Blue)
  {
    day: 1,
    phase: "Planning",
    phaseColor: "blue",
    tasks: [
      { id: "1-1", title: "Define core problem your product solves", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "1-2", title: "Identify target audience and pain points", estimatedTime: "1.5h", priority: "High", category: "Product Development", completed: false },
      { id: "1-3", title: "Write down your unique solution approach", estimatedTime: "1h", priority: "Medium", category: "Product Development", completed: false },
      { id: "1-4", title: "Set up project management tool (Trello/Notion)", estimatedTime: "30m", priority: "Low", category: "Legal & Admin", completed: false }
    ]
  },
  {
    day: 2,
    phase: "Planning",
    phaseColor: "blue",
    tasks: [
      { id: "2-1", title: "Research top 10 direct competitors", estimatedTime: "3h", priority: "High", category: "Product Development", completed: false },
      { id: "2-2", title: "Analyze competitor pricing models", estimatedTime: "1.5h", priority: "High", category: "Product Development", completed: false },
      { id: "2-3", title: "Document competitor strengths and weaknesses", estimatedTime: "1h", priority: "Medium", category: "Product Development", completed: false },
      { id: "2-4", title: "Identify gaps in market your product can fill", estimatedTime: "1h", priority: "High", category: "Product Development", completed: false }
    ]
  },
  {
    day: 3,
    phase: "Planning",
    phaseColor: "blue",
    tasks: [
      { id: "3-1", title: "Define your unique value proposition", estimatedTime: "2h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "3-2", title: "Write one-sentence product description", estimatedTime: "1h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "3-3", title: "Craft elevator pitch (30 seconds)", estimatedTime: "1h", priority: "Medium", category: "Marketing & Content", completed: false },
      { id: "3-4", title: "Get feedback on positioning from 3 people", estimatedTime: "1.5h", priority: "Medium", category: "Community Building", completed: false }
    ]
  },
  {
    day: 4,
    phase: "Planning",
    phaseColor: "blue",
    tasks: [
      { id: "4-1", title: "Create 3 detailed user personas", estimatedTime: "2.5h", priority: "High", category: "Product Development", completed: false },
      { id: "4-2", title: "Map user journey from problem to solution", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "4-3", title: "Identify key user pain points for each persona", estimatedTime: "1h", priority: "Medium", category: "Product Development", completed: false },
      { id: "4-4", title: "Define success metrics for each user type", estimatedTime: "1h", priority: "Medium", category: "Analytics & Tracking", completed: false }
    ]
  },
  {
    day: 5,
    phase: "Planning",
    phaseColor: "blue",
    tasks: [
      { id: "5-1", title: "List all possible features (brainstorm)", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "5-2", title: "Prioritize features using MoSCoW method", estimatedTime: "1.5h", priority: "High", category: "Product Development", completed: false },
      { id: "5-3", title: "Define MVP scope (must-have features only)", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "5-4", title: "Create product roadmap for first 3 months", estimatedTime: "1.5h", priority: "Medium", category: "Product Development", completed: false }
    ]
  },
  // Days 6-10: Planning Phase continues
  {
    day: 6,
    phase: "Planning",
    phaseColor: "blue",
    tasks: [
      { id: "6-1", title: "Sketch basic wireframes for main screens", estimatedTime: "3h", priority: "High", category: "Product Development", completed: false },
      { id: "6-2", title: "Design user flow diagrams", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "6-3", title: "Create lo-fi mockups in Figma/Sketch", estimatedTime: "2h", priority: "Medium", category: "Product Development", completed: false },
      { id: "6-4", title: "Get design feedback from potential users", estimatedTime: "1h", priority: "Low", category: "Community Building", completed: false }
    ]
  },
  {
    day: 7,
    phase: "Planning",
    phaseColor: "blue",
    tasks: [
      { id: "7-1", title: "Choose tech stack (frontend, backend, database)", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "7-2", title: "Select hosting provider and plan", estimatedTime: "1h", priority: "High", category: "Product Development", completed: false },
      { id: "7-3", title: "Choose authentication solution", estimatedTime: "1h", priority: "High", category: "Product Development", completed: false },
      { id: "7-4", title: "Plan database schema and relationships", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false }
    ]
  },
  {
    day: 8,
    phase: "Planning",
    phaseColor: "blue",
    tasks: [
      { id: "8-1", title: "Set up version control (Git + GitHub)", estimatedTime: "30m", priority: "High", category: "Product Development", completed: false },
      { id: "8-2", title: "Initialize project with chosen framework", estimatedTime: "1h", priority: "High", category: "Product Development", completed: false },
      { id: "8-3", title: "Configure development environment", estimatedTime: "1.5h", priority: "High", category: "Product Development", completed: false },
      { id: "8-4", title: "Set up CI/CD pipeline basics", estimatedTime: "2h", priority: "Medium", category: "Product Development", completed: false },
      { id: "8-5", title: "Create development workflow documentation", estimatedTime: "1h", priority: "Low", category: "Product Development", completed: false }
    ]
  },
  {
    day: 9,
    phase: "Planning",
    phaseColor: "blue",
    tasks: [
      { id: "9-1", title: "Break down MVP into weekly sprints", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "9-2", title: "Create detailed task list for next 2 weeks", estimatedTime: "1.5h", priority: "High", category: "Product Development", completed: false },
      { id: "9-3", title: "Set up time tracking system", estimatedTime: "30m", priority: "Low", category: "Legal & Admin", completed: false },
      { id: "9-4", title: "Schedule daily development blocks", estimatedTime: "30m", priority: "Medium", category: "Legal & Admin", completed: false }
    ]
  },
  {
    day: 10,
    phase: "Planning",
    phaseColor: "blue",
    tasks: [
      { id: "10-1", title: "Define key performance indicators (KPIs)", estimatedTime: "2h", priority: "High", category: "Analytics & Tracking", completed: false },
      { id: "10-2", title: "Set specific launch goals (users, revenue)", estimatedTime: "1h", priority: "High", category: "Analytics & Tracking", completed: false },
      { id: "10-3", title: "Plan analytics implementation strategy", estimatedTime: "1.5h", priority: "Medium", category: "Analytics & Tracking", completed: false },
      { id: "10-4", title: "Choose analytics tools (GA4, Mixpanel, etc.)", estimatedTime: "1h", priority: "Medium", category: "Analytics & Tracking", completed: false }
    ]
  },
  // Days 11-15: Building Phase (Purple)
  {
    day: 11,
    phase: "Building",
    phaseColor: "purple",
    tasks: [
      { id: "11-1", title: "Set up authentication system", estimatedTime: "4h", priority: "High", category: "Product Development", completed: false },
      { id: "11-2", title: "Implement user registration flow", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "11-3", title: "Build login/logout functionality", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "11-4", title: "Add password reset feature", estimatedTime: "1.5h", priority: "Medium", category: "Product Development", completed: false }
    ]
  },
  {
    day: 12,
    phase: "Building",
    phaseColor: "purple",
    tasks: [
      { id: "12-1", title: "Build core feature #1 (main functionality)", estimatedTime: "5h", priority: "High", category: "Product Development", completed: false },
      { id: "12-2", title: "Write unit tests for core feature", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "12-3", title: "Test feature with different scenarios", estimatedTime: "1.5h", priority: "High", category: "Product Development", completed: false }
    ]
  },
  {
    day: 13,
    phase: "Building",
    phaseColor: "purple",
    tasks: [
      { id: "13-1", title: "Build core feature #2", estimatedTime: "5h", priority: "High", category: "Product Development", completed: false },
      { id: "13-2", title: "Integrate features #1 and #2", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "13-3", title: "Test integration flows", estimatedTime: "1.5h", priority: "High", category: "Product Development", completed: false }
    ]
  },
  {
    day: 14,
    phase: "Building",
    phaseColor: "purple",
    tasks: [
      { id: "14-1", title: "Create user dashboard layout", estimatedTime: "3h", priority: "High", category: "Product Development", completed: false },
      { id: "14-2", title: "Build settings page", estimatedTime: "2h", priority: "Medium", category: "Product Development", completed: false },
      { id: "14-3", title: "Implement profile management", estimatedTime: "2h", priority: "Medium", category: "Product Development", completed: false },
      { id: "14-4", title: "Add onboarding flow for new users", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false }
    ]
  },
  {
    day: 15,
    phase: "Building",
    phaseColor: "purple",
    tasks: [
      { id: "15-1", title: "Set up Stripe/payment provider account", estimatedTime: "1h", priority: "High", category: "Product Development", completed: false },
      { id: "15-2", title: "Integrate payment system", estimatedTime: "4h", priority: "High", category: "Product Development", completed: false },
      { id: "15-3", title: "Build pricing page", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "15-4", title: "Test payment flows (test mode)", estimatedTime: "1.5h", priority: "High", category: "Product Development", completed: false }
    ]
  },
  // Days 16-20: Building Phase continues
  {
    day: 16,
    phase: "Building",
    phaseColor: "purple",
    tasks: [
      { id: "16-1", title: "Write compelling landing page headline", estimatedTime: "2h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "16-2", title: "Draft landing page copy (hero, features, CTA)", estimatedTime: "3h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "16-3", title: "Write FAQ section", estimatedTime: "1.5h", priority: "Medium", category: "Marketing & Content", completed: false },
      { id: "16-4", title: "Get copywriting feedback", estimatedTime: "1h", priority: "Low", category: "Community Building", completed: false }
    ]
  },
  {
    day: 17,
    phase: "Building",
    phaseColor: "purple",
    tasks: [
      { id: "17-1", title: "Design landing page layout", estimatedTime: "4h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "17-2", title: "Build landing page with framework", estimatedTime: "3h", priority: "High", category: "Product Development", completed: false },
      { id: "17-3", title: "Optimize for mobile responsiveness", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "17-4", title: "Add animations and micro-interactions", estimatedTime: "1.5h", priority: "Low", category: "Product Development", completed: false }
    ]
  },
  {
    day: 18,
    phase: "Building",
    phaseColor: "purple",
    tasks: [
      { id: "18-1", title: "Set up Google Analytics 4", estimatedTime: "1h", priority: "High", category: "Analytics & Tracking", completed: false },
      { id: "18-2", title: "Implement event tracking for key actions", estimatedTime: "2h", priority: "High", category: "Analytics & Tracking", completed: false },
      { id: "18-3", title: "Set up conversion funnels", estimatedTime: "1.5h", priority: "High", category: "Analytics & Tracking", completed: false },
      { id: "18-4", title: "Configure error tracking (Sentry)", estimatedTime: "1.5h", priority: "Medium", category: "Analytics & Tracking", completed: false },
      { id: "18-5", title: "Test all tracking events", estimatedTime: "1h", priority: "High", category: "Analytics & Tracking", completed: false }
    ]
  },
  {
    day: 19,
    phase: "Building",
    phaseColor: "purple",
    tasks: [
      { id: "19-1", title: "Recruit 5 beta testers from network", estimatedTime: "2h", priority: "High", category: "Community Building", completed: false },
      { id: "19-2", title: "Send beta access and instructions", estimatedTime: "1h", priority: "High", category: "Community Building", completed: false },
      { id: "19-3", title: "Conduct user testing sessions", estimatedTime: "3h", priority: "High", category: "Community Building", completed: false },
      { id: "19-4", title: "Collect and document feedback", estimatedTime: "1.5h", priority: "High", category: "Community Building", completed: false }
    ]
  },
  {
    day: 20,
    phase: "Building",
    phaseColor: "purple",
    tasks: [
      { id: "20-1", title: "Prioritize critical bugs from beta testing", estimatedTime: "1h", priority: "High", category: "Product Development", completed: false },
      { id: "20-2", title: "Fix critical bugs and issues", estimatedTime: "5h", priority: "High", category: "Product Development", completed: false },
      { id: "20-3", title: "Re-test fixed issues", estimatedTime: "1.5h", priority: "High", category: "Product Development", completed: false },
      { id: "20-4", title: "Update documentation based on feedback", estimatedTime: "1h", priority: "Medium", category: "Product Development", completed: false }
    ]
  },
  // Days 21-25: Marketing Phase (Orange)
  {
    day: 21,
    phase: "Marketing",
    phaseColor: "orange",
    tasks: [
      { id: "21-1", title: "Create Twitter/X account", estimatedTime: "30m", priority: "High", category: "Marketing & Content", completed: false },
      { id: "21-2", title: "Create LinkedIn company page", estimatedTime: "30m", priority: "High", category: "Marketing & Content", completed: false },
      { id: "21-3", title: "Set up Instagram (if visual product)", estimatedTime: "30m", priority: "Low", category: "Marketing & Content", completed: false },
      { id: "21-4", title: "Write bio and profile descriptions", estimatedTime: "1h", priority: "Medium", category: "Marketing & Content", completed: false },
      { id: "21-5", title: "Post first introduction tweet", estimatedTime: "30m", priority: "High", category: "Marketing & Content", completed: false }
    ]
  },
  {
    day: 22,
    phase: "Marketing",
    phaseColor: "orange",
    tasks: [
      { id: "22-1", title: "Write comprehensive launch blog post", estimatedTime: "4h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "22-2", title: "Add images and screenshots to blog post", estimatedTime: "1.5h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "22-3", title: "Write founder&apos;s story/about page", estimatedTime: "2h", priority: "Medium", category: "Marketing & Content", completed: false },
      { id: "22-4", title: "SEO optimize blog content", estimatedTime: "1h", priority: "Medium", category: "Marketing & Content", completed: false }
    ]
  },
  {
    day: 23,
    phase: "Marketing",
    phaseColor: "orange",
    tasks: [
      { id: "23-1", title: "Design product screenshots for social media", estimatedTime: "2h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "23-2", title: "Create launch announcement graphics", estimatedTime: "2h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "23-3", title: "Design feature highlight images (5-6)", estimatedTime: "2h", priority: "Medium", category: "Marketing & Content", completed: false },
      { id: "23-4", title: "Prepare social media content calendar", estimatedTime: "1.5h", priority: "Medium", category: "Marketing & Content", completed: false }
    ]
  },
  {
    day: 24,
    phase: "Marketing",
    phaseColor: "orange",
    tasks: [
      { id: "24-1", title: "Record product demo video (2-3 min)", estimatedTime: "3h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "24-2", title: "Edit and add captions to video", estimatedTime: "2h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "24-3", title: "Upload to YouTube/Vimeo", estimatedTime: "30m", priority: "High", category: "Marketing & Content", completed: false },
      { id: "24-4", title: "Create video thumbnail", estimatedTime: "30m", priority: "Medium", category: "Marketing & Content", completed: false },
      { id: "24-5", title: "Embed video on landing page", estimatedTime: "30m", priority: "High", category: "Product Development", completed: false }
    ]
  },
  {
    day: 25,
    phase: "Marketing",
    phaseColor: "orange",
    tasks: [
      { id: "25-1", title: "Submit product to ProductHunt Upcoming", estimatedTime: "1h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "25-2", title: "Engage with PH community (comment, upvote)", estimatedTime: "1.5h", priority: "High", category: "Community Building", completed: false },
      { id: "25-3", title: "Build relationships with potential hunters", estimatedTime: "2h", priority: "High", category: "Community Building", completed: false },
      { id: "25-4", title: "Prepare ProductHunt launch assets", estimatedTime: "2h", priority: "High", category: "Marketing & Content", completed: false }
    ]
  },
  // Days 26-27: Marketing Phase continues
  {
    day: 26,
    phase: "Marketing",
    phaseColor: "orange",
    tasks: [
      { id: "26-1", title: "Compile list of 50 potential early users", estimatedTime: "2h", priority: "High", category: "Community Building", completed: false },
      { id: "26-2", title: "Write personalized outreach email template", estimatedTime: "1.5h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "26-3", title: "Send emails to 50 potential users", estimatedTime: "2.5h", priority: "High", category: "Community Building", completed: false },
      { id: "26-4", title: "Follow up on responses", estimatedTime: "1h", priority: "Medium", category: "Community Building", completed: false }
    ]
  },
  {
    day: 27,
    phase: "Marketing",
    phaseColor: "orange",
    tasks: [
      { id: "27-1", title: "Find 10 relevant online communities", estimatedTime: "1.5h", priority: "High", category: "Community Building", completed: false },
      { id: "27-2", title: "Join communities and introduce yourself", estimatedTime: "1h", priority: "High", category: "Community Building", completed: false },
      { id: "27-3", title: "Share product in communities (not spammy)", estimatedTime: "2.5h", priority: "High", category: "Community Building", completed: false },
      { id: "27-4", title: "Engage authentically with community members", estimatedTime: "2h", priority: "Medium", category: "Community Building", completed: false }
    ]
  },
  // Days 28-30: Launch Prep (Red)
  {
    day: 28,
    phase: "Launch Prep",
    phaseColor: "red",
    tasks: [
      { id: "28-1", title: "Complete end-to-end testing", estimatedTime: "3h", priority: "High", category: "Product Development", completed: false },
      { id: "28-2", title: "Test on multiple devices and browsers", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "28-3", title: "Fix any last-minute UI/UX issues", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "28-4", title: "Verify all links and CTAs work", estimatedTime: "1h", priority: "High", category: "Product Development", completed: false },
      { id: "28-5", title: "Final copy proofread", estimatedTime: "1h", priority: "Medium", category: "Marketing & Content", completed: false }
    ]
  },
  {
    day: 29,
    phase: "Launch Prep",
    phaseColor: "red",
    tasks: [
      { id: "29-1", title: "Set up customer support system (Intercom/email)", estimatedTime: "2h", priority: "High", category: "Product Development", completed: false },
      { id: "29-2", title: "Create comprehensive FAQ page", estimatedTime: "2.5h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "29-3", title: "Write help documentation", estimatedTime: "3h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "29-4", title: "Prepare email templates for support", estimatedTime: "1.5h", priority: "Medium", category: "Marketing & Content", completed: false }
    ]
  },
  {
    day: 30,
    phase: "Launch Prep",
    phaseColor: "red",
    tasks: [
      { id: "30-1", title: "🚀 Launch on ProductHunt at 12:01 AM PST", estimatedTime: "30m", priority: "High", category: "Marketing & Content", completed: false },
      { id: "30-2", title: "Share launch on all social media channels", estimatedTime: "1h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "30-3", title: "Send launch email to mailing list", estimatedTime: "1h", priority: "High", category: "Marketing & Content", completed: false },
      { id: "30-4", title: "Monitor and respond to comments/questions", estimatedTime: "6h", priority: "High", category: "Community Building", completed: false },
      { id: "30-5", title: "Celebrate your launch! 🎉", estimatedTime: "All day", priority: "High", category: "Legal & Admin", completed: false }
    ]
  }
]

const categoryIcons: Record<string, any> = {
  "Product Development": Code,
  "Marketing & Content": FileText,
  "Community Building": Users,
  "Analytics & Tracking": BarChart,
  "Legal & Admin": FileCheck
}

export default function LaunchSequencePage() {
  const { toast } = useToast()
  const [launchDate, setLaunchDate] = useState<Date | undefined>()
  const [productName, setProductName] = useState("")
  const [taskCompletion, setTaskCompletion] = useState<Record<string, boolean>>({})
  const [filterView, setFilterView] = useState<"all" | "incomplete" | "completed" | "high">("all")
  const [emailReminders, setEmailReminders] = useState(false)
  const [weeklySummary, setWeeklySummary] = useState(false)
  const [reminderTime, setReminderTime] = useState("09:00")

  // Calculate days until launch
  const daysUntilLaunch = launchDate
    ? Math.ceil((launchDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  // Calculate current day in sequence
  const currentDay = daysUntilLaunch !== null && daysUntilLaunch <= 30
    ? 31 - daysUntilLaunch
    : null

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    setTaskCompletion(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }))
  }

  // Calculate overall progress
  const totalTasks = launchSequenceData.reduce((acc, day) => acc + day.tasks.length, 0)
  const completedTasks = Object.values(taskCompletion).filter(Boolean).length
  const progressPercentage = (completedTasks / totalTasks) * 100

  // Filter days based on selected filter
  const filteredDays = useMemo(() => {
    return launchSequenceData.map(day => {
      let filteredTasks = day.tasks

      if (filterView === "incomplete") {
        filteredTasks = day.tasks.filter(task => !taskCompletion[task.id])
      } else if (filterView === "completed") {
        filteredTasks = day.tasks.filter(task => taskCompletion[task.id])
      } else if (filterView === "high") {
        filteredTasks = day.tasks.filter(task => task.priority === "High")
      }

      return { ...day, tasks: filteredTasks }
    }).filter(day => day.tasks.length > 0)
  }, [filterView, taskCompletion])

  // Group tasks by category
  const tasksByCategory = useMemo(() => {
    const categories: Record<string, Task[]> = {}
    launchSequenceData.forEach(day => {
      day.tasks.forEach(task => {
        if (!categories[task.category]) {
          categories[task.category] = []
        }
        categories[task.category].push(task)
      })
    })
    return categories
  }, [])

  // Calculate progress per category
  const categoryProgress = useMemo(() => {
    const progress: Record<string, { completed: number; total: number; hours: number }> = {}
    Object.entries(tasksByCategory).forEach(([category, tasks]) => {
      const completed = tasks.filter(task => taskCompletion[task.id]).length
      const hours = tasks.reduce((acc, task) => {
        const time = parseFloat(task.estimatedTime)
        return acc + (isNaN(time) ? 0 : time)
      }, 0)
      progress[category] = { completed, total: tasks.length, hours }
    })
    return progress
  }, [tasksByCategory, taskCompletion])

  // Get phase color classes
  const getPhaseColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
      purple: "border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20",
      orange: "border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20",
      red: "border-l-red-500 bg-red-50/50 dark:bg-red-950/20"
    }
    return colors[color] || ""
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      High: "destructive",
      Medium: "default",
      Low: "outline"
    }
    return colors[priority] || "outline"
  }

  // Export functions
  const exportToNotion = () => {
    let markdown = `# ${productName || 'My SaaS'} - 30 Day Launch Plan\n\n`
    markdown += `**Launch Date:** ${launchDate?.toLocaleDateString() || 'Not set'}\n\n`

    launchSequenceData.forEach(day => {
      markdown += `## Day ${day.day} - ${day.phase}\n\n`
      day.tasks.forEach(task => {
        const checked = taskCompletion[task.id] ? 'x' : ' '
        markdown += `- [${checked}] ${task.title} (${task.estimatedTime}, ${task.priority})\n`
      })
      markdown += '\n'
    })

    navigator.clipboard.writeText(markdown)
    toast({
      title: "Copied to Clipboard!",
      description: "Paste into Notion to import your launch plan"
    })
  }

  const downloadAsCalendar = () => {
    if (!launchDate) {
      toast({
        title: "Set Launch Date",
        description: "Please select a launch date first",
        variant: "destructive"
      })
      return
    }

    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SaaS Launch Toolkit//EN\n`

    launchSequenceData.forEach(day => {
      const taskDate = new Date(launchDate)
      taskDate.setDate(taskDate.getDate() - (30 - day.day))

      const dateStr = taskDate.toISOString().split('T')[0].replace(/-/g, '')
      const summary = `Day ${day.day}: ${day.phase} - ${day.tasks.length} tasks`
      const description = day.tasks.map(t => `- ${t.title}`).join('\\n')

      icsContent += `BEGIN:VEVENT\n`
      icsContent += `DTSTART:${dateStr}\n`
      icsContent += `SUMMARY:${summary}\n`
      icsContent += `DESCRIPTION:${description}\n`
      icsContent += `END:VEVENT\n`
    })

    icsContent += `END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'launch-sequence.ics'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Calendar Downloaded",
      description: "Import the .ics file into Google Calendar or any calendar app"
    })
  }

  const saveEmailSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Email reminder preferences have been saved"
    })
  }

  // Calculate date for specific day
  const getDateForDay = (dayNumber: number) => {
    if (!launchDate) return null
    const date = new Date(launchDate)
    date.setDate(date.getDate() - (30 - dayNumber))
    return date
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Rocket className="h-10 w-10 text-orange-600" />
        <div>
          <h1 className="text-4xl font-bold">30-Day Launch Sequence</h1>
          <p className="text-muted-foreground">
            Your complete day-by-day guide to launching your SaaS
          </p>
        </div>
      </div>

      {/* Section 1: Launch Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Launch Configuration</CardTitle>
          <CardDescription>Set your target launch date and product name</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="My Awesome SaaS"
              />

              <div className="space-y-2 pt-4">
                <Label>Select Launch Date</Label>
                <Calendar
                  mode="single"
                  selected={launchDate}
                  onSelect={setLaunchDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
            </div>

            <div className="space-y-4">
              {launchDate && (
                <>
                  <Card className="border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-2">
                        <CalendarIcon className="h-12 w-12 mx-auto text-orange-600" />
                        <div className="text-sm text-muted-foreground">Launch Date</div>
                        <div className="text-3xl font-bold">{launchDate.toLocaleDateString()}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-2">
                        <Clock className="h-12 w-12 mx-auto text-blue-600" />
                        <div className="text-sm text-muted-foreground">Days Until Launch</div>
                        <div className="text-5xl font-bold text-blue-600">
                          {daysUntilLaunch !== null && daysUntilLaunch >= 0 ? daysUntilLaunch : '0'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {currentDay !== null && currentDay > 0 && currentDay <= 30 && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <CheckSquare className="h-12 w-12 mx-auto text-green-600" />
                          <div className="text-sm text-muted-foreground">Current Day</div>
                          <div className="text-5xl font-bold text-green-600">Day {currentDay}</div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span className="font-semibold">{completedTasks} / {totalTasks} tasks</span>
                      </div>
                      <Progress value={progressPercentage} className="h-3" />
                      <div className="text-center text-sm text-muted-foreground">
                        {progressPercentage.toFixed(1)}% complete
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Daily Timeline
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Filter className="h-4 w-4 mr-2" />
            By Category
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="h-4 w-4 mr-2" />
            Export & Reminders
          </TabsTrigger>
        </TabsList>

        {/* Section 2: Daily Task Timeline */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>30-Day Launch Timeline</CardTitle>
                  <CardDescription>Complete tasks day by day to stay on track</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterView === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterView("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterView === "incomplete" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterView("incomplete")}
                  >
                    Incomplete
                  </Button>
                  <Button
                    variant={filterView === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterView("completed")}
                  >
                    Completed
                  </Button>
                  <Button
                    variant={filterView === "high" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterView("high")}
                  >
                    High Priority
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredDays.map((day) => {
                  const dayDate = getDateForDay(day.day)
                  const completedInDay = day.tasks.filter(task => taskCompletion[task.id]).length
                  const totalInDay = day.tasks.length
                  const dayProgress = (completedInDay / totalInDay) * 100

                  return (
                    <AccordionItem key={day.day} value={`day-${day.day}`}>
                      <AccordionTrigger className={`border-l-4 pl-4 ${getPhaseColorClass(day.phaseColor)}`}>
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="font-bold">Day {day.day}</div>
                              {dayDate && (
                                <div className="text-sm text-muted-foreground">
                                  {dayDate.toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            <Badge variant="outline">{day.phase}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {completedInDay}/{totalInDay} tasks
                            </span>
                            <div className="w-24">
                              <Progress value={dayProgress} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-4 pl-4">
                          {day.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                              <Checkbox
                                checked={taskCompletion[task.id] || false}
                                onCheckedChange={() => toggleTask(task.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1 space-y-1">
                                <div className={`font-medium ${taskCompletion[task.id] ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.title}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {task.estimatedTime}
                                  </span>
                                  <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                                    {task.priority}
                                  </Badge>
                                  <span>{task.category}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 3: Task Categories View */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Category</CardTitle>
              <CardDescription>View all tasks organized by category</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6">
            {Object.entries(tasksByCategory).map(([category, tasks]) => {
              const Icon = categoryIcons[category]
              const progress = categoryProgress[category]
              const progressPercentage = (progress.completed / progress.total) * 100

              return (
                <Card key={category}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-blue-600" />
                        <div>
                          <CardTitle className="text-xl">{category}</CardTitle>
                          <CardDescription>
                            {progress.completed} / {progress.total} tasks completed • ~{progress.hours.toFixed(1)} hours total
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
                        <Progress value={progressPercentage} className="w-32 h-2 mt-2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={taskCompletion[task.id] || false}
                            onCheckedChange={() => toggleTask(task.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <div className={`text-sm ${taskCompletion[task.id] ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>Day {launchSequenceData.find(d => d.tasks.some(t => t.id === task.id))?.day}</span>
                              <span>•</span>
                              <span>{task.estimatedTime}</span>
                              <span>•</span>
                              <Badge variant={getPriorityColor(task.priority) as any} className="text-xs h-5">
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Section 4: Export & Reminders */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Your Launch Plan</CardTitle>
              <CardDescription>Download or copy your complete 30-day sequence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button onClick={exportToNotion} variant="outline" className="h-20">
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-semibold">Copy to Notion</div>
                    <div className="text-xs text-muted-foreground">Markdown format</div>
                  </div>
                </Button>

                <Button onClick={downloadAsCalendar} variant="outline" className="h-20">
                  <div className="text-center">
                    <CalendarIcon className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-semibold">Download Calendar</div>
                    <div className="text-xs text-muted-foreground">ICS file for Google Calendar</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Reminders</CardTitle>
              <CardDescription>Get daily reminders to stay on track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Task Digest</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive your tasks for the day every morning
                    </div>
                  </div>
                  <Checkbox
                    checked={emailReminders}
                    onCheckedChange={(checked) => setEmailReminders(checked as boolean)}
                  />
                </div>

                {emailReminders && (
                  <div className="space-y-2 pl-6 border-l-2">
                    <Label htmlFor="reminder-time">Send Time</Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-40"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Summary</Label>
                    <div className="text-sm text-muted-foreground">
                      Get a progress report every Sunday
                    </div>
                  </div>
                  <Checkbox
                    checked={weeklySummary}
                    onCheckedChange={(checked) => setWeeklySummary(checked as boolean)}
                  />
                </div>
              </div>

              <Button onClick={saveEmailSettings} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Save Email Settings
              </Button>

              <div className="text-xs text-muted-foreground text-center pt-2">
                Email reminders will be sent to your account email
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect with your favorite tools (coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center opacity-50">
                  <div className="font-semibold mb-1">Slack</div>
                  <div className="text-sm text-muted-foreground">Daily task notifications</div>
                  <Badge variant="outline" className="mt-2">Coming Soon</Badge>
                </div>
                <div className="border rounded-lg p-4 text-center opacity-50">
                  <div className="font-semibold mb-1">Trello</div>
                  <div className="text-sm text-muted-foreground">Sync tasks to boards</div>
                  <Badge variant="outline" className="mt-2">Coming Soon</Badge>
                </div>
                <div className="border rounded-lg p-4 text-center opacity-50">
                  <div className="font-semibold mb-1">Asana</div>
                  <div className="text-sm text-muted-foreground">Export to projects</div>
                  <Badge variant="outline" className="mt-2">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
