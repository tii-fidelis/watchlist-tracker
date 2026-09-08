import { createFileRoute } from '@tanstack/react-router'

import { MovieDetailsView } from '#/components/movie-details-view'
import { Skeleton } from '#/components/ui/skeleton'
import { useFavorites } from '#/hooks/use-favorites'
import { useMovieDetails } from '#/hooks/use-movie-search'
import { useWatchlist } from '#/hooks/use-watchlist'
import { toMovieDetails } from '#/lib/movie'

export const Route = createFileRoute('/movie/$movieId')({
  component: MovieDetailsRoute,
})

function MovieDetailsRoute() {
  const { movieId } = Route.useParams()
  const watchlist = useWatchlist()
  const favorites = useFavorites()

  const detailsQuery = useMovieDetails(Number(movieId))
  const details = detailsQuery.data?.ok
    ? toMovieDetails(detailsQuery.data.data)
    : undefined
  const error =
    detailsQuery.data && !detailsQuery.data.ok
      ? detailsQuery.data.error
      : undefined

  return (
    <div className="page-wrap py-10">
      {detailsQuery.isLoading ? (
        <div className="grid grid-cols-[220px_1fr] gap-6">
          <Skeleton className="aspect-[2/3] w-full" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {details ? (
        <MovieDetailsView
          details={details}
          isInWatchlist={watchlist.has(details.id)}
          isFavorite={favorites.has(details.id)}
          onToggleWatchlist={watchlist.toggle}
          onToggleFavorite={favorites.toggle}
        />
      ) : null}
    </div>
  )
}
