export default function Loading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
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
            <div className="aspect-[2/3] bg-muted rounded-lg" />
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
