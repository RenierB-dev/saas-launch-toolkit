"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Rocket,
  Calculator,
  Calendar,
  Users,
  FileText,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const navigation = [
  {
    name: "ProductHunt Optimizer",
    href: "/dashboard/producthunt-optimizer",
    icon: Rocket,
  },
  {
    name: "Pricing Calculator",
    href: "/dashboard/pricing-calculator",
    icon: Calculator,
  },
  {
    name: "Launch Sequence",
    href: "/dashboard/launch-sequence",
    icon: Calendar,
  },
  {
    name: "Get Customers",
    href: "/dashboard/customer-acquisition",
    icon: Users,
  },
  {
    name: "Marketing Assets",
    href: "/dashboard/marketing-assets",
    icon: FileText,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            SaaS Toolkit
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <Separator />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage src="/avatar-placeholder.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
