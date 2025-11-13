"use client"

import { useRef, useState, forwardRef, useImperativeHandle } from "react"
import { Paperclip, Mic, ArrowUp } from "lucide-react"
import { cls } from "./utils"

const Composer = forwardRef(function Composer({ onSend, busy, hasMessages }, ref) {
  const [value, setValue] = useState("")
  const [sending, setSending] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        setValue((prev) => {
          const newValue = prev ? `${prev}\n\n${templateContent}` : templateContent
          inputRef.current?.focus()
          const length = newValue.length
          inputRef.current?.setSelectionRange(length, length)
          return newValue
        })
      },
      focus: () => {
        inputRef.current?.focus()
      },
    }),
    [],
  )

  async function handleSend() {
    if (!value.trim() || sending) return
    const messageToSend = value.trim()
    setValue("")
    setSending(true)
    try {
      await onSend?.(messageToSend)
      inputRef.current?.focus()
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="border-t border-zinc-800/50 bg-[#0f0f0f] px-3 py-4 md:px-4 md:py-6">
      <div className="mx-auto max-w-4xl">
        <div
          className={cls(
            "flex items-center gap-2 md:gap-3 rounded-3xl border bg-[#1a1a1a] px-3 py-2.5 md:px-4 md:py-3 transition-all",
            isFocused ? "border-zinc-700 shadow-lg shadow-zinc-900/50" : "border-zinc-800",
          )}
        >
          <button
            className="inline-flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0"
            title="Add attachment"
          >
            <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={hasMessages ? "Ask a follow-up..." : "What do you want to know?"}
            className="flex-1 bg-transparent text-sm md:text-[15px] text-white outline-none placeholder:text-zinc-500 min-w-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />

          {/* Right side controls */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            {/* Auto dropdown - hidden on mobile */}
            <button className="hidden md:inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Auto
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Send button (when text is present) or Microphone button */}
            {value.trim() ? (
              <button
                onClick={handleSend}
                disabled={sending}
                className="inline-flex items-center justify-center rounded-full bg-[#F3BA2F] p-2 md:p-2.5 text-black hover:bg-[#F3BA2F]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send message"
              >
                <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            ) : (
              <button
                className="inline-flex items-center justify-center rounded-full bg-white p-2 md:p-2.5 text-black hover:bg-zinc-200 transition-colors"
                title="Voice input"
              >
                <Mic className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default Composer
