import { createStore } from '@tanstack/react-store'

import { readLocalStorage, writeLocalStorage } from './storage'

import type { MovieSummary } from './movie'

/**
 * Creates a `localStorage`-backed store for a deduplicated list of movies
 * (used for both the watchlist and favorites collections — same shape,
 * same add/remove/has semantics, different storage key).
 *
 * Persists on every change and stays in sync across browser tabs via the
 * `storage` event.
 */
export function createMovieCollectionStore(storageKey: string) {
  const store = createStore(
    readLocalStorage<Array<MovieSummary>>(storageKey, []),
    ({ setState, get }) => ({
      add: (movie: MovieSummary) =>
        setState((items) =>
          items.some((item) => item.id === movie.id)
            ? items
            : [movie, ...items],
        ),
      remove: (movieId: number) =>
        setState((items) => items.filter((item) => item.id !== movieId)),
      toggle: (movie: MovieSummary) =>
        setState((items) =>
          items.some((item) => item.id === movie.id)
            ? items.filter((item) => item.id !== movie.id)
            : [movie, ...items],
        ),
      has: (movieId: number) => get().some((item) => item.id === movieId),
      clear: () => setState(() => []),
    }),
  )

  store.subscribe(() => writeLocalStorage(storageKey, store.state))

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === storageKey) {
        store.setState(() =>
          readLocalStorage<Array<MovieSummary>>(storageKey, []),
        )
      }
    })
  }

  return store
}

export const watchlistStore = createMovieCollectionStore(
  'watchlist-tracker:watchlist',
)
export const favoritesStore = createMovieCollectionStore(
  'watchlist-tracker:favorites',
)
