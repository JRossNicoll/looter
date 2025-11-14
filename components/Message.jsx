"use client"

import { cls } from "./utils"
import Image from "next/image"
import { Copy, RefreshCw, Share2, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react'
import { useState, useEffect } from "react"

export default function Message({ role, children, timestamp, responseTime, onRegenerate }) {
  const isUser = role === "user"
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(null) // null, 'up', or 'down'
  const [showMore, setShowMore] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleCopy = () => {
    const text = typeof children === "string" ? children : children?.props?.children
    if (text) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRegenerate = () => {
    onRegenerate?.()
  }

  const handleShare = async () => {
    const text = typeof children === "string" ? children : children?.props?.children
    if (text && navigator.share) {
      try {
        await navigator.share({
          title: "LOOTER Chat",
          text: text,
        })
      } catch (err) {
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  const handleLike = () => {
    setLiked(liked === "up" ? null : "up")
  }

  const handleDislike = () => {
    setLiked(liked === "down" ? null : "down")
  }

  return (
    <div className={cls("group", isVisible && "message-enter")}>
      {isUser && (
        <div className="mb-2 flex justify-end">
          <div className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">User</div>
        </div>
      )}

      <div className={cls("flex gap-3", isUser ? "justify-end" : "justify-start")}>
        {!isUser && (
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9333EA]/20 to-[#9333EA]/5 overflow-hidden">
            <Image
              src="/images/ghost-logo-purple.png"
              alt="LOOTCHAT"
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </div>
        )}
        <div className={cls("max-w-[85%] space-y-2", isUser && "text-right")}>
          <div
            className={cls(
              "inline-block rounded-2xl px-4 py-3 text-sm leading-6 font-normal",
              isUser ? "bg-zinc-800 text-white" : "text-white",
            )}
          >
            {children}
          </div>

          {!isUser && (
            <div className={cls("flex items-center gap-1 text-zinc-500", isVisible && "message-actions-enter")}>
              <button
                onClick={handleRegenerate}
                className="rounded p-1.5 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                title="Regenerate response"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={handleCopy}
                className="rounded p-1.5 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                title={copied ? "Copied!" : "Copy message"}
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={handleShare}
                className="rounded p-1.5 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                title="Share message"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleLike}
                className={cls(
                  "rounded p-1.5 hover:bg-zinc-800 transition-colors",
                  liked === "up" ? "text-[#9333EA]" : "hover:text-zinc-300",
                )}
                title="Helpful"
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button
                onClick={handleDislike}
                className={cls(
                  "rounded p-1.5 hover:bg-zinc-800 transition-colors",
                  liked === "down" ? "text-red-500" : "hover:text-zinc-300",
                )}
                title="Not helpful"
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="rounded p-1.5 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                  title="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {showMore && (
                  <div className="absolute left-0 top-full mt-1 rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-xl z-10 min-w-[120px]">
                    <button className="w-full px-3 py-1.5 text-left text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300">
                      Report
                    </button>
                    <button className="w-full px-3 py-1.5 text-left text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300">
                      Edit
                    </button>
                  </div>
                )}
              </div>
              {responseTime && <span className="ml-1 text-xs text-zinc-600">{responseTime}</span>}
              <span className="text-xs text-zinc-600">Fast</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
