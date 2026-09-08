import { createFileRoute } from '@tanstack/react-router'

import { EmptyState } from '#/components/empty-state'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="page-wrap py-10">
      <header className="mb-8">
        <h1 className="display-title text-3xl font-bold">Watchlist Tracker</h1>
        <p className="mt-2 text-muted-foreground">
          Search for movies, build your watchlist, and keep track of your
          favorites.
        </p>
      </header>

      <Tabs defaultValue="search">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent Searches</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          <EmptyState message="Search for a movie to get started." />
        </TabsContent>

        <TabsContent value="watchlist" className="mt-6">
          <EmptyState message="Your watchlist is empty. Add movies from search results." />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <EmptyState message="You haven't favorited any movies yet." />
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <EmptyState message="Your recent searches will show up here." />
        </TabsContent>
      </Tabs>
    </div>
  )
}
