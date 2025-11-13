"use client"
import { useState, useRef } from "react"
import { Paperclip, Bot, Search, Palette, BookOpen, MoreHorizontal, Globe, ChevronRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export default function ComposerActionsPopover({ children, onFileSelect, onModeChange }) {
  const [open, setOpen] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const fileInputRef = useRef(null)

  const mainActions = [
    {
      icon: Paperclip,
      label: "Add photos & files",
      action: () => {
        fileInputRef.current?.click()
      },
    },
    {
      icon: Bot,
      label: "Agent mode",
      badge: "NEW",
      action: () => {
        onModeChange?.("agent")
        alert("Agent Mode activated! I'll now operate with enhanced autonomy and proactive assistance.")
      },
    },
    {
      icon: Search,
      label: "Deep research",
      action: () => {
        onModeChange?.("research")
        alert("Deep Research Mode activated! I'll provide comprehensive, well-researched responses with citations.")
      },
    },
    {
      icon: Palette,
      label: "Create image",
      action: () => {
        onModeChange?.("image")
        alert("Image Creation Mode activated! Describe the image you want to generate.")
      },
    },
    {
      icon: BookOpen,
      label: "Study and learn",
      action: () => {
        onModeChange?.("study")
        alert("Study Mode activated! I'll break down complex topics into digestible lessons.")
      },
    },
  ]

  const moreActions = [
    {
      icon: Globe,
      label: "Web search",
      action: () => {
        onModeChange?.("web")
        alert("Web Search Mode activated! I'll search the web for real-time information.")
      },
    },
    {
      icon: Palette,
      label: "Canvas",
      action: () => {
        alert("Canvas feature coming soon! Create and edit visual content collaboratively.")
      },
    },
    {
      icon: () => (
        <div className="h-4 w-4 rounded bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full" />
        </div>
      ),
      label: "Connect Google Drive",
      action: () => {
        alert("Google Drive integration coming soon!")
      },
    },
    {
      icon: () => (
        <div className="h-4 w-4 rounded bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full" />
        </div>
      ),
      label: "Connect OneDrive",
      action: () => {
        alert("OneDrive integration coming soon!")
      },
    },
    {
      icon: () => (
        <div className="h-4 w-4 rounded bg-gradient-to-br from-teal-500 to-teal-400 flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full" />
        </div>
      ),
      label: "Connect Sharepoint",
      action: () => {
        alert("Sharepoint integration coming soon!")
      },
    },
  ]

  const handleAction = (action) => {
    action()
    setOpen(false)
    setShowMore(false)
  }

  const handleMoreClick = () => {
    setShowMore(true)
  }

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    if (!newOpen) {
      setShowMore(false)
    }
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect?.(Array.from(files))
      setOpen(false)
      setShowMore(false)
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start" side="top">
          {!showMore ? (
            // Main actions view
            <div className="p-3">
              <div className="space-y-1">
                {mainActions.map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleAction(action.action)}
                      className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-900/50 rounded-lg transition-colors"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{action.label}</span>
                      {action.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                          {action.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
                <button
                  onClick={handleMoreClick}
                  className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span>More</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              </div>
            </div>
          ) : (
            // More options view with two columns
            <div className="flex">
              <div className="flex-1 p-3 border-r border-zinc-200 dark:border-zinc-800">
                <div className="space-y-1">
                  {mainActions.map((action, index) => {
                    const IconComponent = action.icon
                    return (
                      <button
                        key={index}
                        onClick={() => handleAction(action.action)}
                        className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-900/50 rounded-lg transition-colors"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{action.label}</span>
                        {action.badge && (
                          <span className="ml-auto px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                            {action.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                  <button
                    onClick={handleMoreClick}
                    className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span>More</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-3">
                <div className="space-y-1">
                  {moreActions.map((action, index) => {
                    const IconComponent = action.icon
                    return (
                      <button
                        key={index}
                        onClick={() => handleAction(action.action)}
                        className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-900/50 rounded-lg transition-colors"
                      >
                        {typeof IconComponent === "function" ? (
                          <IconComponent />
                        ) : (
                          <IconComponent className="h-4 w-4" />
                        )}
                        <span>{action.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  )
}
