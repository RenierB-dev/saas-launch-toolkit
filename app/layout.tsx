import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "SaaS Launch Toolkit",
  description: "Launch your SaaS in 30 days",
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
        </ThemeProvider>
      </body>
    </html>
  )
}
