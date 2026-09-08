import { Film, Heart, Star } from 'lucide-react'
import { cn } from 'cn'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { formatRuntime } from '#/lib/format'
import { tmdbBackdropUrl, tmdbPosterUrl } from '#/lib/movie'

import type { MovieDetails } from '#/lib/movie'

export interface MovieDetailsViewProps {
  details: MovieDetails
  isInWatchlist?: boolean
  isFavorite?: boolean
  onToggleWatchlist?: (details: MovieDetails) => void
  onToggleFavorite?: (details: MovieDetails) => void
}

export function MovieDetailsView({
  details,
  isInWatchlist = false,
  isFavorite = false,
  onToggleWatchlist,
  onToggleFavorite,
}: MovieDetailsViewProps) {
  const posterUrl = tmdbPosterUrl(details.posterPath, 'w500')
  const backdropUrl = tmdbBackdropUrl(details.backdropPath)
  const year = details.releaseDate ? details.releaseDate.slice(0, 4) : null
  const runtime = formatRuntime(details.runtimeMinutes)

  return (
    <div className="space-y-6">
      {backdropUrl ? (
        <div className="relative -mx-4 aspect-[21/9] overflow-hidden rounded-xl sm:mx-0">
          <img
            src={backdropUrl}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      ) : null}

      <div className="grid grid-cols-[minmax(0,180px)_1fr] gap-6 sm:grid-cols-[220px_1fr]">
        <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${details.title} poster`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Film className="size-12" aria-hidden />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="display-title text-2xl font-bold sm:text-3xl">
              {details.title}
            </h1>
            {details.tagline ? (
              <p className="mt-1 italic text-muted-foreground">
                {details.tagline}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {year ? <span>{year}</span> : null}
            {runtime ? <span>{runtime}</span> : null}
            <span className="inline-flex items-center gap-1">
              <Star className="size-4 fill-current" aria-hidden />
              {details.voteAverage > 0 ? details.voteAverage.toFixed(1) : 'N/A'}
            </span>
          </div>

          {details.genres.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {details.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
          ) : null}

          <p className="max-w-prose text-sm leading-relaxed">
            {details.overview || 'No description available.'}
          </p>

          {(onToggleWatchlist || onToggleFavorite) && (
            <div className="flex gap-2 pt-2">
              {onToggleWatchlist ? (
                <Button
                  type="button"
                  variant={isInWatchlist ? 'default' : 'outline'}
                  onClick={() => onToggleWatchlist(details)}
                >
                  {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
              ) : null}
              {onToggleFavorite ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={
                    isFavorite ? 'Remove from favorites' : 'Add to favorites'
                  }
                  aria-pressed={isFavorite}
                  onClick={() => onToggleFavorite(details)}
                >
                  <Heart
                    className={cn(
                      'size-4',
                      isFavorite && 'fill-current text-destructive',
                    )}
                  />
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
