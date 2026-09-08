import { EmptyState } from '#/components/empty-state'
import { MovieCard } from '#/components/movie-card'
import { Skeleton } from '#/components/ui/skeleton'

import type { MovieSummary } from '#/lib/movie'

export interface MovieGridProps {
  movies: Array<MovieSummary>
  isLoading?: boolean
  emptyMessage?: string
  genreMap?: Record<number, string>
  isInWatchlist?: (movieId: number) => boolean
  isFavorite?: (movieId: number) => boolean
  onToggleWatchlist?: (movie: MovieSummary) => void
  onToggleFavorite?: (movie: MovieSummary) => void
}

const SKELETON_COUNT = 8

export function MovieGrid({
  movies,
  isLoading = false,
  emptyMessage = 'No movies to show.',
  genreMap,
  isInWatchlist,
  isFavorite,
  onToggleWatchlist,
  onToggleFavorite,
}: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <Skeleton key={index} className="aspect-[2/3] w-full" />
        ))}
      </div>
    )
  }

  if (movies.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          genreMap={genreMap}
          isInWatchlist={isInWatchlist?.(movie.id)}
          isFavorite={isFavorite?.(movie.id)}
          onToggleWatchlist={onToggleWatchlist}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
