import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { NotificationCenter } from "@/components/notification-center"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BEAM OS Dashboard",
  description: "Community-owned infrastructure and cooperative economics platform",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // ADD suppressHydrationWarning={true} TO HTML TAG
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      {/* ADD suppressHydrationWarning={true} TO BODY TAG */}
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "rgba(17, 24, 39, 0.8)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(75, 85, 99, 0.3)",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            },
            className: "glass-toast",
          }}
        />
        <NotificationCenter />
      </body>
    </html>
  )
}
