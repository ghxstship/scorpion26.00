/**
 * Design Tokens - Single Source of Truth
 * 
 * Centralized design tokens for consistent spacing, typography, colors, and more.
 * All components should reference these tokens instead of hardcoded values.
 */

export const designTokens = {
  /**
   * Spacing Scale (8px base unit)
   * Use these for padding, margin, gap, etc.
   */
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
  },

  /**
   * Typography Scale
   * Based on modular scale (1.25 ratio)
   */
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },

  /**
   * Line Heights
   */
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  /**
   * Font Weights
   */
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  /**
   * Letter Spacing
   */
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  /**
   * Border Radius
   */
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  /**
   * Shadows
   */
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  /**
   * Transitions
   */
  transitionDuration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  transitionTimingFunction: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  /**
   * Breakpoints (mobile-first)
   */
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  /**
   * Z-Index Scale
   */
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
  },

  /**
   * Container Widths
   */
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },

  /**
   * Icon Sizes
   */
  iconSize: {
    xs: '1rem',      // 16px
    sm: '1.25rem',   // 20px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '2.5rem',    // 40px
    '2xl': '3rem',   // 48px
  },

  /**
   * Button Heights
   */
  buttonHeight: {
    sm: '2rem',      // 32px
    md: '2.5rem',    // 40px
    lg: '2.75rem',   // 44px
    xl: '3rem',      // 48px
  },

  /**
   * Card Padding
   */
  cardPadding: {
    mobile: '1rem',      // 16px
    desktop: '1.5rem',   // 24px
  },

  /**
   * Section Padding (vertical)
   */
  sectionPadding: {
    mobile: {
      sm: '3rem',      // 48px
      md: '4rem',      // 64px
      lg: '5rem',      // 80px
    },
    desktop: {
      sm: '4rem',      // 64px
      md: '5rem',      // 80px
      lg: '6rem',      // 96px
    },
  },
} as const;

/**
 * Utility function to get spacing value
 */
export const getSpacing = (size: keyof typeof designTokens.spacing): string => {
  return designTokens.spacing[size];
};

/**
 * Utility function to get font size
 */
export const getFontSize = (size: keyof typeof designTokens.fontSize): string => {
  return designTokens.fontSize[size];
};

/**
 * Utility function to get responsive spacing classes
 */
export const getResponsiveSpacing = (
  mobile: keyof typeof designTokens.spacing,
  desktop: keyof typeof designTokens.spacing
): string => {
  return `${mobile} lg:${desktop}`;
};

/**
 * Tailwind class generator for consistent spacing
 */
export const spacingClasses = {
  // Section padding (vertical)
  sectionY: {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-20',
    lg: 'py-20 md:py-24',
  },
  // Container padding (horizontal)
  containerX: 'px-4 md:px-6 lg:px-8',
  // Card padding
  card: 'p-4 md:p-6',
  // Gap spacing
  gap: {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  },
  // Margin bottom
  mb: {
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-8',
    xl: 'mb-12',
  },
  // Margin top
  mt: {
    sm: 'mt-4',
    md: 'mt-6',
    lg: 'mt-8',
    xl: 'mt-12',
  },
};

/**
 * Typography class generator
 * Uses brand typography font families from CSS variables
 */
export const typographyClasses = {
  // Display (Hero headings) - Uses title font
  display: {
    sm: 'font-title text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight',
    md: 'font-title text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight',
    lg: 'font-title text-6xl sm:text-7xl md:text-8xl font-bold leading-tight tracking-tight',
  },
  // Headings - Uses heading font
  h1: 'font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight',
  h2: 'font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight',
  h3: 'font-heading text-xl sm:text-2xl md:text-3xl font-semibold leading-snug tracking-tight',
  h4: 'font-heading text-lg sm:text-xl md:text-2xl font-semibold leading-snug',
  h5: 'font-heading text-base sm:text-lg md:text-xl font-semibold leading-snug',
  h6: 'font-heading text-sm sm:text-base md:text-lg font-semibold leading-snug',
  // Body text - Uses body font
  body: {
    lg: 'font-body text-lg md:text-xl leading-relaxed',
    md: 'font-body text-base md:text-lg leading-relaxed',
    sm: 'font-body text-sm md:text-base leading-normal',
    xs: 'font-body text-xs md:text-sm leading-normal',
  },
  // Special
  caption: 'font-caption text-xs text-muted-foreground leading-normal',
  label: 'font-body text-sm font-medium leading-none',
  button: 'font-button text-sm font-semibold leading-none tracking-wide',
};

/**
 * Responsive grid classes
 */
export const gridClasses = {
  // Product/Card grids
  cards: {
    '2col': 'grid grid-cols-1 md:grid-cols-2 gap-6',
    '3col': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    '4col': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
  },
  // Feature grids
  features: {
    '2col': 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12',
    '3col': 'grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8',
  },
};

/**
 * Section padding classes
 * Standardized vertical padding for sections
 */
export const sectionClasses = {
  sm: 'py-12 md:py-16',  // Small sections (48px → 64px)
  md: 'py-16 md:py-20',  // Medium sections (64px → 80px)
  lg: 'py-20 md:py-24',  // Large sections (80px → 96px)
  xl: 'py-24 md:py-32',  // Extra large sections (96px → 128px)
};

/**
 * Hero section classes
 * Standardized minimum heights for hero sections
 */
export const heroClasses = {
  sm: 'min-h-[35vh] sm:min-h-[40vh]',  // Small hero
  md: 'min-h-[40vh] sm:min-h-[50vh]',  // Medium hero
  lg: 'min-h-[50vh] sm:min-h-[60vh]',  // Large hero
  xl: 'min-h-[60vh] sm:min-h-[70vh]',  // Extra large hero
};

/**
 * Form layout classes
 * Common form responsive patterns
 */
export const formClasses = {
  inline: 'flex flex-col gap-3 sm:flex-row',      // Stack on mobile, inline on desktop
  stacked: 'flex flex-col gap-4',                  // Always stacked
  inlineWithGap: 'flex flex-col gap-4 sm:flex-row sm:gap-3', // With larger gap
};

/**
 * Container classes
 * Standardized container with responsive padding
 */
export const containerClasses = {
  default: 'container mx-auto px-4 sm:px-6 lg:px-8',  // Standard container
  tight: 'container mx-auto px-4 sm:px-6',            // Tighter padding
  wide: 'container mx-auto px-6 sm:px-8 lg:px-12',   // Wider padding
};

export default designTokens;
