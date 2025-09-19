import { Film } from "lucide-react"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Film className="h-8 w-8 text-primary" />
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-secondary rounded-full animate-pulse" />
      </div>
      <span className="heading-font text-2xl font-black text-foreground">
        Epic<span className="text-primary">Screen</span>
      </span>
    </div>
  )
}
