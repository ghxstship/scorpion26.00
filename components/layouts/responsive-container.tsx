import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { containerClasses } from "@/lib/design-tokens";

interface ResponsiveContainerProps {
  children: ReactNode;
  size?: "default" | "tight" | "wide";
  className?: string;
}

/**
 * Responsive Container Wrapper
 * 
 * Standardized container component with consistent padding.
 * Use this when you need just a container without a section wrapper.
 * 
 * @example
 * <ResponsiveContainer>
 *   <h2>Content</h2>
 * </ResponsiveContainer>
 */
export function ResponsiveContainer({
  children,
  size = "default",
  className,
}: ResponsiveContainerProps) {
  return (
    <div className={cn(containerClasses[size], className)}>
      {children}
    </div>
  );
}
