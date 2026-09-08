import { useSelector } from '@tanstack/react-store'

import { watchlistStore } from '#/lib/collection-store'

import type { MovieSummary } from '#/lib/movie'

export function useWatchlist() {
  const items = useSelector(watchlistStore, (state) => state)

  return {
    items,
    add: (movie: MovieSummary) => watchlistStore.actions.add(movie),
    remove: (movieId: number) => watchlistStore.actions.remove(movieId),
    toggle: (movie: MovieSummary) => watchlistStore.actions.toggle(movie),
    has: (movieId: number) => items.some((item) => item.id === movieId),
    clear: () => watchlistStore.actions.clear(),
  }
}
