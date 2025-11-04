# Brand White-Labeling System

## Overview

This document describes the comprehensive white-labeling system that allows for easy customization of typography, colors, imagery, styles, and overall appearance. The system is designed for backend configuration and supports multiple brand presets.

## Architecture

### Core Components

1. **Type Definitions** (`lib/branding/types.ts`)
   - `TypographyConfig`: Font families, sizes, weights, line heights, letter spacing
   - `ColorScheme`: Primary, secondary, accent, background, text, and status colors
   - `ImageryConfig`: Logos, hero images, patterns, placeholders
   - `StyleConfig`: Border radius, shadows, transitions, spacing, containers
   - `BrandTheme`: Complete theme configuration
   - `BrandConfig`: Configuration manager for multiple themes

2. **Brand Configuration** (`lib/branding/brand-config.ts`)
   - Theme management functions
   - CSS variable generation
   - Google Fonts import generation
   - Active theme selection

3. **Brand Context** (`lib/branding/brand-context.tsx`)
   - React Context for theme state
   - Dark mode management
   - Dynamic CSS variable injection
   - Font loading

4. **Typography Components** (`components/branding/typography.tsx`)
   - Pre-styled components for consistent typography
   - Automatic font family application

5. **Theme Switcher** (`components/branding/theme-switcher.tsx`)
   - UI for switching between themes
   - Dark mode toggle

## Current Preset: Scorpion Fitness

### Typography Hierarchy

Based on the provided design specification:

- **Title**: Anton SC - Bold, condensed display font
  - Size: 4.5rem (72px)
  - Usage: Main page titles, hero headlines
  - Characteristics: Uppercase, tight letter spacing

- **Subtitle**: Contrail One - Italic, flowing
  - Size: 1.5rem (24px)
  - Usage: Taglines, subheadings
  - Characteristics: Italic, regular weight

- **Heading 1**: Bebas Neue - Athletic, bold
  - Size: 3.5rem (56px)
  - Usage: Section headers, major headings
  - Characteristics: Uppercase, wide letter spacing

- **Heading 2**: Bebas Neue
  - Size: 2.5rem (40px)
  - Usage: Subsection headers
  - Characteristics: Uppercase, wide letter spacing

- **Heading 3**: Oswald - Strong, condensed
  - Size: 2rem (32px)
  - Usage: Card titles, component headers
  - Characteristics: Uppercase, medium weight

- **Body**: Roboto Mono - Technical, readable
  - Size: 1rem (16px)
  - Usage: Body text, descriptions, content
  - Characteristics: Monospace, regular weight

### Color Scheme

#### Light Mode
- **Primary**: #8B0000 (Crimson Red)
- **Secondary**: #2A2A2A (Charcoal)
- **Accent**: #FF4444 (Bright Red)
- **Background**: #FFFFFF (White)
- **Text**: #0D0D0D (Near Black)

#### Dark Mode
- **Primary**: #8B0000 (Crimson Red)
- **Secondary**: #2A2A2A (Charcoal)
- **Accent**: #FF4444 (Bright Red)
- **Background**: #0D0D0D (Deep Black)
- **Text**: #FFFFFF (White)

## Usage Guide

### 1. Using Typography Components

```tsx
import {
  BrandTitle,
  BrandSubtitle,
  BrandH1,
  BrandH2,
  BrandH3,
  BrandBody,
} from '@/components/branding/typography';

function MyComponent() {
  return (
    <div>
      <BrandTitle>Transform Your Body</BrandTitle>
      <BrandSubtitle>In Just 90 Days</BrandSubtitle>
      <BrandH1>Our Programs</BrandH1>
      <BrandH2>Strength Training</BrandH2>
      <BrandH3>Beginner Level</BrandH3>
      <BrandBody>
        Start your fitness journey with our comprehensive program...
      </BrandBody>
    </div>
  );
}
```

### 2. Using Brand Hooks

```tsx
import { useTypography, useColors, useImagery, useStyle } from '@/lib/branding/brand-context';

function CustomComponent() {
  const typography = useTypography();
  const colors = useColors();
  const imagery = useImagery();
  const style = useStyle();

  return (
    <div style={{ 
      fontFamily: typography.heading1,
      color: colors.primary.DEFAULT,
      borderRadius: style.borderRadius.lg 
    }}>
      Custom styled content
    </div>
  );
}
```

### 3. Accessing Theme Configuration

```tsx
import { useBrand } from '@/lib/branding/brand-context';

function ThemeInfo() {
  const { theme, activeThemeId, isDarkMode } = useBrand();
  
  return (
    <div>
      <p>Active Theme: {theme.name}</p>
      <p>Theme ID: {activeThemeId}</p>
      <p>Dark Mode: {isDarkMode ? 'On' : 'Off'}</p>
    </div>
  );
}
```

### 4. Using CSS Variables

The system automatically injects CSS variables that can be used in stylesheets:

```css
.my-custom-class {
  font-family: var(--font-title);
  font-size: var(--text-h1);
  color: var(--color-primary);
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
}
```

### 5. Adding Theme Switcher to UI

```tsx
import { ThemeSwitcher } from '@/components/branding/theme-switcher';

function Header() {
  return (
    <header>
      <nav>
        {/* Your navigation */}
      </nav>
      <ThemeSwitcher />
    </header>
  );
}
```

## Creating a New Brand Preset

### Step 1: Define the Theme

Create a new file in `lib/branding/presets/`:

```typescript
import { BrandTheme } from '../types';

export const myBrandPreset: BrandTheme = {
  id: 'my-brand',
  name: 'My Brand Name',
  description: 'Brand description',
  
  typography: {
    title: '"Your Title Font", sans-serif',
    subtitle: '"Your Subtitle Font", sans-serif',
    heading1: '"Your H1 Font", sans-serif',
    heading2: '"Your H2 Font", sans-serif',
    heading3: '"Your H3 Font", sans-serif',
    heading4: '"Your H4 Font", sans-serif',
    body: '"Your Body Font", sans-serif',
    button: '"Your Button Font", sans-serif',
    caption: '"Your Caption Font", sans-serif',
    
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    sizes: {
      title: '4rem',
      subtitle: '1.5rem',
      h1: '3rem',
      h2: '2.25rem',
      h3: '1.875rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1.125rem',
      body: '1rem',
      bodyLarge: '1.125rem',
      bodySmall: '0.875rem',
      button: '1rem',
      caption: '0.75rem',
    },
    
    lineHeights: {
      tight: '1.1',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    },
    
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
        DEFAULT: '#000000',
        foreground: '#FFFFFF',
        light: '#333333',
        dark: '#000000',
      },
      // ... define all color properties
    },
    dark: {
      // ... define dark mode colors
    },
  },
  
  imagery: {
    logo: {
      primary: '/branding/my-brand/logo.svg',
      // ... other logo variants
    },
    hero: {
      home: '/branding/my-brand/hero-home.jpg',
      // ... other hero images
    },
    patterns: {},
    placeholders: {},
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
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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
    /* Custom CSS for your brand */
  `,
};
```

### Step 2: Register the Theme

Update `lib/branding/brand-config.ts`:

```typescript
import { myBrandPreset } from './presets/my-brand-preset';

export const defaultBrandConfig: BrandConfig = {
  activeTheme: 'scorpion', // or 'my-brand'
  themes: {
    scorpion: scorpionPreset,
    'my-brand': myBrandPreset,
  },
};
```

### Step 3: Export the Preset

Update `lib/branding/index.ts`:

```typescript
export { myBrandPreset } from './presets/my-brand-preset';
```

## Backend Integration

### Environment-Based Theme Selection

Set the active theme via environment variable:

```env
NEXT_PUBLIC_ACTIVE_THEME=scorpion
```

Update `lib/branding/brand-config.ts`:

```typescript
export const defaultBrandConfig: BrandConfig = {
  activeTheme: process.env.NEXT_PUBLIC_ACTIVE_THEME || 'scorpion',
  themes: {
    scorpion: scorpionPreset,
  },
};
```

### API-Based Theme Configuration

For dynamic theme loading from a database or API:

```typescript
// lib/branding/api.ts
export async function loadBrandConfig(): Promise<BrandConfig> {
  const response = await fetch('/api/brand-config');
  return response.json();
}

// In your app initialization
import { updateBrandConfig } from '@/lib/branding/brand-config';

async function initializeBrand() {
  const config = await loadBrandConfig();
  updateBrandConfig(config);
}
```

## Best Practices

1. **Typography Consistency**: Always use the branded typography components for consistent styling
2. **Color Usage**: Access colors through the `useColors()` hook for theme-aware styling
3. **Responsive Design**: Test all typography sizes on mobile devices
4. **Font Loading**: The system automatically loads Google Fonts; ensure fonts are available
5. **Custom CSS**: Use the `customCSS` property for brand-specific overrides
6. **Dark Mode**: Always define both light and dark color schemes
7. **Accessibility**: Maintain WCAG AA contrast ratios in color schemes

## File Structure

```
lib/branding/
├── types.ts                    # Type definitions
├── brand-config.ts             # Configuration manager
├── brand-context.tsx           # React context & hooks
├── index.ts                    # Main exports
└── presets/
    └── scorpion-preset.ts      # Scorpion Fitness preset

components/branding/
├── typography.tsx              # Typography components
└── theme-switcher.tsx          # Theme switcher UI
```

## Troubleshooting

### Fonts Not Loading
- Check Google Fonts availability
- Verify font names are correctly quoted
- Ensure BrandProvider is wrapping your app

### Colors Not Applying
- Verify BrandProvider is mounted
- Check CSS variable names match
- Ensure dark mode class is toggling

### Theme Not Switching
- Confirm theme ID exists in configuration
- Check for console errors
- Verify setActiveTheme is being called

## Future Enhancements

- [ ] Visual theme editor UI
- [ ] Theme preview mode
- [ ] Import/export theme configurations
- [ ] Theme validation and testing tools
- [ ] Multi-language font support
- [ ] Advanced typography controls (kerning, tracking)
- [ ] Animation presets per theme
- [ ] Component-level theme overrides
