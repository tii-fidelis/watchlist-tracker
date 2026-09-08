import { createStore } from '@tanstack/react-store'

import { readLocalStorage, writeLocalStorage } from './storage'

export interface RecentSearch {
  query: string
  searchedAt: string
}

const STORAGE_KEY = 'watchlist-tracker:recent-searches'
const MAX_ENTRIES = 10

export const recentSearchesStore = createStore(
  readLocalStorage<Array<RecentSearch>>(STORAGE_KEY, []),
  ({ setState }) => ({
    record: (query: string) =>
      setState((items) => {
        const trimmed = query.trim()
        if (!trimmed) return items
        const withoutDuplicate = items.filter(
          (item) => item.query.toLowerCase() !== trimmed.toLowerCase(),
        )
        return [
          { query: trimmed, searchedAt: new Date().toISOString() },
          ...withoutDuplicate,
        ].slice(0, MAX_ENTRIES)
      }),
    remove: (query: string) =>
      setState((items) => items.filter((item) => item.query !== query)),
    clear: () => setState(() => []),
  }),
)

recentSearchesStore.subscribe(() =>
  writeLocalStorage(STORAGE_KEY, recentSearchesStore.state),
)

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      recentSearchesStore.setState(() =>
        readLocalStorage<Array<RecentSearch>>(STORAGE_KEY, []),
      )
    }
  })
}
