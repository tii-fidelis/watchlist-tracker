import { useSelector } from '@tanstack/react-store'

import { favoritesStore } from '#/lib/collection-store'

import type { MovieSummary } from '#/lib/movie'

export function useFavorites() {
  const items = useSelector(favoritesStore, (state) => state)

  return {
    items,
    add: (movie: MovieSummary) => favoritesStore.actions.add(movie),
    remove: (movieId: number) => favoritesStore.actions.remove(movieId),
    toggle: (movie: MovieSummary) => favoritesStore.actions.toggle(movie),
    has: (movieId: number) => items.some((item) => item.id === movieId),
    clear: () => favoritesStore.actions.clear(),
  }
}
