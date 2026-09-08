import { useSelector } from '@tanstack/react-store'

import { recentSearchesStore } from '#/lib/recent-searches-store'

export function useRecentSearches() {
  const items = useSelector(recentSearchesStore, (state) => state)

  return {
    items,
    record: (query: string) => recentSearchesStore.actions.record(query),
    remove: (query: string) => recentSearchesStore.actions.remove(query),
    clear: () => recentSearchesStore.actions.clear(),
  }
}
