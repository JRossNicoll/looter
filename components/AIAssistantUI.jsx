"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Sidebar from "./Sidebar"
import ChatPane from "./ChatPane"
import { INITIAL_TEMPLATES, INITIAL_FOLDERS } from "./mockData"
import { Menu } from "lucide-react"

export default function AIAssistantUI() {
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme")
    if (saved) return saved
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      return "dark"
    return "light"
  })

  useEffect(() => {
    try {
      if (theme === "dark") document.documentElement.classList.add("dark")
      else document.documentElement.classList.remove("dark")
      document.documentElement.setAttribute("data-theme", theme)
      document.documentElement.style.colorScheme = theme
      localStorage.setItem("theme", theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    try {
      const media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
      if (!media) return
      const listener = (e) => {
        const saved = localStorage.getItem("theme")
        if (!saved) setTheme(e.matches ? "dark" : "light")
      }
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    } catch {}
  }, [])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem("sidebar-collapsed")
      return raw ? JSON.parse(raw) : { pinned: true, recent: false, folders: true, templates: true }
    } catch {
      return { pinned: true, recent: false, folders: true, templates: true }
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
    } catch {}
  }, [collapsed])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebar-collapsed-state")
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed-state", JSON.stringify(sidebarCollapsed))
    } catch {}
  }, [sidebarCollapsed])

  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
  const [folders, setFolders] = useState(INITIAL_FOLDERS)
  const [walletAddress, setWalletAddress] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Always authenticated - no login required
  const [startPrompt, setStartPrompt] = useState(null)

  const [query, setQuery] = useState("")
  const searchRef = useRef(null)

  const [isThinking, setIsThinking] = useState(false)
  const [thinkingConvId, setThinkingConvId] = useState(null)

  const [isConnectingWallet, setIsConnectingWallet] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault()
        createNewChat()
      }
      if (!e.metaKey && !e.ctrlKey && e.key === "/") {
        const tag = document.activeElement?.tagName?.toLowerCase()
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault()
          searchRef.current?.focus()
        }
      }
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [sidebarOpen, conversations])

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const { getConnectedWallet } = await import("../lib/phantom-wallet")
        const connected = getConnectedWallet()
        if (connected) {
          setWalletAddress(connected)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("[v0] Error checking wallet connection:", error)
      }
    }
    checkWalletConnection()
  }, [])

  useEffect(() => {
    if (startPrompt && selectedId) {
      sendMessage(selectedId, startPrompt)
      setStartPrompt(null)
    }
  }, [startPrompt, selectedId])

  // Auto-create a new chat on mount if none exists
  useEffect(() => {
    if (conversations.length === 0 && !selectedId) {
      createNewChat()
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations
    const q = query.toLowerCase()
    return conversations.filter((c) => c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q))
  }, [conversations, query])

  const pinned = filtered.filter((c) => c.pinned).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

  const recent = filtered
    .filter((c) => !c.pinned)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 10)

  const folderCounts = React.useMemo(() => {
    const map = Object.fromEntries(folders.map((f) => [f.name, 0]))
    for (const c of conversations) if (map[c.folder] != null) map[c.folder] += 1
    return map
  }, [conversations, folders])

  function togglePin(id) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)))
  }

  function createNewChat() {
    const id = Math.random().toString(36).slice(2)
    const item = {
      id,
      title: "New Chat",
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      preview: "Say hello to start...",
      pinned: false,
      folder: null,
      messages: [], // Empty messages array for brand new chat
    }
    setConversations((prev) => [item, ...prev])
    setSelectedId(id)
    setSidebarOpen(false)
  }

  function createFolder() {
    const name = prompt("Folder name")
    if (!name) return
    if (folders.some((f) => f.name.toLowerCase() === name.toLowerCase())) return alert("Folder already exists.")
    setFolders((prev) => [...prev, { id: Math.random().toString(36).slice(2), name }])
  }

  async function sendMessage(convId, content) {
    if (!content.trim()) return
    const now = new Date().toISOString()
    const userMsg = { id: Math.random().toString(36).slice(2), role: "user", content, createdAt: now }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = [...(c.messages || []), userMsg]
        const isFirstMessage = msgs.length === 1
        const newTitle = isFirstMessage ? content.slice(0, 50) + (content.length > 50 ? "..." : "") : c.title
        return {
          ...c,
          title: newTitle,
          messages: msgs,
          updatedAt: now,
          messageCount: msgs.length,
          preview: content.slice(0, 80),
        }
      }),
    )

    setIsThinking(true)
    setThinkingConvId(convId)

    try {
      const conv = conversations.find((c) => c.id === convId)
      const allMessages = [...(conv?.messages || []), userMsg]

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ""
      const assistantMsgId = Math.random().toString(36).slice(2)

      setIsThinking(false)
      setThinkingConvId(null)

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c
          const asstMsg = {
            id: assistantMsgId,
            role: "assistant",
            content: "",
            createdAt: new Date().toISOString(),
          }
          const msgs = [...(c.messages || []), asstMsg]
          return {
            ...c,
            messages: msgs,
            updatedAt: new Date().toISOString(),
            messageCount: msgs.length,
          }
        }),
      )

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          aiResponse += chunk

          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== convId) return c
              const msgs = (c.messages || []).map((m) => (m.id === assistantMsgId ? { ...m, content: aiResponse } : m))
              return {
                ...c,
                messages: msgs,
                preview: aiResponse.slice(0, 80),
                updatedAt: new Date().toISOString(),
              }
            }),
          )
        }
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      setIsThinking(false)
      setThinkingConvId(null)

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c
          const errorMsg = {
            id: Math.random().toString(36).slice(2),
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            createdAt: new Date().toISOString(),
          }
          const msgs = [...(c.messages || []), errorMsg]
          return {
            ...c,
            messages: msgs,
            updatedAt: new Date().toISOString(),
            messageCount: msgs.length,
          }
        }),
      )
    }
  }

  function editMessage(convId, messageId, newContent) {
    const now = new Date().toISOString()
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = (c.messages || []).map((m) =>
          m.id === messageId ? { ...m, content: newContent, editedAt: now } : m,
        )
        return {
          ...c,
          messages: msgs,
          preview: msgs[msgs.length - 1]?.content?.slice(0, 80) || c.preview,
        }
      }),
    )
  }

  function resendMessage(convId, messageId) {
    const conv = conversations.find((c) => c.id === convId)
    const msg = conv?.messages?.find((m) => m.id === messageId)
    if (!msg) return
    sendMessage(convId, msg.content)
  }

  function pauseThinking() {
    setIsThinking(false)
    setThinkingConvId(null)
  }

  function handleUseTemplate(template) {
    // This will be passed down to the Composer component
    // The Composer will handle inserting the template content
    if (composerRef.current) {
      composerRef.current.insertTemplate(template.content)
    }
  }

  const composerRef = useRef(null)

  const selected = conversations.find((c) => c.id === selectedId) || null

  const handleDirectWalletConnect = async () => {
    setIsConnectingWallet(true)
    try {
      const { connectPhantomWallet } = await import("../lib/phantom-wallet")
      const address = await connectPhantomWallet()
      if (address) {
        setWalletAddress(address)
        // Automatically create a new chat after successful connection
        createNewChat()
      }
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
      alert("Failed to connect wallet. Please make sure Phantom is installed.")
    } finally {
      setIsConnectingWallet(false)
    }
  }

  const handleLoginSuccess = (address) => {
    setWalletAddress(address)
    setIsAuthenticated(true)
    // Automatically create a new chat after login
    setTimeout(() => {
      createNewChat()
    }, 300)
  }

  const handleStartPrompt = (prompt) => {
    setStartPrompt(prompt)
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#050506]">
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.01]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500 to-transparent h-[1px] animate-[scanline_10s_linear_infinite]" />
      </div>

      <div className="h-full w-full bg-[#050506] text-foreground relative z-10">
        <div className="flex h-full w-full">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            theme={theme}
            setTheme={setTheme}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            conversations={conversations}
            pinned={pinned}
            recent={recent}
            folders={folders}
            folderCounts={folderCounts}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
            togglePin={togglePin}
            query={query}
            setQuery={setQuery}
            searchRef={searchRef}
            createFolder={createFolder}
            createNewChat={createNewChat}
            templates={templates}
            setTemplates={setTemplates}
            onUseTemplate={handleUseTemplate}
            walletAddress={walletAddress}
            onWalletChange={(address) => {
              setWalletAddress(address)
              if (!address) {
                setIsAuthenticated(false)
              }
            }}
            onStartPrompt={handleStartPrompt}
          />

          <main className="relative flex min-w-0 flex-1 flex-col bg-[#050506]">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            <ChatPane
              ref={composerRef}
              conversation={selected}
              onSend={(content) => selected && sendMessage(selected.id, content)}
              onEditMessage={(messageId, newContent) => selected && editMessage(selected.id, messageId, newContent)}
              onResendMessage={(messageId) => selected && resendMessage(selected.id, messageId)}
              isThinking={isThinking && thinkingConvId === selected?.id}
              onPauseThinking={pauseThinking}
            />
          </main>
        </div>
      </div>
    </div>
  )
}
