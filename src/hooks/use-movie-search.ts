import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getMovieGenres, searchMovies } from '#/lib/tmdb'

import type { MovieSearchInput } from '#/lib/tmdb'

export function useMovieSearch(input: MovieSearchInput) {
  return useQuery({
    queryKey: ['movies', input],
    queryFn: () => searchMovies({ data: input }),
    placeholderData: keepPreviousData,
  })
}

export function useMovieGenres() {
  return useQuery({
    queryKey: ['movie-genres'],
    queryFn: () => getMovieGenres(),
    staleTime: Infinity,
  })
}
