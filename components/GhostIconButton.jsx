export default function GhostIconButton({ label, children }) {
  return (
    <button
      className="hidden rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}
