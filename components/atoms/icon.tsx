import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Icon Atom - Standardized icon component
 * Ensures consistent sizing and styling across the application
 */

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconAnimation = 'none' | 'spin' | 'bounce' | 'pulse';

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  animation?: IconAnimation;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

const iconSizeClasses: Record<IconSize, string> = {
  xs: 'h-4 w-4',
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10',
  '2xl': 'h-12 w-12',
};

const iconAnimationClasses: Record<IconAnimation, string> = {
  none: '',
  spin: 'animate-spin',
  bounce: 'animate-bounce-subtle',
  pulse: 'animate-pulse',
};

export function Icon({ 
  icon: IconComponent, 
  size = 'md',
  animation = 'none',
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = !ariaLabel,
  ...props 
}: IconProps) {
  return (
    <IconComponent
      className={cn(
        iconSizeClasses[size],
        iconAnimationClasses[animation],
        'transition-transform duration-200',
        className
      )}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    />
  );
}
