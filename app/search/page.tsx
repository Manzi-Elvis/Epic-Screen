"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Header } from "@/components/header"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { type Movie, searchMovies } from "@/lib/tmdb"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  const performSearch = async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) {
      setMovies([])
      setTotalPages(0)
      setTotalResults(0)
      return
    }

    setLoading(true)
    try {
      const response = await searchMovies(searchQuery, page)

      if (page === 1) {
        setMovies(response.results)
      } else {
        setMovies((prev) => [...prev, ...response.results])
      }

      setTotalPages(response.total_pages)
      setTotalResults(response.total_results)
      setCurrentPage(page)
    } catch (error) {
      console.error("Search error:", error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setCurrentPage(1)
      performSearch(query.trim())
      // Update URL without page reload
      const url = new URL(window.location.href)
      url.searchParams.set("q", query.trim())
      window.history.pushState({}, "", url.toString())
    }
  }

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      performSearch(query, currentPage + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="heading-font text-3xl font-bold text-foreground mb-6">Search Movies</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-lg bg-input border-border focus:border-primary"
              />
            </div>
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
              Search
            </Button>
          </form>

          {/* Search Results Info */}
          {query && !loading && (
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="secondary" className="text-sm">
                {totalResults.toLocaleString()} results for "{query}"
              </Badge>
              {totalResults > 0 && (
                <span className="text-sm text-muted-foreground">
                  Showing {movies.length} of {totalResults.toLocaleString()} movies
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && movies.length === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && query && movies.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No movies found</h2>
            <p className="text-muted-foreground mb-6">Try searching with different keywords or check your spelling.</p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("")
                setMovies([])
              }}
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Search Results */}
        {movies.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
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
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!query && !loading && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Search for Movies</h2>
            <p className="text-muted-foreground">Enter a movie title, actor, or director to get started.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-6" />
              <div className="h-12 bg-muted rounded mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[2/3] bg-muted rounded-lg mb-4" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
