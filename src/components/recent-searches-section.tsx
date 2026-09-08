import { X } from 'lucide-react'

import { EmptyState } from '#/components/empty-state'
import { Button } from '#/components/ui/button'
import { useRecentSearches } from '#/hooks/use-recent-searches'
import { formatRelativeTime } from '#/lib/format'

export interface RecentSearchesSectionProps {
  onSelectQuery: (query: string) => void
}

export function RecentSearchesSection({
  onSelectQuery,
}: RecentSearchesSectionProps) {
  const { items, remove, clear } = useRecentSearches()

  if (items.length === 0) {
    return <EmptyState message="Your recent searches will show up here." />
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Click a search to run it again.
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={clear}>
          Clear all
        </Button>
      </div>

      <ul className="feature-card divide-y divide-border rounded-lg border">
        {items.map((item) => (
          <li key={item.query} className="flex items-center gap-2 px-4 py-3">
            <button
              type="button"
              className="flex-1 truncate text-left text-sm hover:underline"
              onClick={() => onSelectQuery(item.query)}
            >
              {item.query}
            </button>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatRelativeTime(item.searchedAt)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove "${item.query}" from recent searches`}
              onClick={() => remove(item.query)}
            >
              <X className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
