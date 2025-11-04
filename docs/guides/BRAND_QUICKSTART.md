# Brand White-Label System - Quick Start Guide

## What Was Created

A comprehensive white-labeling system that allows easy customization of:
- ✅ Typography (fonts, sizes, weights, spacing)
- ✅ Color schemes (light & dark modes)
- ✅ Imagery (logos, hero images, patterns)
- ✅ Styles (borders, shadows, transitions, spacing)

## Current Implementation: Scorpion Fitness Preset

Based on your provided design, the following typography hierarchy is now active:

- **Title**: Anton SC (72px) - Main headlines
- **Subtitle**: Contrail One (24px) - Taglines
- **Heading 1**: Bebas Neue (56px) - Section headers
- **Heading 2**: Bebas Neue (40px) - Subsection headers
- **Heading 3**: Oswald (32px) - Component headers
- **Body**: Roboto Mono (16px) - Body text

## Quick Usage

### 1. Use Typography Components

```tsx
import {
  BrandTitle,
  BrandH1,
  BrandH2,
  BrandH3,
  BrandBody,
} from '@/components/branding/typography';

<BrandTitle>TRANSFORM YOUR BODY</BrandTitle>
<BrandH1>OUR PROGRAMS</BrandH1>
<BrandBody>Your content here...</BrandBody>
```

### 2. Access Theme Data

```tsx
import { useBrand, useColors, useTypography } from '@/lib/branding';

const { theme, isDarkMode } = useBrand();
const colors = useColors();
const typography = useTypography();
```

### 3. Add Theme Switcher

```tsx
import { ThemeSwitcher } from '@/components/branding/theme-switcher';

<ThemeSwitcher /> // Adds dark mode toggle and theme selector
```

## View the Demo

Visit `/brand-demo` to see all typography styles in action.

## File Structure

```
lib/branding/
├── types.ts                    # TypeScript definitions
├── brand-config.ts             # Theme management
├── brand-context.tsx           # React hooks
├── index.ts                    # Exports
└── presets/
    └── scorpion-preset.ts      # Current theme

components/branding/
├── typography.tsx              # Typography components
└── theme-switcher.tsx          # UI controls
```

## Creating a New Brand

1. Copy `lib/branding/presets/scorpion-preset.ts`
2. Rename and modify the configuration
3. Register in `lib/branding/brand-config.ts`
4. Set as active theme

## Key Features

- **Automatic Font Loading**: Google Fonts are loaded automatically
- **CSS Variables**: All theme values available as CSS vars
- **Dark Mode**: Built-in dark mode support
- **Type Safety**: Full TypeScript support
- **React Hooks**: Easy access to theme data
- **Hot Swapping**: Switch themes without page reload

## Next Steps

1. Review `BRAND_WHITE_LABEL_SYSTEM.md` for complete documentation
2. Customize the Scorpion preset or create a new one
3. Add imagery assets to `/public/branding/`
4. Update components to use branded typography

## Notes

- The system is integrated into the root layout
- All fonts load from Google Fonts
- Theme changes persist in localStorage
- ESLint warnings in demo page are cosmetic (apostrophe escaping)
