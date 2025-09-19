"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Play, Plus, Check, Star, Calendar, Clock, Globe, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  type MovieDetails,
  type CastMember,
  type Review,
  type Movie,
  getMovieDetails,
  getMovieCredits,
  getMovieReviews,
  getSimilarMovies,
  getImageUrl,
  getBackdropUrl,
  getProfileUrl,
  formatRuntime,
  formatReleaseDate,
  getTrailerUrl,
} from "@/lib/tmdb"
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist"

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const movieId = Number.parseInt(params.id as string)

  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [inWatchlist, setInWatchlist] = useState(false)
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const [movieData, creditsData, reviewsData, similarData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getMovieReviews(movieId),
          getSimilarMovies(movieId),
        ])

        setMovie(movieData)
        setCast(creditsData.cast.slice(0, 12)) // Show top 12 cast members
        setReviews(reviewsData.results.slice(0, 6)) // Show first 6 reviews
        setRelatedMovies(similarData.results.slice(0, 12)) // Show 12 related movies
        setInWatchlist(isInWatchlist(movieId))

        // Get trailer URL if available
        if (movieData.videos?.results) {
          const trailer = getTrailerUrl(movieData.videos.results)
          setTrailerUrl(trailer)
        }
      } catch (error) {
        console.error("Error fetching movie data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (movieId) {
      fetchMovie()
    }
  }, [movieId])

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

  const handleWatchTrailer = () => {
    if (trailerUrl) {
      window.open(trailerUrl, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="animate-pulse">
          {/* Hero Section Skeleton */}
          <div className="relative h-[60vh] bg-muted">
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="container mx-auto">
                <div className="max-w-2xl">
                  <div className="h-12 bg-muted-foreground/20 rounded mb-4" />
                  <div className="h-6 bg-muted-foreground/20 rounded mb-6 w-3/4" />
                  <div className="flex gap-4">
                    <div className="h-12 w-32 bg-muted-foreground/20 rounded" />
                    <div className="h-12 w-32 bg-muted-foreground/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground mb-8">The movie you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </main>
      </div>
    )
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          {/* Background Image */}
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

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="max-w-2xl animate-fade-in">
                {/* Back Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="mb-4 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                {/* Movie Info */}
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="secondary" className="bg-black/70 text-white border-none">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </Badge>
                  <span className="text-muted-foreground">{releaseYear}</span>
                  {movie.runtime && <span className="text-muted-foreground">{formatRuntime(movie.runtime)}</span>}
                </div>

                {/* Title */}
                <h1 className="heading-font text-4xl md:text-5xl font-black text-foreground mb-4 text-balance">
                  {movie.title}
                </h1>

                {/* Tagline */}
                {movie.tagline && <p className="text-lg text-primary mb-4 italic">"{movie.tagline}"</p>}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {trailerUrl && (
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleWatchTrailer}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Watch Trailer
                    </Button>
                  )}

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

                  {movie.homepage && (
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Link href={movie.homepage} target="_blank">
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Official Site
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Movie Details */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="animate-fade-in">
                <h2 className="heading-font text-2xl font-bold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">{movie.overview}</p>
              </div>

              {/* Genres */}
              {movie.genres.length > 0 && (
                <div className="animate-fade-in">
                  <h3 className="heading-font text-xl font-semibold text-foreground mb-4">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="outline" className="border-primary/20 text-primary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Cast */}
              {cast.length > 0 && (
                <div className="animate-fade-in">
                  <h3 className="heading-font text-xl font-semibold text-foreground mb-6">Cast</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cast.map((member) => (
                      <Card key={member.id} className="bg-card border-border overflow-hidden">
                        <CardContent className="p-0">
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                              src={getProfileUrl(member.profile_path, "w185") || "/placeholder.svg"}
                              alt={member.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-semibold text-card-foreground text-sm mb-1 truncate">{member.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{member.character}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <div className="animate-fade-in">
                  <h3 className="heading-font text-xl font-semibold text-foreground mb-6">Reviews</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {reviews.map((review) => (
                      <Card key={review.id} className="bg-card border-border">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={
                                  review.author_details.avatar_path
                                    ? getProfileUrl(review.author_details.avatar_path, "w45")
                                    : "/placeholder.svg?height=40&width=40&query=user"
                                }
                                alt={review.author}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-card-foreground truncate">
                                  {review.author_details.name || review.author}
                                </h4>
                                {review.author_details.rating && (
                                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    <Star className="h-3 w-3 mr-1 fill-current" />
                                    {review.author_details.rating}/10
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">{review.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Production Companies */}
              {movie.production_companies.length > 0 && (
                <div className="animate-fade-in">
                  <h3 className="heading-font text-xl font-semibold text-foreground mb-4">Production Companies</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.production_companies.slice(0, 6).map((company) => (
                      <Card key={company.id} className="bg-card border-border">
                        <CardContent className="p-4 text-center">
                          {company.logo_path ? (
                            <div className="relative h-12 mb-2">
                              <Image
                                src={getImageUrl(company.logo_path, "w200") || "/placeholder.svg"}
                                alt={company.name}
                                fill
                                className="object-contain"
                                sizes="200px"
                              />
                            </div>
                          ) : (
                            <div className="h-12 flex items-center justify-center mb-2">
                              <Globe className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <p className="text-sm text-card-foreground font-medium">{company.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Poster */}
              <div className="animate-fade-in">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                  <Image
                    src={getImageUrl(movie.poster_path, "w500") || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>

              {/* Movie Facts */}
              <Card className="bg-card border-border animate-fade-in">
                <CardContent className="p-6 space-y-4">
                  <h3 className="heading-font text-lg font-semibold text-card-foreground">Movie Facts</h3>

                  <Separator />

                  <div className="space-y-3">
                    {/* Release Date */}
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Release Date</p>
                        <p className="text-card-foreground">
                          {movie.release_date ? formatReleaseDate(movie.release_date) : "TBA"}
                        </p>
                      </div>
                    </div>

                    {/* Runtime */}
                    {movie.runtime && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Runtime</p>
                          <p className="text-card-foreground">{formatRuntime(movie.runtime)}</p>
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="text-card-foreground">
                          {movie.vote_average.toFixed(1)}/10 ({movie.vote_count.toLocaleString()} votes)
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 flex-shrink-0">
                        <div
                          className={`h-2 w-2 rounded-full mx-auto ${
                            movie.status === "Released" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="text-card-foreground">{movie.status}</p>
                      </div>
                    </div>

                    {/* Original Language */}
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Original Language</p>
                        <p className="text-card-foreground uppercase">{movie.original_language}</p>
                      </div>
                    </div>

                    {/* Budget */}
                    {movie.budget > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 text-primary flex-shrink-0">$</div>
                        <div>
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="text-card-foreground">${movie.budget.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {/* Revenue */}
                    {movie.revenue > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 text-primary flex-shrink-0">$</div>
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="text-card-foreground">${movie.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Movies */}
          {relatedMovies.length > 0 && (
            <div className="mt-12 animate-fade-in">
              <h3 className="heading-font text-2xl font-bold text-foreground mb-6">Related Movies</h3>
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
                  {relatedMovies.map((relatedMovie) => (
                    <Link key={relatedMovie.id} href={`/movie/${relatedMovie.id}`} className="flex-shrink-0 group">
                      <Card className="bg-card border-border overflow-hidden w-48 transition-transform hover:scale-105">
                        <CardContent className="p-0">
                          <div className="relative aspect-[2/3] overflow-hidden">
                            <Image
                              src={getImageUrl(relatedMovie.poster_path, "w300") || "/placeholder.svg"}
                              alt={relatedMovie.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-110"
                              sizes="192px"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-semibold text-card-foreground text-sm mb-1 line-clamp-2">
                              {relatedMovie.title}
                            </h4>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {relatedMovie.release_date ? new Date(relatedMovie.release_date).getFullYear() : "TBA"}
                              </p>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground">
                                  {relatedMovie.vote_average.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
