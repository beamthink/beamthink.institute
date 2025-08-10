import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { NotificationCenter } from "@/components/notification-center"
import ScreenSaver from "@/components/ScreenSaver"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BEAM Institute",
  description: "Community-owned infrastructure and cooperative economics platform",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body className={`${inter.className} bg-[#181818]`} suppressHydrationWarning={true}>
        <main className="min-h-screen">
          {children}
          <ScreenSaver />
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
        </main>
      </body>
    </html>
  )
}
