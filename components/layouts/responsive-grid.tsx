import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gridClasses } from "@/lib/design-tokens";

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: "2col" | "3col" | "4col";
  variant?: "cards" | "features";
  className?: string;
}

/**
 * Responsive Grid Wrapper
 * 
 * Standardized grid component with consistent breakpoints and gaps.
 * Use this for all grid layouts to ensure consistency.
 * 
 * @example
 * <ResponsiveGrid columns="3col">
 *   {items.map(item => <Card key={item.id}>{item.content}</Card>)}
 * </ResponsiveGrid>
 */
export function ResponsiveGrid({
  children,
  columns = "3col",
  variant = "cards",
  className,
}: ResponsiveGridProps) {
  // Get the grid class based on variant and columns
  const gridClass = variant === "cards" 
    ? gridClasses.cards[columns]
    : columns === "4col" 
      ? gridClasses.cards[columns] // features doesn't have 4col, fall back to cards
      : gridClasses.features[columns as "2col" | "3col"];
  
  return (
    <div className={cn(gridClass, className)}>
      {children}
    </div>
  );
}
