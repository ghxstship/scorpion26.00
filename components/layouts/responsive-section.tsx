import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { sectionClasses, containerClasses } from "@/lib/design-tokens";

interface ResponsiveSectionProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  containerSize?: "default" | "tight" | "wide";
  className?: string;
  containerClassName?: string;
  id?: string;
}

/**
 * Responsive Section Wrapper
 * 
 * Standardized section component with consistent padding and container.
 * Use this for all new sections to ensure consistency.
 * 
 * @example
 * <ResponsiveSection size="md">
 *   <h2>Section Title</h2>
 *   <p>Section content</p>
 * </ResponsiveSection>
 */
export function ResponsiveSection({
  children,
  size = "md",
  containerSize = "default",
  className,
  containerClassName,
  id,
}: ResponsiveSectionProps) {
  return (
    <section id={id} className={cn(sectionClasses[size], className)}>
      <div className={cn(containerClasses[containerSize], containerClassName)}>
        {children}
      </div>
    </section>
  );
}
