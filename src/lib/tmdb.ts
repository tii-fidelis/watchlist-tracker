import { createServerFn } from '@tanstack/react-start'

import type { TmdbMovieDetailsResult, TmdbMovieResult } from './movie'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export type SortBy =
  | 'popularity.desc'
  | 'popularity.asc'
  | 'vote_average.desc'
  | 'vote_average.asc'
  | 'primary_release_date.desc'
  | 'primary_release_date.asc'
  | 'title.asc'
  | 'title.desc'

export interface MovieSearchInput {
  query: string
  genreId?: number
  sortBy?: SortBy
  page?: number
}

export interface MovieSearchData {
  results: Array<TmdbMovieResult>
  page: number
  totalPages: number
  totalResults: number
}

export interface TmdbGenre {
  id: number
  name: string
}

/**
 * Server functions return a plain success/failure envelope instead of
 * throwing across the client/server RPC boundary — keeps failure handling
 * (missing API token, TMDB downtime, etc.) simple, serializable, and
 * independent of how this framework's cross-boundary error propagation
 * happens to behave in any given version.
 */
export type TmdbResult<T> = { ok: true; data: T } | { ok: false; error: string }

interface TmdbSearchResponse {
  page: number
  results: Array<TmdbMovieResult>
  total_pages: number
  total_results: number
}

interface TmdbGenreListResponse {
  genres: Array<TmdbGenre>
}

function requireApiToken(): string {
  const token = process.env.TMDB_API_TOKEN
  if (!token) {
    throw new Error(
      'TMDB_API_TOKEN is not set. Copy .env.example to .env and add your TMDB read access token from https://www.themoviedb.org/settings/api.',
    )
  }
  return token
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '')
      url.searchParams.set(key, String(value))
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${requireApiToken()}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `TMDB request to ${path} failed (${response.status}): ${body}`,
    )
  }

  return (await response.json()) as T
}

function sortResults(
  results: Array<TmdbMovieResult>,
  sortBy: SortBy,
): Array<TmdbMovieResult> {
  const sorted = [...results]
  switch (sortBy) {
    case 'vote_average.desc':
      return sorted.sort((a, b) => b.vote_average - a.vote_average)
    case 'vote_average.asc':
      return sorted.sort((a, b) => a.vote_average - b.vote_average)
    case 'primary_release_date.desc':
      return sorted.sort((a, b) =>
        (b.release_date || '').localeCompare(a.release_date || ''),
      )
    case 'primary_release_date.asc':
      return sorted.sort((a, b) =>
        (a.release_date || '').localeCompare(b.release_date || ''),
      )
    case 'title.asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'title.desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    case 'popularity.asc':
    case 'popularity.desc':
      return sorted
  }
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Something went wrong talking to TMDB.'
}

/**
 * Searches for movies. When `query` is blank this browses instead, via
 * TMDB's `/discover/movie` (which is the only endpoint that supports
 * genre filtering + custom sorting). TMDB's `/search/movie` supports
 * neither, so when there IS a text query we apply genre filter + sort
 * ourselves against that page of results.
 */
export const searchMovies = createServerFn({ method: 'GET' })
  .validator((input: MovieSearchInput) => input)
  .handler(async ({ data }): Promise<TmdbResult<MovieSearchData>> => {
    try {
      const hasQuery = data.query.trim().length > 0
      const page = data.page ?? 1

      const response = hasQuery
        ? await tmdbFetch<TmdbSearchResponse>('/search/movie', {
            query: data.query.trim(),
            page,
            include_adult: 'false',
          })
        : await tmdbFetch<TmdbSearchResponse>('/discover/movie', {
            with_genres: data.genreId,
            sort_by: data.sortBy ?? 'popularity.desc',
            page,
            include_adult: 'false',
          })

      let results = response.results
      if (hasQuery && data.genreId) {
        results = results.filter((movie) =>
          movie.genre_ids.includes(data.genreId as number),
        )
      }
      if (hasQuery && data.sortBy) {
        results = sortResults(results, data.sortBy)
      }

      return {
        ok: true,
        data: {
          results,
          page: response.page,
          totalPages: response.total_pages,
          totalResults: response.total_results,
        },
      }
    } catch (error) {
      return { ok: false, error: toErrorMessage(error) }
    }
  })

export const getMovieGenres = createServerFn({ method: 'GET' }).handler(
  async (): Promise<TmdbResult<Array<TmdbGenre>>> => {
    try {
      const response = await tmdbFetch<TmdbGenreListResponse>(
        '/genre/movie/list',
        {
          language: 'en',
        },
      )
      return { ok: true, data: response.genres }
    } catch (error) {
      return { ok: false, error: toErrorMessage(error) }
    }
  },
)

export const getMovieDetails = createServerFn({ method: 'GET' })
  .validator((movieId: number) => movieId)
  .handler(
    async ({ data: movieId }): Promise<TmdbResult<TmdbMovieDetailsResult>> => {
      try {
        const details = await tmdbFetch<TmdbMovieDetailsResult>(
          `/movie/${movieId}`,
          {
            language: 'en',
          },
        )
        return { ok: true, data: details }
      } catch (error) {
        return { ok: false, error: toErrorMessage(error) }
      }
    },
  )
