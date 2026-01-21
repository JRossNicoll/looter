"use client"
import { motion, AnimatePresence } from "framer-motion"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  MessageSquare,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
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

const SAMPLE_PROMPTS = [
  {
    category: "DeFi Analysis",
    icon: TrendingUp,
    prompts: [
      "Analyze top Solana tokens by volume",
      "Find new memecoin opportunities",
      "Compare DeFi protocols on Solana",
    ],
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
    "Smart Contracts": false,
    "Market Intelligence": false,
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
        <div className="flex items-center gap-2.5 border-b border-white/[0.04] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-0.5">
              <Image
                src="/images/ghost-logo-3-eyes.png"
                alt="Degenetics"
                width={28}
                height={28}
                className="h-full w-full object-cover rounded-md"
              />
            </div>
            <span className="text-[13px] font-semibold text-white tracking-tight">Degenetics</span>
          </div>
          <div className="ml-auto flex items-center gap-0.5">
            <SettingsPopover walletAddress={walletAddress} onWalletChange={onWalletChange}>
              <button
                className="rounded-md p-1.5 text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 transition-all"
                aria-label="Settings"
                title="Settings"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
            </SettingsPopover>

            <button
              onClick={() => setSidebarCollapsed(true)}
              className="hidden md:block rounded-md p-1.5 text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 transition-all"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="md:hidden rounded-md p-2 text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-2.5 pt-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation()
              createNewChat()
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-[12px] font-medium text-white transition-all hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 shadow-lg shadow-cyan-500/10"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {/* Recent Conversations */}
          {conversations.length > 0 && (
            <div className="mb-4">
              <div className="px-1.5 py-1 text-[10px] font-medium text-zinc-600 uppercase tracking-widest">Recent</div>
              <div className="space-y-0.5 mt-1">
                {conversations.slice(0, 5).map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className={cls(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] transition-all",
                      selectedId === conv.id
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300 border border-transparent",
                    )}
                  >
                    <MessageSquare className="h-3 w-3 shrink-0" />
                    <span className="truncate">{conv.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prompt Categories */}
          <div className="space-y-1">
            {SAMPLE_PROMPTS.map((category) => (
              <div key={category.category}>
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="flex w-full items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-white/[0.03] transition-all group"
                >
                  <category.icon className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="text-[12px] font-medium text-zinc-300 tracking-tight">{category.category}</span>
                  <ChevronRight
                    className={cls(
                      "h-3 w-3 ml-auto text-zinc-600 transition-transform duration-200",
                      expandedCategories[category.category] ? "rotate-90" : "",
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {expandedCategories[category.category] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pt-1 pl-5">
                        {category.prompts.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              createNewChat()
                              setTimeout(() => {
                                onStartPrompt?.(prompt)
                              }, 100)
                            }}
                            className="flex w-full items-start rounded-md px-2 py-1.5 text-left text-[11px] text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300 transition-all leading-relaxed"
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

        {/* Footer Section */}
        <div className="mt-auto border-t border-white/[0.04] px-2.5 py-2.5 space-y-2">
          {/* Hourly Giveaway */}
          <HourlyGiveaway />

          {/* Wallet Section */}
          {walletAddress && (
            <div className="rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03] p-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <Wallet className="h-3 w-3 text-cyan-500" />
                <span className="text-[10px] font-medium text-cyan-500 uppercase tracking-wider">Connected</span>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex-1 rounded-md bg-black/40 px-2 py-1.5">
                  <span className="text-[11px] font-mono text-zinc-400">{formatWalletAddress(walletAddress)}</span>
                </div>
                <button
                  onClick={handleCopyWallet}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-black/40 hover:bg-black/60 text-zinc-500 hover:text-cyan-400 transition-all"
                  title="Copy address"
                >
                  {copiedWallet ? <Check className="h-3 w-3 text-cyan-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>

              <button
                onClick={handleDisconnectWallet}
                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-black/40 hover:bg-red-500/10 px-2 py-1.5 text-[10px] font-medium text-zinc-500 hover:text-red-400 transition-all"
              >
                <LogOut className="h-3 w-3" />
                <span>Disconnect</span>
              </button>
            </div>
          )}

          {/* Sign Up Link */}
          <p className="text-[10px] text-center text-zinc-600">
            Don't have an account?{" "}
            <a href="#" className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors">
              Sign Up Now
            </a>
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-1.5">
            <a
              href="https://x.com/DegenLLM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-cyan-500/20 transition-all group"
              aria-label="Follow us on X"
            >
              <svg
                className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <div className="flex flex-1 items-center justify-center rounded-md bg-white/[0.02] border border-white/[0.04] px-2 py-1.5">
              <Image
                src="/images/solana-logo-white-horizontal.png"
                alt="Solana"
                width={56}
                height={16}
                className="h-3.5 w-auto opacity-60"
              />
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
