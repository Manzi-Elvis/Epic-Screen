"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MovieSection } from "@/components/movie-section"
import { Logo } from "@/components/logo" // Import Logo component
import { type Movie, getTrendingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "@/lib/tmdb"

export default function HomePage() {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null)
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trending, popular, topRated, upcoming] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ])

        setTrendingMovies(trending.results)
        setPopularMovies(popular.results)
        setTopRatedMovies(topRated.results)
        setUpcomingMovies(upcoming.results)

        if (trending.results.length > 0) {
          setHeroMovie(trending.results[0])
        }
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection movie={heroMovie} />

        {/* Movie Sections */}
        <div className="container mx-auto px-4 py-12">
          <MovieSection title="Trending Now" movies={trendingMovies} loading={loading} />

          <MovieSection title="Popular Movies" movies={popularMovies} loading={loading} />

          <MovieSection title="Top Rated" movies={topRatedMovies} loading={loading} />

          <MovieSection title="Coming Soon" movies={upcomingMovies} loading={loading} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <Logo />
          </div>
          <p className="text-muted-foreground">
            Your premium entertainment destination. Discover and stream the latest movies.
          </p>
          <p className="text-sm text-muted-foreground mt-4">© 2024 EpicScreen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
