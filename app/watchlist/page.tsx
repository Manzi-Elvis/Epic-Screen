"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Trash2, Play, Calendar, Star, Grid, List } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getWatchlist, removeFromWatchlist, clearWatchlist, type WatchlistItem } from "@/lib/watchlist"
import { getImageUrl } from "@/lib/tmdb"
import Image from "next/image"

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"added" | "title" | "rating" | "release">("added")

  const loadWatchlist = () => {
    const items = getWatchlist()
    setWatchlist(items)
  }

  useEffect(() => {
    loadWatchlist()

    // Listen for watchlist updates
    const handleWatchlistUpdate = () => {
      loadWatchlist()
    }

    window.addEventListener("watchlistUpdated", handleWatchlistUpdate)
    return () => window.removeEventListener("watchlistUpdated", handleWatchlistUpdate)
  }, [])

  const handleRemoveItem = (movieId: number) => {
    removeFromWatchlist(movieId)
    loadWatchlist()
  }

  const handleClearWatchlist = () => {
    clearWatchlist()
    loadWatchlist()
  }

  const getSortedWatchlist = () => {
    const sorted = [...watchlist]

    switch (sortBy) {
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case "rating":
        return sorted.sort((a, b) => b.vote_average - a.vote_average)
      case "release":
        return sorted.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
      default:
        return sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    }
  }

  const sortedWatchlist = getSortedWatchlist()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="heading-font text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              My Watchlist
            </h1>
            <Badge variant="secondary" className="text-sm">
              {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"}
            </Badge>
          </div>

          {watchlist.length > 0 && (
            <div className="flex items-center gap-4">
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground"
              >
                <option value="added">Recently Added</option>
                <option value="title">Title A-Z</option>
                <option value="rating">Highest Rated</option>
                <option value="release">Release Date</option>
              </select>

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

              {/* Clear Watchlist */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Watchlist</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove all movies from your watchlist? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearWatchlist}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {/* Empty State */}
        {watchlist.length === 0 && (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-8">
              Start adding movies to your watchlist to keep track of what you want to watch.
            </p>
            <Button asChild size="lg">
              <Link href="/">Discover Movies</Link>
            </Button>
          </div>
        )}

        {/* Watchlist Items */}
        {watchlist.length > 0 && (
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"
            }`}
          >
            {sortedWatchlist.map((item, index) => (
              <WatchlistCard key={item.id} item={item} viewMode={viewMode} onRemove={handleRemoveItem} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

interface WatchlistCardProps {
  item: WatchlistItem
  viewMode: "grid" | "list"
  onRemove: (movieId: number) => void
  index: number
}

function WatchlistCard({ item, viewMode, onRemove, index }: WatchlistCardProps) {
  const releaseYear = item.release_date ? new Date(item.release_date).getFullYear() : "TBA"
  const addedDate = new Date(item.addedAt).toLocaleDateString()

  if (viewMode === "list") {
    return (
      <Card
        className="group bg-card border-border hover:border-primary/50 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <CardContent className="p-0">
          <div className="flex gap-4 p-4">
            {/* Poster */}
            <Link href={`/movie/${item.id}`} className="flex-shrink-0">
              <div className="relative w-20 aspect-[2/3] overflow-hidden rounded-md">
                <Image
                  src={getImageUrl(item.poster_path, "w200") || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="80px"
                />
              </div>
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link href={`/movie/${item.id}`}>
                    <h3 className="font-semibold text-card-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {releaseYear}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">Added {addedDate}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/movie/${item.id}`}>
                      <Play className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove from Watchlist</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove "{item.title}" from your watchlist?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onRemove(item.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link href={`/movie/${item.id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={getImageUrl(item.poster_path, "w500") || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Rating badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-none">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {item.vote_average.toFixed(1)}
              </Badge>
            </div>

            {/* Remove button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove from Watchlist</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove "{item.title}" from your watchlist?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onRemove(item.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-card-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{releaseYear}</span>
              <span>Added {addedDate}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
