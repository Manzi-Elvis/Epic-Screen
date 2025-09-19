"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Info, Star, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Movie, getBackdropUrl } from "@/lib/tmdb"
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist"

interface HeroSectionProps {
  movie: Movie | null
}

export function HeroSection({ movie }: HeroSectionProps) {
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    if (movie) {
      setInWatchlist(isInWatchlist(movie.id))
    }
  }, [movie])

  const handleWatchlistToggle = () => {
    if (!movie) return

    if (inWatchlist) {
      removeFromWatchlist(movie.id)
      setInWatchlist(false)
    } else {
      addToWatchlist(movie)
      setInWatchlist(true)
    }
  }

  if (!movie) {
    return (
      <section className="relative h-[70vh] bg-muted animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-2xl">
            <div className="h-12 bg-muted-foreground/20 rounded mb-4" />
            <div className="h-6 bg-muted-foreground/20 rounded mb-6 w-3/4" />
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-muted-foreground/20 rounded" />
              <div className="h-12 w-32 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={getBackdropUrl(movie.backdrop_path, "original") || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 animate-fade-in">
        <div className="max-w-2xl">
          {/* Rating and year */}
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="bg-black/70 text-white border-none">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              {movie.vote_average.toFixed(1)}
            </Badge>
            <span className="text-muted-foreground">{releaseYear}</span>
          </div>

          {/* Title */}
          <h1 className="heading-font text-5xl font-black text-foreground mb-4 text-balance">{movie.title}</h1>

          {/* Overview */}
          <p className="text-lg text-muted-foreground mb-8 line-clamp-3 text-pretty">{movie.overview}</p>

          {/* Action buttons */}
          <div className="flex gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={`/movie/${movie.id}`}>
                <Play className="h-5 w-5 mr-2" />
                Watch Now
              </Link>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="bg-black/70 hover:bg-black/90 text-white border-none"
              onClick={handleWatchlistToggle}
            >
              {inWatchlist ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Add to Watchlist
                </>
              )}
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href={`/movie/${movie.id}`}>
                <Info className="h-5 w-5 mr-2" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
