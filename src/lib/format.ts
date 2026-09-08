/** Formats an ISO timestamp as a short relative time, e.g. "Just now", "5m ago", "3d ago". */
export function formatRelativeTime(isoTimestamp: string): string {
  const then = new Date(isoTimestamp).getTime()
  if (Number.isNaN(then)) return ''

  const diffSeconds = Math.max(0, Math.round((Date.now() - then) / 1000))
  if (diffSeconds < 60) return 'Just now'

  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.round(diffHours / 24)
  return `${diffDays}d ago`
}

/** Formats a runtime in minutes as e.g. "2h 15m". */
export function formatRuntime(minutes: number | null): string | null {
  if (!minutes || minutes <= 0) return null
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours === 0) return `${remainingMinutes}m`
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}
