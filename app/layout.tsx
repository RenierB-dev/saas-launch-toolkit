import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: {
    default: "SaaS Launch Toolkit - Launch Your SaaS in 30 Days",
    template: "%s | SaaS Launch Toolkit"
  },
  description: "Complete toolkit for solo founders launching their SaaS. ProductHunt optimizer, pricing calculator, 30-day launch sequence, customer acquisition playbook, and marketing asset generator. Launch faster, grow smarter.",
  keywords: [
    "saas launch",
    "product launch",
    "startup toolkit",
    "producthunt optimizer",
    "pricing calculator",
    "launch sequence",
    "customer acquisition",
    "marketing tools",
    "solo founder",
    "indie hacker",
    "saas tools",
    "startup tools"
  ],
  authors: [{ name: "SaaS Launch Toolkit" }],
  creator: "SaaS Launch Toolkit",
  publisher: "SaaS Launch Toolkit",
  metadataBase: new URL("https://saas-launch-toolkit.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saas-launch-toolkit.vercel.app",
    title: "SaaS Launch Toolkit - Launch Your SaaS in 30 Days",
    description: "Complete toolkit for solo founders. ProductHunt optimizer, pricing calculator, 30-day sequence, customer acquisition, and marketing tools.",
    siteName: "SaaS Launch Toolkit",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Launch Toolkit - Launch Your SaaS in 30 Days",
    description: "Complete toolkit for solo founders. ProductHunt optimizer, pricing calculator, 30-day sequence, customer acquisition, and marketing tools.",
    creator: "@saaslaunch",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          defaultTheme="dark"
          storageKey="saas-toolkit-theme"
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
