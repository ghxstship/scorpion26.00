import { cn } from "@/lib/utils"

function Skeleton({
  className,
  shimmer = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { shimmer?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md bg-primary/10",
        shimmer 
          ? "animate-shimmer bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 bg-[length:1000px_100%]" 
          : "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
