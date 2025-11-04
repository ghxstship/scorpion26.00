import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { heroClasses, containerClasses } from "@/lib/design-tokens";

interface ResponsiveHeroProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  containerSize?: "default" | "tight" | "wide";
  className?: string;
  containerClassName?: string;
}

/**
 * Responsive Hero Wrapper
 * 
 * Standardized hero section component with consistent heights and container.
 * Use this for all hero sections to ensure consistency.
 * 
 * @example
 * <ResponsiveHero size="md" className="bg-gradient-to-br from-primary/10">
 *   <h1>Hero Title</h1>
 *   <p>Hero description</p>
 * </ResponsiveHero>
 */
export function ResponsiveHero({
  children,
  size = "md",
  containerSize = "default",
  className,
  containerClassName,
}: ResponsiveHeroProps) {
  return (
    <section className={cn(
      "relative flex items-center justify-center overflow-hidden",
      heroClasses[size],
      className
    )}>
      <div className={cn(containerClasses[containerSize], containerClassName)}>
        {children}
      </div>
    </section>
  );
}
