/**
 * TMDB's movie genre list rarely changes, so we ship it as a static fallback —
 * cards can render genre names instantly with no loading state. The search
 * feature (TEST-167) fetches the live list from `/genre/movie/list` and can
 * pass it down instead when it's available.
 */
export const TMDB_MOVIE_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

export function genreNamesFor(
  genreIds: Array<number>,
  genreMap: Record<number, string> = TMDB_MOVIE_GENRES,
): Array<string> {
  return genreIds
    .map((id) => genreMap[id])
    .filter((name): name is string => Boolean(name))
}
