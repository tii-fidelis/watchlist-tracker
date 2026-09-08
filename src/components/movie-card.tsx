import { Link } from '@tanstack/react-router'
import { Film, Heart, Star } from 'lucide-react'
import { cn } from 'cn'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { genreNamesFor } from '#/lib/genres'
import { tmdbPosterUrl } from '#/lib/movie'

import type { MovieSummary } from '#/lib/movie'

export interface MovieCardProps {
  movie: MovieSummary
  genreMap?: Record<number, string>
  isInWatchlist?: boolean
  isFavorite?: boolean
  onToggleWatchlist?: (movie: MovieSummary) => void
  onToggleFavorite?: (movie: MovieSummary) => void
}

export function MovieCard({
  movie,
  genreMap,
  isInWatchlist = false,
  isFavorite = false,
  onToggleWatchlist,
  onToggleFavorite,
}: MovieCardProps) {
  const posterUrl = tmdbPosterUrl(movie.posterPath)
  const genres = genreNamesFor(movie.genreIds, genreMap)
  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : null

  return (
    <Card className="feature-card overflow-hidden py-0">
      <Link
        to="/movie/$movieId"
        params={{ movieId: String(movie.id) }}
        className="block"
      >
        <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Film className="size-10" aria-hidden />
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="px-4">
        <CardTitle className="line-clamp-1 text-base">
          <Link to="/movie/$movieId" params={{ movieId: String(movie.id) }}>
            {movie.title}
          </Link>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {year ? <span>{year}</span> : null}
          <span className="inline-flex items-center gap-1">
            <Star className="size-3 fill-current" aria-hidden />
            {movie.voteAverage > 0 ? movie.voteAverage.toFixed(1) : 'N/A'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {movie.overview || 'No description available.'}
        </p>
        {genres.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>

      {(onToggleWatchlist || onToggleFavorite) && (
        <CardFooter className="gap-2 px-4">
          {onToggleWatchlist ? (
            <Button
              type="button"
              variant={isInWatchlist ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => onToggleWatchlist(movie)}
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
              onClick={() => onToggleFavorite(movie)}
            >
              <Heart
                className={cn(
                  'size-4',
                  isFavorite && 'fill-current text-destructive',
                )}
              />
            </Button>
          ) : null}
        </CardFooter>
      )}
    </Card>
  )
}
