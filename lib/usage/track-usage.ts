import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export type ToolName =
  | "pricing_calculator"
  | "launch_sequence"
  | "producthunt_optimizer"
  | "customer_acquisition"
  | "marketing_assets"

export async function trackToolUsage(toolName: ToolName) {
  try {
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error("Error getting user:", userError)
      return
    }

    if (!user) return

    // Record usage in database
    const { error } = await supabase
      .from("usage_tracking")
      .insert({
        user_id: user.id,
        tool_name: toolName,
        accessed_at: new Date().toISOString()
      })

    if (error) {
      console.error("Error tracking usage:", error)
      // Don't show toast for tracking errors - it's not critical to user experience
    }
  } catch (error) {
    console.error("Unexpected error tracking usage:", error)
  }
}

export async function getUsageStats() {
  try {
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error("Error getting user:", userError)
      toast.error("Failed to load usage statistics")
      return null
    }

    if (!user) return null

    // Get unique tools used
    const { data: usageData, error: usageError } = await supabase
      .from("usage_tracking")
      .select("tool_name")
      .eq("user_id", user.id)

    if (usageError) {
      console.error("Error fetching usage data:", usageError)
      toast.error("Failed to load tool usage data")
      return null
    }

    const uniqueTools = usageData
      ? [...new Set(usageData.map(u => u.tool_name))]
      : []

    // Get launch sequence progress
    const { data: launchTasks, error: tasksError } = await supabase
      .from("launch_tasks")
      .select("is_completed")
      .eq("user_id", user.id)

    if (tasksError) {
      console.error("Error fetching launch tasks:", tasksError)
    }

    const completedTasks = launchTasks?.filter(t => t.is_completed).length || 0
    const totalTasks = launchTasks?.length || 30

    // Calculate days active (from profile creation)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("created_at")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
    }

    let daysActive = 0
    if (profile?.created_at) {
      const createdDate = new Date(profile.created_at)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - createdDate.getTime())
      daysActive = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    return {
      toolsUsed: uniqueTools.length,
      totalTools: 5,
      launchProgress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      completedTasks,
      totalTasks,
      daysActive,
      daysUntilLaunch: Math.max(0, 30 - daysActive)
    }
  } catch (error) {
    console.error("Unexpected error in getUsageStats:", error)
    toast.error("Failed to load dashboard statistics")
    return null
  }
}
