import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Rating Atom - Standardized star rating display
 * Provides consistent rating visualization
 */

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function Rating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = false,
  className 
}: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn("flex items-center gap-1", className)} role="img" aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;
          
          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                isFilled && "fill-yellow-400 text-yellow-400",
                isHalf && "fill-yellow-400/50 text-yellow-400",
                !isFilled && !isHalf && "text-muted-foreground/30"
              )}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
