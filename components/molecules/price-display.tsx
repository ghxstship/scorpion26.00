import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/atoms/text";

/**
 * PriceDisplay Molecule - Standardized price display
 * Handles price formatting, period labels, and discount badges
 */

interface PriceDisplayProps {
  price: number;
  period?: 'weekly' | 'monthly' | 'annual' | 'one-time';
  currency?: string;
  showDiscount?: boolean;
  discountPercent?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-2xl sm:text-3xl',
  lg: 'text-3xl sm:text-4xl',
};

const periodLabels = {
  weekly: '/wk',
  monthly: '/mo',
  annual: '/yr',
  'one-time': '',
};

export function PriceDisplay({
  price,
  period = 'one-time',
  currency = '$',
  showDiscount = false,
  discountPercent,
  size = 'md',
  color,
  className,
}: PriceDisplayProps) {
  return (
    <div className={cn("space-y-1.5 sm:space-y-2", className)}>
      <div className="flex items-baseline gap-1 sm:gap-1.5">
        <span
          className={cn(
            sizeClasses[size],
            "font-bold tracking-tight",
            color
          )}
        >
          {currency}{price}
        </span>
        {period !== 'one-time' && (
          <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground font-medium">
            {periodLabels[period]}
          </Text>
        )}
      </div>
      {showDiscount && discountPercent && (
        <Badge variant="secondary" className="text-[10px] sm:text-xs bg-green-500/20 text-green-400 border-green-500/30">
          Save {discountPercent}%
        </Badge>
      )}
    </div>
  );
}
