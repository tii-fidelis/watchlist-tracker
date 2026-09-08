import { useMemo, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'

import { MovieGrid } from '#/components/movie-grid'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useMovieGenres, useMovieSearch } from '#/hooks/use-movie-search'
import { TMDB_MOVIE_GENRES } from '#/lib/genres'
import { toMovieSummary } from '#/lib/movie'

import type { FormEvent } from 'react'
import type { SortBy } from '#/lib/tmdb'

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest First' },
  { value: 'primary_release_date.asc', label: 'Oldest First' },
  { value: 'title.asc', label: 'Title (A–Z)' },
  { value: 'title.desc', label: 'Title (Z–A)' },
]

const LIMIT_OPTIONS = [10, 20, 40]

export interface SearchSectionProps {
  isInWatchlist?: (movieId: number) => boolean
  isFavorite?: (movieId: number) => boolean
  onToggleWatchlist?: (movie: ReturnType<typeof toMovieSummary>) => void
  onToggleFavorite?: (movie: ReturnType<typeof toMovieSummary>) => void
  onSearch?: (query: string) => void
  /** Pre-fills and immediately runs a search — pass a new value (e.g. re-render with a changed `key`) to re-trigger. */
  initialQuery?: string
}

export function SearchSection({
  isInWatchlist,
  isFavorite,
  onToggleWatchlist,
  onToggleFavorite,
  onSearch,
  initialQuery,
}: SearchSectionProps) {
  const [queryInput, setQueryInput] = useState(initialQuery ?? '')
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery ?? '')
  const [genreId, setGenreId] = useState<number | undefined>(undefined)
  const [sortBy, setSortBy] = useState<SortBy>('popularity.desc')
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)

  const genresQuery = useMovieGenres()
  const genres = genresQuery.data?.ok ? genresQuery.data.data : undefined
  const genreMap = useMemo(() => {
    if (!genres) return undefined
    return Object.fromEntries(genres.map((genre) => [genre.id, genre.name]))
  }, [genres])

  const searchQuery = useMovieSearch({
    query: submittedQuery,
    genreId,
    sortBy,
    page,
  })
  const searchResult = searchQuery.data?.ok ? searchQuery.data.data : undefined
  const searchError =
    searchQuery.data && !searchQuery.data.ok
      ? searchQuery.data.error
      : undefined

  const movies = useMemo(
    () => (searchResult?.results ?? []).slice(0, limit).map(toMovieSummary),
    [searchResult, limit],
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = queryInput.trim()
    setSubmittedQuery(trimmed)
    setPage(1)
    onSearch?.(trimmed)
  }

  const totalPages = searchResult?.totalPages ?? 1

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <Input
          value={queryInput}
          onChange={(event) => setQueryInput(event.target.value)}
          placeholder="Search movies…"
          aria-label="Search movies"
          className="max-w-sm"
        />
        <Button type="submit">
          <SearchIcon className="size-4" />
          Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Select
          value={genreId ? String(genreId) : 'all'}
          onValueChange={(value) => {
            setGenreId(value === 'all' ? undefined : Number(value))
            setPage(1)
          }}
        >
          <SelectTrigger
            size="sm"
            className="w-[160px]"
            aria-label="Filter by genre"
          >
            <SelectValue placeholder="All genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All genres</SelectItem>
            {Object.entries(genreMap ?? TMDB_MOVIE_GENRES).map(([id, name]) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value as SortBy)
            setPage(1)
          }}
        >
          <SelectTrigger size="sm" className="w-[170px]" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(limit)}
          onValueChange={(value) => setLimit(Number(value))}
        >
          <SelectTrigger
            size="sm"
            className="w-[110px]"
            aria-label="Results per page"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((count) => (
              <SelectItem key={count} value={String(count)}>
                Show {count}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {searchError ? (
        <p className="text-sm text-destructive">{searchError}</p>
      ) : null}

      <MovieGrid
        movies={movies}
        isLoading={searchQuery.isLoading}
        genreMap={genreMap}
        isInWatchlist={isInWatchlist}
        isFavorite={isFavorite}
        onToggleWatchlist={onToggleWatchlist}
        onToggleFavorite={onToggleFavorite}
        emptyMessage={
          submittedQuery
            ? 'No movies matched your search.'
            : 'Search for a movie, or browse by genre.'
        }
      />

      {movies.length > 0 ? (
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  )
}
