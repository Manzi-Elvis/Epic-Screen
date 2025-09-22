const TMDB_API_KEY = process.env.TMDB_API_KEY 
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"
export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}
export interface MovieDetails extends Movie {
  genres: Genre[]
  runtime: number
  budget: number
  revenue: number
  status: string
  tagline: string
  homepage: string
  imdb_id: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  videos?: {
    results: Video[]
  }
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Video {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  official: boolean
  published_at: string
  site: string
  size: number
  type: string
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// Helper function to build API URLs
function buildApiUrl(endpoint: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  url.searchParams.append("api_key", TMDB_API_KEY || "")

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString())
  })

  return url.toString()
}

// Helper function to get image URLs
export function getImageUrl(
  path: string | null,
  size: "w200" | "w300" | "w400" | "w500" | "w780" | "w1280" | "original" = "w500",
) {
  if (!path) return "/abstract-movie-poster.png"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function getBackdropUrl(path: string | null, size: "w300" | "w780" | "w1280" | "original" = "w1280") {
  if (!path) return "/movie-backdrop.png"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

// API Functions
export async function getTrendingMovies(timeWindow: "day" | "week" = "week"): Promise<TMDBResponse<Movie>> {
  const url = buildApiUrl(`/trending/movie/${timeWindow}`)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies: ${response.statusText}`)
  }

  return response.json()
}

export async function getPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
  const url = buildApiUrl("/movie/popular", { page })
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch popular movies: ${response.statusText}`)
  }

  return response.json()
}

export async function getTopRatedMovies(page = 1): Promise<TMDBResponse<Movie>> {
  const url = buildApiUrl("/movie/top_rated", { page })
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch top rated movies: ${response.statusText}`)
  }

  return response.json()
}

export async function getUpcomingMovies(page = 1): Promise<TMDBResponse<Movie>> {
  const url = buildApiUrl("/movie/upcoming", { page })
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch upcoming movies: ${response.statusText}`)
  }

  return response.json()
}

export async function searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
  const url = buildApiUrl("/search/movie", { query, page })
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to search movies: ${response.statusText}`)
  }

  return response.json()
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const url = buildApiUrl(`/movie/${movieId}`, { append_to_response: "videos" })
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.statusText}`)
  }

  return response.json()
}

export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  const url = buildApiUrl("/genre/movie/list")
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch movie genres: ${response.statusText}`)
  }

  return response.json()
}

// New interfaces for cast, reviews, and related movies
export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface MovieCredits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface Review {
  id: string
  author: string
  author_details: {
    name: string
    username: string
    avatar_path: string | null
    rating: number | null
  }
  content: string
  created_at: string
  updated_at: string
  url: string
}

export interface MovieReviews {
  page: number
  results: Review[]
  total_pages: number
  total_results: number
}

// New API functions for cast, reviews, and related movies
export async function getMovieCredits(movieId: number): Promise<MovieCredits> {
  const url = buildApiUrl(`/movie/${movieId}/credits`)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch movie credits: ${response.statusText}`)
  }

  return response.json()
}

export async function getMovieReviews(movieId: number, page = 1): Promise<MovieReviews> {
  const url = buildApiUrl(`/movie/${movieId}/reviews`, { page })
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch movie reviews: ${response.statusText}`)
  }

  return response.json()
}

export async function getSimilarMovies(movieId: number, page = 1): Promise<TMDBResponse<Movie>> {
  const url = buildApiUrl(`/movie/${movieId}/similar`, { page })
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch similar movies: ${response.statusText}`)
  }

  return response.json()
}

// Helper function to get profile image URL
export function getProfileUrl(path: string | null, size: "w45" | "w185" | "h632" | "original" = "w185") {
  if (!path) return "/diverse-group.png"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

// Helper function to get YouTube trailer URL
export function getTrailerUrl(videos: Video[]): string | null {
  const trailer = videos.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official)

  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
}

// Helper function to format runtime
export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes}m`
  }

  return `${hours}h ${remainingMinutes}m`
}

// Helper function to format release date
export function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
