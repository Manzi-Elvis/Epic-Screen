"use client"

import { useEffect, useState } from "react"
import { Filter, Grid, List } from "lucide-react"
import { Header } from "@/components/header"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Movie, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "@/lib/tmdb"

type SortOption = "popular" | "top_rated" | "upcoming"

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const fetchMovies = async (sort: SortOption, page = 1) => {
    setLoading(true)
    try {
      let response

      switch (sort) {
        case "top_rated":
          response = await getTopRatedMovies(page)
          break
        case "upcoming":
          response = await getUpcomingMovies(page)
          break
        default:
          response = await getPopularMovies(page)
      }

      if (page === 1) {
        setMovies(response.results)
      } else {
        setMovies((prev) => [...prev, ...response.results])
      }

      setTotalPages(response.total_pages)
      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching movies:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchMovies(sortBy, 1)
  }, [sortBy])

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchMovies(sortBy, currentPage + 1)
    }
  }

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "top_rated":
        return "Top Rated"
      case "upcoming":
        return "Coming Soon"
      default:
        return "Popular"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="heading-font text-3xl font-bold text-foreground mb-2">All Movies</h1>
            <Badge variant="secondary" className="text-sm">
              {getSortLabel(sortBy)} Movies
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Selector */}
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="top_rated">Top Rated</SelectItem>
                <SelectItem value="upcoming">Coming Soon</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && movies.length === 0 && (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Movies Grid */}
        {movies.length > 0 && (
          <>
            <div
              className={`grid gap-6 mb-8 ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {movies.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index % 20) * 0.05}s` }}
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  size="lg"
                  variant="outline"
                  className="min-w-32 bg-transparent"
                >
                  {loading ? "Loading..." : "Load More Movies"}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-16">
            <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No movies found</h2>
            <p className="text-muted-foreground">Try changing the sort option or check back later.</p>
          </div>
        )}
      </main>
    </div>
  )
}
