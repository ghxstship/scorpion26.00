import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { typographyClasses } from "@/lib/design-tokens";

/**
 * Heading Atom - Standardized heading component
 * Ensures consistent heading hierarchy and responsive sizing
 */

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type DisplaySize = 'sm' | 'md' | 'lg';

interface HeadingProps {
  children: ReactNode;
  level: HeadingLevel;
  display?: DisplaySize;
  className?: string;
}

const headingClasses: Record<HeadingLevel, string> = {
  1: typographyClasses.h1,
  2: typographyClasses.h2,
  3: typographyClasses.h3,
  4: typographyClasses.h4,
  5: typographyClasses.h5,
  6: typographyClasses.h6,
};

const displayClasses: Record<DisplaySize, string> = {
  sm: typographyClasses.display.sm,
  md: typographyClasses.display.md,
  lg: typographyClasses.display.lg,
};

export function Heading({ 
  children, 
  level, 
  display,
  className 
}: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  const classes = display ? displayClasses[display] : headingClasses[level];
  
  return (
    <Component className={cn(classes, className)}>
      {children}
    </Component>
  );
}
