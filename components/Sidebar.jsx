"use client"
import { motion, AnimatePresence } from "framer-motion"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  Wallet,
  Copy,
  Check,
  LogOut,
} from "lucide-react"
import SettingsPopover from "./SettingsPopover"
import { cls } from "./utils"
import Image from "next/image"
import { useState } from "react"
import HourlyGiveaway from "./HourlyGiveaway"

export default function Sidebar({
  open,
  onClose,
  createNewChat,
  sidebarCollapsed = false,
  setSidebarCollapsed = () => {},
  walletAddress = null,
  onWalletChange = () => {},
}) {
  const [copiedWallet, setCopiedWallet] = useState(false)

  const handleCopyWallet = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress)
      setCopiedWallet(true)
      setTimeout(() => setCopiedWallet(false), 2000)
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      const { disconnectPhantomWallet } = await import("../lib/phantom-wallet")
      await disconnectPhantomWallet()
      onWalletChange(null)
    } catch (error) {
      console.error("[v0] Error disconnecting wallet:", error)
    }
  }

  const formatWalletAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (sidebarCollapsed) {
    return (
      <motion.aside
        initial={{ width: 240 }}
        animate={{ width: 56 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="z-50 flex h-full shrink-0 flex-col border-r border-white/[0.04] bg-[#07070a]"
      >
        <div className="flex items-center justify-center border-b border-white/[0.04] px-2 py-3">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="rounded-md p-2 hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 transition-all"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 pt-3">
          <button
            onClick={createNewChat}
            className="rounded-md p-2 bg-gradient-to-b from-cyan-500/10 to-transparent border border-cyan-500/20 text-cyan-400 hover:border-cyan-500/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 transition-all"
            title="New Chat"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto mb-3 flex flex-col items-center gap-2">
          <SettingsPopover walletAddress={walletAddress} onWalletChange={onWalletChange}>
            <button
              className="rounded-md p-2 hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 transition-all"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </SettingsPopover>
        </div>
      </motion.aside>
    )
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        key="sidebar"
        initial={false}
        animate={{
          x: typeof window !== "undefined" && window.innerWidth < 768 ? (open ? 0 : -260) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.15 }}
        className={cls(
          "z-50 flex h-full w-[240px] shrink-0 flex-col border-r border-white/[0.04] bg-[#07070a]",
          "fixed inset-y-0 left-0 md:static",
          !open && "md:flex hidden",
        )}
      >
        {/* Header */}
        <div className="px-3 py-3 border-b border-white/[0.04]">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-cyan-500/30 blur-md" />
                <div className="relative flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden border border-white/[0.1] bg-[#0a0a0c]">
                  <Image
                    src="/images/ghost-logo-3-eyes.png"
                    alt="Degenetics"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-white leading-tight">Degenetics</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider leading-tight">AI Assistant</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center">
              <SettingsPopover walletAddress={walletAddress} onWalletChange={onWalletChange}>
                <button
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-cyan-400 transition-all"
                  aria-label="Settings"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </SettingsPopover>

              <button
                onClick={() => setSidebarCollapsed(true)}
                className="hidden md:flex rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-cyan-400 transition-all"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="md:hidden rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-cyan-400 transition-all"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              createNewChat()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] shadow-lg shadow-cyan-500/25"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Contract Address Section */}
        <div className="px-3 pb-3">
          <div className="rounded-lg bg-black/40 border border-white/[0.06] p-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">$DGEN</span>
                <span className="text-[10px] font-mono text-zinc-400 truncate block">AANZSd...jpump</span>
              </div>
              <a
                href="https://pump.fun/coin/AANZSdeiUiZnaFfHMS5Xov5fP5F212Zg7dVVd29jpump"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-md bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wide transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
              >
                Buy
              </a>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer Section */}
        <div className="mt-auto border-t border-white/[0.04] px-3 py-3 space-y-3">
          {/* Hourly Giveaway */}
          <HourlyGiveaway />

          {/* Wallet Section */}
          {walletAddress && (
            <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/[0.03] p-3">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-3.5 w-3.5 text-cyan-500" />
                <span className="text-[10px] font-semibold text-cyan-500 uppercase tracking-wider">Connected</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 rounded-lg bg-black/40 px-2.5 py-2">
                  <span className="text-[11px] font-mono text-zinc-400">{formatWalletAddress(walletAddress)}</span>
                </div>
                <button
                  onClick={handleCopyWallet}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 hover:bg-black/60 text-zinc-500 hover:text-cyan-400 transition-all"
                  title="Copy address"
                >
                  {copiedWallet ? <Check className="h-3.5 w-3.5 text-cyan-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <button
                onClick={handleDisconnectWallet}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black/40 hover:bg-red-500/10 px-3 py-2 text-[10px] font-medium text-zinc-500 hover:text-red-400 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          )}

          {/* Sign Up Link */}
          <p className="text-[10px] text-center text-zinc-500">
            Don't have an account?{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Sign Up Now
            </a>
          </p>

          {/* Social Links with Animated Borders */}
          <div className="flex items-center gap-2">
            {/* X Link */}
            <a
              href="https://x.com/degeneticsGPT"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              aria-label="Follow us on X"
            >
              <div 
                className="absolute -inset-[1px] rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #06b6d4)',
                  backgroundSize: '300% 100%',
                  animation: 'gradientShift 3s ease infinite',
                }}
              />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a0a0c]">
                <svg
                  className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
            </a>

            {/* Solana Badge */}
            <div className="relative group flex-1">
              <div 
                className="absolute -inset-[1px] rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #06b6d4)',
                  backgroundSize: '300% 100%',
                  animation: 'gradientShift 3s ease infinite',
                }}
              />
              <div className="relative flex items-center justify-center rounded-lg bg-[#0a0a0c] px-3 py-2">
                <Image
                  src="/images/solana-logo-white-horizontal.png"
                  alt="Solana"
                  width={64}
                  height={18}
                  className="h-4 w-auto opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* CSS for gradient animation */}
          <style jsx>{`
            @keyframes gradientShift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `}</style>
        </div>
      </motion.aside>
    </>
  )
}
