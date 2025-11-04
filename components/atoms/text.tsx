import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { typographyClasses } from "@/lib/design-tokens";

/**
 * Text Atom - Standardized text component
 * Provides consistent typography across the application
 */

export type TextVariant = 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'caption' | 'label' | 'button';
export type TextElement = 'p' | 'span' | 'div' | 'label';

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  as?: TextElement;
  className?: string;
}

const variantClasses: Record<TextVariant, string> = {
  'body-lg': typographyClasses.body.lg,
  'body-md': typographyClasses.body.md,
  'body-sm': typographyClasses.body.sm,
  'body-xs': typographyClasses.body.xs,
  'caption': typographyClasses.caption,
  'label': typographyClasses.label,
  'button': typographyClasses.button,
};

export function Text({ 
  children, 
  variant = 'body-md', 
  as: Component = 'p',
  className 
}: TextProps) {
  return (
    <Component className={cn(variantClasses[variant], className)}>
      {children}
    </Component>
  );
}
