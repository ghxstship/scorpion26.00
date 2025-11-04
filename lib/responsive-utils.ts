/**
 * Responsive Design Utilities
 * 
 * Comprehensive utilities for responsive design across all breakpoints
 * Mobile-first approach with consistent patterns
 */

import { designTokens } from './design-tokens';

/**
 * Breakpoint definitions
 */
export const breakpoints = {
  xs: 0,      // Mobile portrait
  sm: 640,    // Mobile landscape
  md: 768,    // Tablet portrait
  lg: 1024,   // Tablet landscape / Small desktop
  xl: 1280,   // Desktop
  '2xl': 1536, // Large desktop
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Responsive container classes
 * Ensures consistent max-width and padding across breakpoints
 */
export const containerClasses = {
  // Standard container
  default: 'container mx-auto px-4 sm:px-6 lg:px-8',
  // Narrow container (for text-heavy content)
  narrow: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl',
  // Wide container (for full-width sections)
  wide: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl',
  // Full bleed (no max-width)
  full: 'w-full px-4 sm:px-6 lg:px-8',
} as const;

/**
 * Responsive grid utilities
 * Mobile-first grid layouts with consistent gaps
 */
export const responsiveGrid = {
  // Auto-fit grids (responsive without breakpoints)
  autoFit: {
    sm: 'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4',
    md: 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6',
    lg: 'grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8',
  },
  // Fixed column grids
  cols: {
    1: 'grid grid-cols-1 gap-4 md:gap-6',
    2: 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
    6: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4',
  },
  // Dashboard grids
  dashboard: {
    sidebar: 'grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[280px_1fr] gap-6',
    main: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
    stats: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  },
} as const;

/**
 * Responsive flex utilities
 */
export const responsiveFlex = {
  // Stack on mobile, row on desktop
  stackToRow: 'flex flex-col md:flex-row gap-4 md:gap-6',
  // Row on mobile, stack on desktop (rare but useful)
  rowToStack: 'flex flex-row md:flex-col gap-4 md:gap-6',
  // Center content
  center: 'flex items-center justify-center',
  // Space between
  between: 'flex items-center justify-between',
  // Wrap items
  wrap: 'flex flex-wrap gap-4',
} as const;

/**
 * Responsive spacing utilities
 * Consistent spacing that scales with viewport
 */
export const responsiveSpacing = {
  // Section padding (vertical)
  section: {
    xs: 'py-8 md:py-12',
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-20 lg:py-24',
    lg: 'py-20 md:py-24 lg:py-32',
    xl: 'py-24 md:py-32 lg:py-40',
  },
  // Container padding (horizontal)
  container: {
    xs: 'px-3 sm:px-4',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
  },
  // Gap spacing
  gap: {
    xs: 'gap-2 md:gap-3',
    sm: 'gap-3 md:gap-4',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
    xl: 'gap-8 md:gap-12',
  },
  // Margin bottom
  mb: {
    xs: 'mb-2 md:mb-3',
    sm: 'mb-4 md:mb-6',
    md: 'mb-6 md:mb-8',
    lg: 'mb-8 md:mb-12',
    xl: 'mb-12 md:mb-16',
  },
  // Margin top
  mt: {
    xs: 'mt-2 md:mt-3',
    sm: 'mt-4 md:mt-6',
    md: 'mt-6 md:mt-8',
    lg: 'mt-8 md:mt-12',
    xl: 'mt-12 md:mt-16',
  },
} as const;

/**
 * Responsive typography utilities
 * Scales text size appropriately across breakpoints
 */
export const responsiveText = {
  // Display text (hero sections)
  display: {
    xs: 'text-3xl sm:text-4xl md:text-5xl',
    sm: 'text-4xl sm:text-5xl md:text-6xl',
    md: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
    lg: 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl',
  },
  // Headings
  h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
  h2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  h3: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
  h4: 'text-lg sm:text-xl md:text-2xl',
  h5: 'text-base sm:text-lg md:text-xl',
  h6: 'text-sm sm:text-base md:text-lg',
  // Body text
  body: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
  },
  // Special
  caption: 'text-xs sm:text-sm',
  label: 'text-sm sm:text-base',
} as const;

/**
 * Responsive visibility utilities
 * Show/hide elements at specific breakpoints
 */
export const responsiveVisibility = {
  // Show only on mobile
  mobileOnly: 'block md:hidden',
  // Show only on tablet and up
  tabletUp: 'hidden md:block',
  // Show only on desktop
  desktopOnly: 'hidden lg:block',
  // Hide on mobile
  hideMobile: 'hidden md:block',
  // Hide on desktop
  hideDesktop: 'block lg:hidden',
} as const;

/**
 * Responsive image utilities
 */
export const responsiveImage = {
  // Aspect ratios
  aspect: {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
    ultrawide: 'aspect-[21/9]',
  },
  // Object fit
  cover: 'object-cover',
  contain: 'object-contain',
  // Responsive sizing
  full: 'w-full h-auto',
  hero: 'w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]',
} as const;

/**
 * Responsive card utilities
 */
export const responsiveCard = {
  // Standard card
  default: 'rounded-lg md:rounded-xl p-4 md:p-6',
  // Compact card
  compact: 'rounded-md md:rounded-lg p-3 md:p-4',
  // Large card
  large: 'rounded-lg md:rounded-xl p-6 md:p-8',
  // Interactive card (with hover states)
  interactive: 'rounded-lg md:rounded-xl p-4 md:p-6 transition-all hover:shadow-lg',
} as const;

/**
 * Responsive button utilities
 */
export const responsiveButton = {
  // Size variants
  sm: 'px-3 py-2 text-sm md:px-4 md:py-2',
  md: 'px-4 py-2 text-sm md:px-6 md:py-3 md:text-base',
  lg: 'px-6 py-3 text-base md:px-8 md:py-4 md:text-lg',
  // Full width on mobile
  fullMobile: 'w-full md:w-auto',
  // Icon button
  icon: {
    sm: 'p-2 md:p-2.5',
    md: 'p-2.5 md:p-3',
    lg: 'p-3 md:p-4',
  },
} as const;

/**
 * Responsive navigation utilities
 */
export const responsiveNav = {
  // Mobile menu
  mobileMenu: 'fixed inset-0 z-50 bg-background md:relative md:inset-auto md:bg-transparent',
  // Desktop nav
  desktopNav: 'hidden md:flex md:items-center md:gap-6',
  // Mobile toggle
  mobileToggle: 'block md:hidden',
} as const;

/**
 * Responsive form utilities
 */
export const responsiveForm = {
  // Form container
  container: 'space-y-4 md:space-y-6',
  // Form grid (for multi-column forms)
  grid: {
    2: 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6',
    3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
  },
  // Input sizing
  input: 'w-full px-3 py-2 text-sm md:px-4 md:py-2.5 md:text-base',
  // Label sizing
  label: 'text-sm md:text-base font-medium',
} as const;

/**
 * Responsive modal/dialog utilities
 */
export const responsiveModal = {
  // Modal container
  container: 'w-full max-w-[calc(100%-2rem)] sm:max-w-lg md:max-w-2xl lg:max-w-4xl',
  // Modal padding
  padding: 'p-4 sm:p-6 md:p-8',
  // Full screen on mobile
  fullscreen: 'fixed inset-0 md:relative md:inset-auto md:rounded-lg',
} as const;

/**
 * Responsive table utilities
 */
export const responsiveTable = {
  // Scrollable table wrapper
  wrapper: 'overflow-x-auto -mx-4 sm:mx-0',
  // Table with responsive text
  table: 'w-full text-sm md:text-base',
  // Stack table on mobile (card-like)
  stack: 'block md:table',
  stackRow: 'block md:table-row border-b md:border-b-0',
  stackCell: 'block md:table-cell py-2 md:py-4',
} as const;

/**
 * Utility function to combine responsive classes
 */
export const combineResponsive = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Utility function to get responsive value based on breakpoint
 */
export const getResponsiveValue = <T,>(
  values: Partial<Record<Breakpoint, T>>,
  defaultValue: T
): T => {
  // This would be used with a hook in components
  // For now, returns default
  return defaultValue;
};

/**
 * Responsive padding utility generator
 */
export const getResponsivePadding = (
  mobile: number,
  tablet: number,
  desktop: number
): string => {
  return `p-${mobile} md:p-${tablet} lg:p-${desktop}`;
};

/**
 * Responsive margin utility generator
 */
export const getResponsiveMargin = (
  mobile: number,
  tablet: number,
  desktop: number
): string => {
  return `m-${mobile} md:m-${tablet} lg:m-${desktop}`;
};

/**
 * Media query helpers for use in styled components or CSS-in-JS
 */
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
  // Max-width queries
  maxSm: `@media (max-width: ${breakpoints.sm - 1}px)`,
  maxMd: `@media (max-width: ${breakpoints.md - 1}px)`,
  maxLg: `@media (max-width: ${breakpoints.lg - 1}px)`,
  maxXl: `@media (max-width: ${breakpoints.xl - 1}px)`,
} as const;

/**
 * Touch device utilities
 */
export const touchDevice = {
  // Larger touch targets
  touchTarget: 'min-h-[44px] min-w-[44px]',
  // Touch-friendly spacing
  touchSpacing: 'gap-4',
  // Disable hover effects on touch
  hoverNonTouch: 'hover:bg-accent [@media(hover:none)]:hover:bg-transparent',
} as const;

/**
 * Print utilities
 */
export const printUtilities = {
  hide: 'print:hidden',
  show: 'print:block',
  pageBreak: 'print:break-after-page',
  noBreak: 'print:break-inside-avoid',
} as const;

const responsiveUtils = {
  breakpoints,
  containerClasses,
  responsiveGrid,
  responsiveFlex,
  responsiveSpacing,
  responsiveText,
  responsiveVisibility,
  responsiveImage,
  responsiveCard,
  responsiveButton,
  responsiveNav,
  responsiveForm,
  responsiveModal,
  responsiveTable,
  combineResponsive,
  getResponsiveValue,
  mediaQueries,
  touchDevice,
  printUtilities,
};

export default responsiveUtils;
