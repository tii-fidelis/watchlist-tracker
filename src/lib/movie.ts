/** Trimmed-down movie shape we actually store/render, independent of TMDB's raw response shape. */
export interface MovieSummary {
  id: number
  title: string
  overview: string
  posterPath: string | null
  genreIds: Array<number>
  voteAverage: number
  releaseDate: string
}

/** TMDB's raw `/search/movie` and `/discover/movie` result shape (the fields we use). */
export interface TmdbMovieResult {
  id: number
  title: string
  overview: string
  poster_path: string | null
  genre_ids: Array<number>
  vote_average: number
  release_date: string
}

export function toMovieSummary(result: TmdbMovieResult): MovieSummary {
  return {
    id: result.id,
    title: result.title,
    overview: result.overview,
    posterPath: result.poster_path,
    genreIds: result.genre_ids,
    voteAverage: result.vote_average,
    releaseDate: result.release_date,
  }
}

export function tmdbPosterUrl(
  posterPath: string | null,
  size: 'w185' | 'w342' | 'w500' = 'w342',
): string | null {
  return posterPath ? `https://image.tmdb.org/t/p/${size}${posterPath}` : null
}
