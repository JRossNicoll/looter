"use client"
import { motion, AnimatePresence } from "framer-motion"
import { PanelLeftClose, PanelLeftOpen, Plus, Settings, MessageSquare, TrendingUp, Shield, Zap, ChevronDown, Wallet, Copy, Check, LogOut } from 'lucide-react'
import SettingsPopover from "./SettingsPopover"
import { cls } from "./utils"
import Image from "next/image"
import { useState } from "react"
import HourlyGiveaway from "./HourlyGiveaway"

const SAMPLE_PROMPTS = [
  {
    category: "DeFi Analysis",
    icon: TrendingUp,
    prompts: ["Analyze top Solana tokens by volume", "Find new memecoin opportunities", "Compare DeFi protocols on Solana"],
  },
  {
    category: "Smart Contracts",
    icon: Shield,
    prompts: ["Explain this contract address", "Check token contract security", "Analyze liquidity pools"],
  },
  {
    category: "Market Intelligence",
    icon: Zap,
    prompts: ["Latest Solana market trends", "Whale wallet movements", "Token holder distribution"],
  },
]

export default function Sidebar({
  open,
  onClose,
  theme,
  setTheme,
  createNewChat,
  sidebarCollapsed = false,
  setSidebarCollapsed = () => {},
  walletAddress = null,
  onWalletChange = () => {},
  conversations = [],
  selectedId = null,
  onSelect = () => {},
  onStartPrompt = () => {},
}) {
  const [expandedCategories, setExpandedCategories] = useState({
    "DeFi Analysis": true,
    "Smart Contracts": true,
    "Market Intelligence": true,
  })

  const [copiedWallet, setCopiedWallet] = useState(false)

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

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
        className="z-50 flex h-full shrink-0 flex-col border-r border-white/5 bg-[#0f0f0f]"
      >
        <div className="flex items-center justify-center border-b border-white/5 px-2 py-3">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="rounded-lg p-2 hover:bg-white/5 text-zinc-400 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F3BA2F] transition-colors"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            onClick={createNewChat}
            className="rounded-lg p-2 hover:bg-[#F3BA2F]/10 text-[#F3BA2F]/70 hover:text-[#F3BA2F] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F3BA2F] transition-colors"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-auto mb-4 flex flex-col items-center gap-2">
          <SettingsPopover walletAddress={walletAddress} onWalletChange={onWalletChange}>
            <button
              className="rounded-lg p-2 hover:bg-white/5 text-zinc-400 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F3BA2F] transition-colors"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
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
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/80 md:hidden"
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
          "z-50 flex h-full w-60 shrink-0 flex-col border-r border-white/5 bg-[#0f0f0f]",
          "fixed inset-y-0 left-0 md:static",
          !open && "md:flex hidden",
        )}
      >
        <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3BA2F] overflow-hidden">
              <Image
                src="/images/ghost-logo.jpg"
                alt="LOOTER"
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-sm font-semibold text-white">LOOTER</div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <SettingsPopover walletAddress={walletAddress} onWalletChange={onWalletChange}>
              <button
                className="rounded-lg p-1 text-zinc-400 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F3BA2F] transition-colors"
                aria-label="Settings"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </SettingsPopover>

            <button
              onClick={() => setSidebarCollapsed(true)}
              className="hidden md:block rounded-lg p-1 text-zinc-400 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F3BA2F] transition-colors"
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
              className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F3BA2F] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              createNewChat()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F3BA2F] px-3 py-1.5 text-xs font-medium text-black transition-all hover:bg-[#F3BA2F]/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3BA2F]"
          >
            <Plus className="h-3.5 w-3.5" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {/* Recent Conversations */}
          {conversations.length > 0 && (
            <div className="mb-4">
              <div className="px-2 py-1 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Recent</div>
              <div className="space-y-0.5">
                {conversations.slice(0, 5).map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className={cls(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                      selectedId === conv.id
                        ? "bg-[#F3BA2F]/10 text-[#F3BA2F]"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{conv.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {SAMPLE_PROMPTS.map((category) => (
              <div key={category.category}>
                {/* Category Header - Clickable to expand/collapse */}
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="flex w-full items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <category.icon className="h-3.5 w-3.5 text-[#F3BA2F]" />
                  <div className="text-xs font-semibold text-[#F3BA2F] tracking-wide">{category.category}</div>
                  <ChevronDown
                    className={cls(
                      "h-3.5 w-3.5 ml-auto text-[#F3BA2F] transition-transform duration-200",
                      expandedCategories[category.category] ? "rotate-180" : "",
                    )}
                  />
                </button>

                {/* Collapsible Prompts */}
                <AnimatePresence initial={false}>
                  {expandedCategories[category.category] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pt-1">
                        {category.prompts.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              createNewChat()
                              setTimeout(() => {
                                onStartPrompt?.(prompt)
                              }, 100)
                            }}
                            className="flex w-full items-start rounded-lg px-2 py-1.5 text-left text-xs text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <span className="line-clamp-2">{prompt}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-white/5 px-2 py-2">
          {/* Hourly Giveaway */}
          <HourlyGiveaway />

          {walletAddress && (
            <div className="mb-1.5 md:mb-2 rounded-lg border border-[#F3BA2F]/20 bg-[#F3BA2F]/5 p-2.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F3BA2F]/20">
                  <Wallet className="h-3 w-3 text-[#F3BA2F]" />
                </div>
                <div className="text-[10px] font-semibold text-[#F3BA2F] uppercase tracking-wider">
                  Wallet Connected
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex-1 rounded-md bg-black/30 px-2 py-1.5">
                  <div className="text-xs font-semibold text-white/90">Connected</div>
                </div>
                <button
                  onClick={handleCopyWallet}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-black/30 hover:bg-black/50 text-zinc-400 hover:text-[#F3BA2F] transition-colors"
                  title="Copy address"
                >
                  {copiedWallet ? <Check className="h-3 w-3 text-[#F3BA2F]" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>

              <button
                onClick={handleDisconnectWallet}
                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-black/30 hover:bg-red-500/10 px-2 py-1.5 text-[10px] font-medium text-zinc-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-3 w-3" />
                Disconnect
              </button>
            </div>
          )}

          {/* Responsive Text */}
          <div className="text-[10px] md:text-xs text-center text-zinc-500 mb-1.5 md:mb-2">
            Don't have an account?{" "}
            <a href="#" className="text-[#F3BA2F] hover:underline font-medium">
              Sign Up Now
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-1 md:gap-1.5">
            <a
              href="https://x.com/LooterGPT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#F3BA2F]/40 transition-all group"
              aria-label="Follow us on X"
            >
              <svg
                className="w-3.5 h-3.5 text-white group-hover:text-[#F3BA2F] transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://t.me/LooterGPT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#F3BA2F]/40 transition-all group"
              aria-label="Join us on Telegram"
            >
              <svg
                className="w-3.5 h-3.5 text-white group-hover:text-[#F3BA2F] transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-5.062 3.345-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.093.036.306.02.472z" />
              </svg>
            </a>

            <div className="flex flex-1 items-center justify-center rounded-lg bg-white/5 border border-white/10 px-1 py-0">
              <Image
                src="/images/solana-logo.svg"
                alt="Solana"
                width={100}
                height={40}
                className="h-9 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
