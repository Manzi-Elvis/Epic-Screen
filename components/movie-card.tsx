"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Plus, Check, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Movie, getImageUrl } from "@/lib/tmdb"
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist"

interface MovieCardProps {
  movie: Movie
  priority?: boolean
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist(movie.id))
  const [isHovered, setIsHovered] = useState(false)

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWatchlist) {
      removeFromWatchlist(movie.id)
      setInWatchlist(false)
    } else {
      addToWatchlist(movie)
      setInWatchlist(true)
    }
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"

  return (
    <Card
      className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/movie/${movie.id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={getImageUrl(movie.poster_path, "w500") || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Overlay on hover */}
            <div
              className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Now
                </Button>
              </div>
            </div>

            {/* Rating badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-none">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </Badge>
            </div>

            {/* Watchlist button */}
            <Button
              size="sm"
              variant={inWatchlist ? "default" : "secondary"}
              className={`absolute top-2 right-2 h-8 w-8 p-0 ${inWatchlist ? "bg-primary hover:bg-primary/90" : "bg-black/70 hover:bg-black/90"} transition-all duration-200`}
              onClick={handleWatchlistToggle}
            >
              {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-card-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{releaseYear}</p>
            <p className="text-xs text-muted-foreground line-clamp-3">{movie.overview}</p>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
