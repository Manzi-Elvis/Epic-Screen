import type { Movie } from "./tmdb"

const WATCHLIST_KEY = "epicscreen-watchlist"

export interface WatchlistItem {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  addedAt: string
}

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(WATCHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading watchlist:", error)
    return []
  }
}

export function addToWatchlist(movie: Movie): void {
  if (typeof window === "undefined") return

  try {
    const watchlist = getWatchlist()
    const isAlreadyInWatchlist = watchlist.some((item) => item.id === movie.id)

    if (!isAlreadyInWatchlist) {
      const watchlistItem: WatchlistItem = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        addedAt: new Date().toISOString(),
      }

      const updatedWatchlist = [watchlistItem, ...watchlist]
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist))

      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent("watchlistUpdated"))
    }
  } catch (error) {
    console.error("Error adding to watchlist:", error)
  }
}

export function removeFromWatchlist(movieId: number): void {
  if (typeof window === "undefined") return

  try {
    const watchlist = getWatchlist()
    const updatedWatchlist = watchlist.filter((item) => item.id !== movieId)
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist))

    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent("watchlistUpdated"))
  } catch (error) {
    console.error("Error removing from watchlist:", error)
  }
}

export function isInWatchlist(movieId: number): boolean {
  if (typeof window === "undefined") return false

  const watchlist = getWatchlist()
  return watchlist.some((item) => item.id === movieId)
}

export function clearWatchlist(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(WATCHLIST_KEY)
    window.dispatchEvent(new CustomEvent("watchlistUpdated"))
  } catch (error) {
    console.error("Error clearing watchlist:", error)
  }
}
