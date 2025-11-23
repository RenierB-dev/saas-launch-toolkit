"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface GradientButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
  loading?: boolean
  icon?: React.ReactNode
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", size = "default", loading, icon, children, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"

    const sizeStyles = {
      default: "h-10 px-6 py-2 text-sm",
      sm: "h-9 px-4 py-1.5 text-xs",
      lg: "h-12 px-8 py-3 text-base",
    }

    const variantStyles = {
      primary: "bg-gradient-primary text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105",
      secondary: "border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white",
      ghost: "text-purple-500 hover:bg-purple-500/10",
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: variant !== "ghost" ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {variant === "primary" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        )}
        <span className="relative flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {!loading && icon}
          {children as React.ReactNode}
        </span>
      </motion.button>
    )
  }
)

GradientButton.displayName = "GradientButton"

export { GradientButton }
