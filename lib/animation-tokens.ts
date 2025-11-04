/**
 * Animation Design Tokens
 * 
 * Centralized animation values for consistent motion design across the application.
 * All components should reference these tokens for animations and transitions.
 */

export const animationTokens = {
  /**
   * Duration Scale
   * Use these for consistent animation timing
   */
  duration: {
    instant: 100,      // Immediate feedback (checkbox, toggle)
    fast: 200,         // Quick transitions (button hover, focus)
    normal: 300,       // Standard transitions (card hover, modal)
    slow: 500,         // Deliberate animations (section reveal)
    slower: 700,       // Dramatic effects (hero entrance)
    slowest: 1000,     // Special effects (parallax, counters)
  },

  /**
   * Easing Functions
   * Cubic bezier values for different animation feels
   */
  easing: {
    // Standard easings
    linear: [0, 0, 1, 1] as const,
    easeIn: [0.4, 0, 1, 1] as const,
    easeOut: [0, 0, 0.2, 1] as const,
    easeInOut: [0.4, 0, 0.2, 1] as const,
    
    // Sharp easings (quick start/end)
    sharp: [0.4, 0, 0.6, 1] as const,
    
    // Smooth easings (gentle curves)
    smooth: [0.25, 0.1, 0.25, 1] as const,
    
    // Bounce and spring (playful)
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
    
    // Custom easings
    anticipate: [0.36, 0, 0.66, -0.56] as const,
    overshoot: [0.34, 1.56, 0.64, 1] as const,
  },

  /**
   * Spring Configurations
   * For physics-based animations
   */
  spring: {
    // Gentle spring (smooth, natural)
    gentle: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
    // Bouncy spring (playful)
    bouncy: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
      mass: 1,
    },
    // Stiff spring (quick, responsive)
    stiff: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      mass: 1,
    },
    // Soft spring (slow, smooth)
    soft: {
      type: "spring" as const,
      stiffness: 50,
      damping: 20,
      mass: 1,
    },
  },

  /**
   * Stagger Delays
   * For sequential animations in lists/grids
   */
  stagger: {
    fast: 0.02,      // 20ms between items
    normal: 0.05,    // 50ms between items
    slow: 0.1,       // 100ms between items
    slower: 0.15,    // 150ms between items
  },

  /**
   * Viewport Thresholds
   * For scroll-triggered animations
   */
  viewport: {
    // How much of element must be visible to trigger
    minimal: 0.05,   // 5% visible
    partial: 0.25,   // 25% visible
    half: 0.5,       // 50% visible
    most: 0.75,      // 75% visible
    full: 1,         // 100% visible
  },

  /**
   * Scale Values
   * For hover/active states
   */
  scale: {
    subtle: 1.02,    // Barely noticeable
    small: 1.05,     // Gentle lift
    medium: 1.1,     // Noticeable zoom
    large: 1.15,     // Dramatic zoom
    press: 0.95,     // Active press state
    pressHard: 0.9,  // Strong press feedback
  },

  /**
   * Translate Values (in pixels)
   * For hover lift effects
   */
  translate: {
    lift: {
      subtle: -2,    // 2px up
      small: -4,     // 4px up
      medium: -8,    // 8px up
      large: -12,    // 12px up
    },
    slide: {
      small: 4,      // 4px
      medium: 8,     // 8px
      large: 16,     // 16px
      xlarge: 24,    // 24px
    },
  },

  /**
   * Rotate Values (in degrees)
   * For tilt effects
   */
  rotate: {
    subtle: 1,       // 1 degree
    small: 2,        // 2 degrees
    medium: 5,       // 5 degrees
    large: 10,       // 10 degrees
  },

  /**
   * Blur Values (in pixels)
   * For blur-in effects
   */
  blur: {
    small: 4,        // 4px blur
    medium: 8,       // 8px blur
    large: 16,       // 16px blur
  },

  /**
   * Opacity Values
   * For fade effects
   */
  opacity: {
    hidden: 0,
    faint: 0.3,
    half: 0.5,
    visible: 0.7,
    full: 1,
  },
} as const;

/**
 * Tailwind Animation Classes
 * Pre-configured animation utilities for common patterns
 */
export const animationClasses = {
  // Transitions
  transition: {
    all: 'transition-all',
    colors: 'transition-colors',
    opacity: 'transition-opacity',
    transform: 'transition-transform',
    shadow: 'transition-shadow',
  },

  // Duration
  duration: {
    instant: 'duration-100',
    fast: 'duration-200',
    normal: 'duration-300',
    slow: 'duration-500',
    slower: 'duration-700',
  },

  // Easing
  ease: {
    linear: 'ease-linear',
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },

  // Hover effects
  hover: {
    // Lift effects
    lift: {
      subtle: 'hover:-translate-y-0.5 hover:shadow-md',
      small: 'hover:-translate-y-1 hover:shadow-lg',
      medium: 'hover:-translate-y-2 hover:shadow-xl',
      large: 'hover:-translate-y-3 hover:shadow-2xl',
    },
    // Scale effects
    scale: {
      subtle: 'hover:scale-[1.02]',
      small: 'hover:scale-105',
      medium: 'hover:scale-110',
      large: 'hover:scale-[1.15]',
    },
    // Brightness effects
    brighten: 'hover:brightness-110',
    dim: 'hover:brightness-90',
    // Opacity effects
    fadeIn: 'hover:opacity-100',
    fadeOut: 'hover:opacity-70',
  },

  // Active/Press states
  active: {
    scale: {
      subtle: 'active:scale-[0.98]',
      medium: 'active:scale-95',
      strong: 'active:scale-90',
    },
  },

  // Focus states
  focus: {
    ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    glow: 'focus-visible:shadow-[0_0_0_3px_rgba(var(--primary),0.3)]',
  },

  // Loading states
  loading: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
  },
} as const;

/**
 * Utility function to create transition string
 */
export const createTransition = (
  properties: string[] = ['all'],
  duration: keyof typeof animationTokens.duration = 'normal',
  easing: keyof typeof animationTokens.easing = 'easeOut'
): string => {
  const durationMs = animationTokens.duration[duration];
  const easingValue = animationTokens.easing[easing].join(', ');
  
  return properties
    .map(prop => `${prop} ${durationMs}ms cubic-bezier(${easingValue})`)
    .join(', ');
};

/**
 * Utility function to get spring config
 */
export const getSpring = (type: keyof typeof animationTokens.spring = 'gentle') => {
  return animationTokens.spring[type];
};

/**
 * Utility function to combine animation classes
 */
export const combineAnimations = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
};

export default animationTokens;
