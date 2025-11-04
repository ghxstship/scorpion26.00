import { BrandTheme } from '../types';

/**
 * Scorpion Fitness Brand Preset
 * Typography based on the provided design:
 * - Title: Anton
 * - Subtitle: Contrail One
 * - Heading 1: Bebas Neue
 * - Heading 2: Bebas Neue
 * - Heading 3: Oswald
 * - Body: Roboto Mono
 */

export const scorpionPreset: BrandTheme = {
  id: 'scorpion',
  name: 'Scorpion Fitness',
  description: 'Bold, athletic typography with industrial aesthetics',
  
  typography: {
    // Font families
    title: '"Anton", sans-serif',
    subtitle: '"Contrail One", sans-serif',
    heading1: '"Bebas Neue", sans-serif',
    heading2: '"Bebas Neue", sans-serif',
    heading3: '"Oswald", sans-serif',
    heading4: '"Oswald", sans-serif',
    body: '"Roboto Mono", monospace',
    button: '"Bebas Neue", sans-serif',
    caption: '"Roboto Mono", monospace',
    
    // Font weights
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    // Font sizes
    sizes: {
      title: '4.5rem',      // 72px - Anton SC
      subtitle: '1.5rem',   // 24px - Contrail One
      h1: '3.5rem',         // 56px - Bebas Neue
      h2: '2.5rem',         // 40px - Bebas Neue
      h3: '2rem',           // 32px - Oswald
      h4: '1.5rem',         // 24px - Oswald
      h5: '1.25rem',        // 20px
      h6: '1.125rem',       // 18px
      body: '1rem',         // 16px - Roboto Mono
      bodyLarge: '1.125rem', // 18px
      bodySmall: '0.875rem', // 14px
      button: '1.125rem',   // 18px - Bebas Neue
      caption: '0.75rem',   // 12px
    },
    
    // Line heights
    lineHeights: {
      tight: '1.1',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    },
    
    // Letter spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  colors: {
    light: {
      primary: {
        DEFAULT: '#8B0000',
        foreground: '#FFFFFF',
        light: '#FF4444',
        dark: '#5A0000',
      },
      secondary: {
        DEFAULT: '#2A2A2A',
        foreground: '#FFFFFF',
        light: '#5A5A5A',
        dark: '#0D0D0D',
      },
      accent: {
        DEFAULT: '#FF4444',
        foreground: '#FFFFFF',
        light: '#FF6666',
        dark: '#CC0000',
      },
      background: {
        DEFAULT: '#FFFFFF',
        secondary: '#F5F5F5',
        tertiary: '#E8E8E8',
      },
      text: {
        primary: '#0D0D0D',
        secondary: '#5A5A5A',
        tertiary: '#8A8A8A',
        inverse: '#FFFFFF',
      },
      border: '#E0E0E0',
      input: '#E8E8E8',
      ring: '#8B0000',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    dark: {
      primary: {
        DEFAULT: '#8B0000',
        foreground: '#FFFFFF',
        light: '#FF4444',
        dark: '#5A0000',
      },
      secondary: {
        DEFAULT: '#2A2A2A',
        foreground: '#FFFFFF',
        light: '#5A5A5A',
        dark: '#0D0D0D',
      },
      accent: {
        DEFAULT: '#FF4444',
        foreground: '#FFFFFF',
        light: '#FF6666',
        dark: '#CC0000',
      },
      background: {
        DEFAULT: '#0D0D0D',
        secondary: '#1A1A1A',
        tertiary: '#2A2A2A',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#D9D9D9',
        tertiary: '#8A8A8A',
        inverse: '#0D0D0D',
      },
      border: '#2A2A2A',
      input: '#2A2A2A',
      ring: '#8B0000',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  
  imagery: {
    logo: {
      primary: '/branding/scorpion/logo-primary.svg',
      secondary: '/branding/scorpion/logo-secondary.svg',
      icon: '/branding/scorpion/logo-icon.svg',
      white: '/branding/scorpion/logo-white.svg',
      black: '/branding/scorpion/logo-black.svg',
    },
    hero: {
      home: '/branding/scorpion/hero-home.jpg',
      about: '/branding/scorpion/hero-about.jpg',
      programs: '/branding/scorpion/hero-programs.jpg',
      shop: '/branding/scorpion/hero-shop.jpg',
      community: '/branding/scorpion/hero-community.jpg',
    },
    patterns: {
      primary: '/branding/scorpion/pattern-primary.svg',
      secondary: '/branding/scorpion/pattern-secondary.svg',
      texture: '/branding/scorpion/texture.jpg',
    },
    placeholders: {
      avatar: '/branding/scorpion/placeholder-avatar.jpg',
      product: '/branding/scorpion/placeholder-product.jpg',
      thumbnail: '/branding/scorpion/placeholder-thumbnail.jpg',
    },
  },
  
  style: {
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },
    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      '2xl': '4rem',
      '3xl': '6rem',
    },
    containers: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      full: '100%',
    },
  },
  
  customCSS: `
    /* Scorpion Fitness Custom Styles */
    
    /* Title styling - Anton */
    .brand-title {
      font-family: "Anton", sans-serif;
      font-size: 4.5rem;
      font-weight: 400;
      line-height: 1.1;
      letter-spacing: -0.025em;
      text-transform: uppercase;
    }
    
    /* Subtitle styling - Contrail One */
    .brand-subtitle {
      font-family: "Contrail One", sans-serif;
      font-size: 1.5rem;
      font-weight: 400;
      font-style: italic;
      line-height: 1.5;
    }
    
    /* Heading 1 - Bebas Neue */
    .brand-h1 {
      font-family: "Bebas Neue", sans-serif;
      font-size: 3.5rem;
      font-weight: 400;
      line-height: 1.1;
      letter-spacing: 0.025em;
      text-transform: uppercase;
    }
    
    /* Heading 2 - Bebas Neue */
    .brand-h2 {
      font-family: "Bebas Neue", sans-serif;
      font-size: 2.5rem;
      font-weight: 400;
      line-height: 1.2;
      letter-spacing: 0.025em;
      text-transform: uppercase;
    }
    
    /* Heading 3 - Oswald */
    .brand-h3 {
      font-family: "Oswald", sans-serif;
      font-size: 2rem;
      font-weight: 500;
      line-height: 1.3;
      text-transform: uppercase;
    }
    
    /* Body text - Roboto Mono */
    .brand-body {
      font-family: "Roboto Mono", monospace;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
    }
    
    /* Responsive typography */
    @media (max-width: 768px) {
      .brand-title {
        font-size: 2.5rem;
      }
      .brand-h1 {
        font-size: 2rem;
      }
      .brand-h2 {
        font-size: 1.75rem;
      }
      .brand-h3 {
        font-size: 1.5rem;
      }
    }
  `,
};
