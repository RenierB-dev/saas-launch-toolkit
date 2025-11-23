"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  hover?: boolean
  glow?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, glow = false, children, ...props }, ref) => {
    const cardVariants = {
      initial: { y: 0, scale: 1 },
      hover: hover ? { y: -4, scale: 1.02 } : {},
    }

    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "glass rounded-xl p-6 transition-all duration-300",
          hover && "hover:shadow-2xl hover:shadow-purple-500/10",
          glow && "ring-1 ring-purple-500/20 animate-pulse-glow",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = "GlassCard"

export { GlassCard }
