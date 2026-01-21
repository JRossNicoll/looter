import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { LanguageProvider } from "../lib/language-context"
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Degenetics - AI-Powered Crypto Intelligence",
  description: "The most powerful AI platform for cryptocurrency analysis and trading insights",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/images/ghost-logo-3-eyes.png", sizes: "any" },
      { url: "/images/ghost-logo-3-eyes.png", sizes: "192x192", type: "image/png" },
      { url: "/images/ghost-logo-3-eyes.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/images/ghost-logo-3-eyes.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <LanguageProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
