import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/movie/$movieId')({
  component: MovieDetails,
})

// Placeholder — full details UI + data fetching lands in TEST-171/TEST-172.
function MovieDetails() {
  const { movieId } = Route.useParams()
  return (
    <div className="page-wrap py-10">
      <p className="text-muted-foreground">
        Movie details for #{movieId} coming soon.
      </p>
    </div>
  )
}
