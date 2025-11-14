"use client"

import { useState, forwardRef, useImperativeHandle, useRef } from "react"
import { RefreshCw, Check, X } from 'lucide-react'
import Message from "./Message"
import Composer from "./Composer"
import Image from "next/image"

function ThinkingMessage({ onPause }) {
  return (
    <div className="flex gap-3 message-enter">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden">
        <Image
          src="/images/ghost-logo-3-eyes.png"
          alt="LOOTCHAT"
          width={32}
          height={32}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-zinc-500 typing-dot"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-500 typing-dot"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-500 typing-dot"></div>
        </div>
      </div>
    </div>
  )
}

const ChatPane = forwardRef(function ChatPane(
  { conversation, onSend, onEditMessage, onResendMessage, isThinking, onPauseThinking },
  ref,
) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")
  const [busy, setBusy] = useState(false)
  const [thinkHarder, setThinkHarder] = useState(false)
  const composerRef = useRef(null)

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        composerRef.current?.insertTemplate(templateContent)
      },
    }),
    [],
  )

  if (!conversation) return null

  const messages = Array.isArray(conversation.messages) ? conversation.messages : []
  const count = messages.length || conversation.messageCount || 0

  function startEdit(m) {
    setEditingId(m.id)
    setDraft(m.content)
  }
  function cancelEdit() {
    setEditingId(null)
    setDraft("")
  }
  function saveEdit() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    cancelEdit()
  }
  function saveAndResend() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    onResendMessage?.(editingId)
    cancelEdit()
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-6 md:px-6">
            {/* Logo section - centered */}
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-full overflow-hidden">
                <Image
                  src="/images/ghost-logo-3-eyes.png"
                  alt="LOOTCHAT"
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white">LOOTCHAT</h1>
            </div>

            <div className="mb-4 md:mb-6 w-full max-w-md md:max-w-2xl">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 pb-3 border-b border-zinc-800">
                <button className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 px-3 md:px-5 h-11 text-xs md:text-sm text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 transition-all flex-shrink-0">
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">DeepSearch</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 px-3 md:px-5 h-11 text-xs md:text-sm text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 transition-all flex-shrink-0">
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="whitespace-nowrap">Solana Analysis</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 px-3 md:px-5 h-11 text-xs md:text-sm text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 transition-all flex-shrink-0">
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Market Trends</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 px-3 md:px-5 h-11 text-xs md:text-sm text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 transition-all flex-shrink-0">
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Personas</span>
                </button>
              </div>
            </div>

            {/* Terms text - centered at bottom with proper mobile spacing */}
            <p className="text-[10px] md:text-xs text-zinc-600 text-center px-4 max-w-md">
              By messaging LOOTCHAT, you agree to our{" "}
              <a href="#" className="text-zinc-500 hover:text-zinc-400 underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-zinc-500 hover:text-zinc-400 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
            {messages.map((m) => (
              <div key={m.id}>
                {editingId === m.id ? (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full resize-y rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-sm text-zinc-300 outline-none focus:border-zinc-700 min-h-[100px]"
                      rows={3}
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" /> Save
                      </button>
                      <button
                        onClick={saveAndResend}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-900 transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Resend
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <Message
                    role={m.role}
                    timestamp={m.createdAt}
                    responseTime={m.responseTime}
                    onRegenerate={() => onResendMessage?.(m.id)}
                  >
                    <div className="whitespace-pre-wrap break-words">{m.content}</div>
                  </Message>
                )}
              </div>
            ))}
            {isThinking && <ThinkingMessage onPause={onPauseThinking} />}
          </div>
        )}
      </div>

      {/* Think Harder badge above composer when active */}
      {thinkHarder && messages.length > 0 && (
        <div className="flex justify-center pb-2">
          <button
            onClick={() => setThinkHarder(false)}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Think Harder
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Composer at bottom */}
      <Composer
        ref={composerRef}
        onSend={async (text) => {
          if (!text.trim()) return
          setBusy(true)
          await onSend?.(text)
          setBusy(false)
        }}
        busy={busy}
        hasMessages={messages.length > 0}
        thinkHarder={thinkHarder}
        onThinkHarderToggle={() => setThinkHarder(!thinkHarder)}
      />
    </div>
  )
})

export default ChatPane
