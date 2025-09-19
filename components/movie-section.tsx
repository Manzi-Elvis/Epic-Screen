"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieCard } from "./movie-card"
import type { Movie } from "@/lib/tmdb"

interface MovieSectionProps {
  title: string
  movies: Movie[]
  loading?: boolean
}

export function MovieSection({ title, movies, loading = false }: MovieSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scrollContainer = `scroll-container-${title.replace(/\s+/g, "-").toLowerCase()}`

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(scrollContainer)
    if (!container) return

    const scrollAmount = 320 // Width of one movie card plus gap
    const newPosition =
      direction === "left" ? Math.max(0, scrollPosition - scrollAmount) : scrollPosition + scrollAmount

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })
  }

  const handleScroll = () => {
    const container = document.getElementById(scrollContainer)
    if (!container) return

    const position = container.scrollLeft
    setScrollPosition(position)
    setCanScrollLeft(position > 0)
    setCanScrollRight(position < container.scrollWidth - container.clientWidth - 10)
  }

  useEffect(() => {
    const container = document.getElementById(scrollContainer)
    if (container) {
      container.addEventListener("scroll", handleScroll)
      handleScroll() // Initial check
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [scrollContainer])

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="heading-font text-2xl font-bold text-foreground mb-6">{title}</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72">
              <div className="aspect-[2/3] bg-muted animate-pulse rounded-lg mb-4" />
              <div className="h-4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!movies.length) {
    return null
  }

  return (
    <section className="mb-12 relative group">
      <h2 className="heading-font text-2xl font-bold text-foreground mb-6 animate-fade-in">{title}</h2>

      <div className="relative">
        {/* Left scroll button */}
        <Button
          variant="secondary"
          size="sm"
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/70 hover:bg-black/90 border-none transition-opacity duration-300 ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Right scroll button */}
        <Button
          variant="secondary"
          size="sm"
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/70 hover:bg-black/90 border-none transition-opacity duration-300 ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Movies container */}
        <div
          id={scrollContainer}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-72 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MovieCard movie={movie} priority={index < 6} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
