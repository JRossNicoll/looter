"use client"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronRight } from "lucide-react"

export default function SidebarSection({ icon, title, children, collapsed, onToggle }) {
  return (
    <section>
      <button
        onClick={onToggle}
        className="mb-1 flex w-full items-center gap-2 px-2 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={!collapsed}
      >
        <span className="mr-0.5" aria-hidden>
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </span>
        <span className="flex items-center gap-2">
          <span className="opacity-60" aria-hidden>
            {icon}
          </span>
          {title}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-0.5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
