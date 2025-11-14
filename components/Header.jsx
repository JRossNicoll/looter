"use client"
import { Menu, Settings } from 'lucide-react'
import Image from "next/image"

export default function Header({ createNewChat, sidebarCollapsed, setSidebarOpen, theme, setTheme }) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black px-6 py-3">
      {/* Left: Sidebar toggle (mobile only) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9333EA] min-w-[40px] min-h-[40px] touch-manipulation active:scale-95"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Center: Logo and Navigation */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-[#9333EA] p-1">
            <Image
              src="/images/ghost-logo-purple.png"
              alt="LOOTCHAT"
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-sm font-bold tracking-wider text-white uppercase">LOOTCHAT</div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Features
          </a>
          <a href="#pricing" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Pricing
          </a>
          <a href="#testimonials" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Testimonials
          </a>
          <a href="#faq" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            FAQ
          </a>
        </nav>
      </div>

      {/* Right: Settings icon */}
      <div className="flex items-center gap-3">
        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 transition-colors hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9333EA] min-w-[40px] min-h-[40px]"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
