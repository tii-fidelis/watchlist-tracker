import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { MovieGrid } from '#/components/movie-grid'
import { RecentSearchesSection } from '#/components/recent-searches-section'
import { SearchSection } from '#/components/search-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { useFavorites } from '#/hooks/use-favorites'
import { useRecentSearches } from '#/hooks/use-recent-searches'
import { useWatchlist } from '#/hooks/use-watchlist'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const watchlist = useWatchlist()
  const favorites = useFavorites()
  const recentSearches = useRecentSearches()

  const [activeTab, setActiveTab] = useState('search')
  const [rerun, setRerun] = useState<{ query: string; key: number } | null>(
    null,
  )

  function handleSelectRecentQuery(query: string) {
    setRerun({ query, key: Date.now() })
    setActiveTab('search')
  }

  return (
    <div className="page-wrap py-10">
      <header className="mb-8">
        <h1 className="display-title text-3xl font-bold">Watchlist Tracker</h1>
        <p className="mt-2 text-muted-foreground">
          Search for movies, build your watchlist, and keep track of your
          favorites.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent Searches</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          <SearchSection
            key={rerun?.key ?? 'default'}
            initialQuery={rerun?.query}
            isInWatchlist={watchlist.has}
            onToggleWatchlist={watchlist.toggle}
            isFavorite={favorites.has}
            onToggleFavorite={favorites.toggle}
            onSearch={recentSearches.record}
          />
        </TabsContent>

        <TabsContent value="watchlist" className="mt-6">
          <MovieGrid
            movies={watchlist.items}
            isInWatchlist={watchlist.has}
            onToggleWatchlist={watchlist.toggle}
            isFavorite={favorites.has}
            onToggleFavorite={favorites.toggle}
            emptyMessage="Your watchlist is empty. Add movies from search results."
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <MovieGrid
            movies={favorites.items}
            isInWatchlist={watchlist.has}
            onToggleWatchlist={watchlist.toggle}
            isFavorite={favorites.has}
            onToggleFavorite={favorites.toggle}
            emptyMessage="You haven't favorited any movies yet."
          />
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <RecentSearchesSection onSelectQuery={handleSelectRecentQuery} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
