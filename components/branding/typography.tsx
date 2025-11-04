'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useTypography } from '@/lib/branding/brand-context';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Brand Title Component
 * Uses the title font from the active theme (Anton SC in Scorpion preset)
 */
export function BrandTitle({ children, className, as: Component = 'h1' }: TypographyProps) {
  const typography = useTypography();
  
  return (
    <Component
      className={cn('brand-title uppercase', className)}
      style={{ fontFamily: typography.title }}
    >
      {children}
    </Component>
  );
}

/**
 * Brand Subtitle Component
 * Uses the subtitle font from the active theme (Contrail One in Scorpion preset)
 */
export function BrandSubtitle({ children, className, as: Component = 'p' }: TypographyProps) {
  const typography = useTypography();
  
  return (
    <Component
      className={cn('brand-subtitle uppercase', className)}
      style={{ fontFamily: typography.subtitle }}
    >
      {children}
    </Component>
  );
}

/**
 * Brand H1 Component
 * Uses the heading1 font from the active theme (Bebas Neue in Scorpion preset)
 */
export function BrandH1({ children, className, as: Component = 'h1' }: TypographyProps) {
  const typography = useTypography();
  
  return (
    <Component
      className={cn('brand-h1 uppercase', className)}
      style={{ fontFamily: typography.heading1 }}
    >
      {children}
    </Component>
  );
}

/**
 * Brand H2 Component
 * Uses the heading2 font from the active theme (Bebas Neue in Scorpion preset)
 */
export function BrandH2({ children, className, as: Component = 'h2' }: TypographyProps) {
  const typography = useTypography();
  
  return (
    <Component
      className={cn('brand-h2 uppercase', className)}
      style={{ fontFamily: typography.heading2 }}
    >
      {children}
    </Component>
  );
}

/**
 * Brand H3 Component
 * Uses the heading3 font from the active theme (Oswald in Scorpion preset)
 */
export function BrandH3({ children, className, as: Component = 'h3' }: TypographyProps) {
  const typography = useTypography();
  
  return (
    <Component
      className={cn('brand-h3 uppercase', className)}
      style={{ fontFamily: typography.heading3 }}
    >
      {children}
    </Component>
  );
}

/**
 * Brand H4 Component
 * Uses the heading4 font from the active theme (Oswald in Scorpion preset)
 */
export function BrandH4({ children, className, as: Component = 'h4' }: TypographyProps) {
  const typography = useTypography();
  
  return (
    <Component
      className={cn('brand-h4 uppercase', className)}
      style={{ fontFamily: typography.heading4 }}
    >
      {children}
    </Component>
  );
}

/**
 * Brand Body Text Component
 * Uses the body font from the active theme (Roboto Mono in Scorpion preset)
 */
export function BrandBody({ children, className, as: Component = 'p' }: TypographyProps) {
  const typography = useTypography();
  
  return (
    <Component
      className={cn('brand-body', className)}
      style={{ fontFamily: typography.body }}
    >
      {children}
    </Component>
  );
}

/**
 * Brand Button Text Component
 * Uses the button font from the active theme (Bebas Neue in Scorpion preset)
 */
export function BrandButton({ children, className, as: Component = 'span' }: TypographyProps) {
  const typography = useTypography();
  
  return (
    <Component
      className={cn('uppercase tracking-wide', className)}
      style={{ fontFamily: typography.button }}
    >
      {children}
    </Component>
  );
}

/**
 * Brand Caption Component
 * Uses the caption font from the active theme (Roboto Mono in Scorpion preset)
 */
export function BrandCaption({ children, className, as: Component = 'span' }: TypographyProps) {
  const typography = useTypography();
  
  return (
    <Component
      className={cn('text-sm', className)}
      style={{ fontFamily: typography.caption }}
    >
      {children}
    </Component>
  );
}
