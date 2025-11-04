# Brand Typography Implementation

## Overview

The Scorpion brand typography is now applied site-wide using a **CSS-based approach** that provides scalability, maintainability, and future-proofing.

## Architecture

### 1. **Brand Preset** (`lib/branding/presets/scorpion-preset.ts`)
Defines the typography configuration:
- **Title**: Anton (bold display font)
- **Subtitle**: Contrail One (italic accent font)
- **Headings**: Bebas Neue (condensed sans-serif)
- **H3/H4**: Oswald (semi-condensed sans-serif)
- **Body**: Roboto Mono (monospace)
- **Buttons**: Bebas Neue

### 2. **CSS Variables** (`app/globals.css`)
Brand fonts are exposed as CSS variables:
```css
--font-title: "Anton", sans-serif;
--font-subtitle: "Contrail One", sans-serif;
--font-heading-1: "Bebas Neue", sans-serif;
--font-body: "Roboto Mono", monospace;
--font-button: "Bebas Neue", sans-serif;
--font-caption: "Roboto Mono", monospace;
```

### 3. **Tailwind Config** (`tailwind.config.ts`)
Maps CSS variables to Tailwind utilities:
```typescript
fontFamily: {
  title: ['var(--font-title)'],
  subtitle: ['var(--font-subtitle)'],
  heading: ['var(--font-heading-1)'],
  body: ['var(--font-body)'],
  button: ['var(--font-button)'],
  caption: ['var(--font-caption)'],
}
```

### 4. **Base Styles** (`app/globals.css`)
Applies brand fonts to HTML elements by default:
- `body` → Roboto Mono
- `h1-h6` → Bebas Neue/Oswald (with appropriate sizes)
- `button` → Bebas Neue

### 5. **Design Tokens** (`lib/design-tokens.ts`)
Typography classes use brand fonts:
```typescript
h1: 'font-heading text-3xl sm:text-4xl md:text-5xl ...'
body: { md: 'font-body text-base md:text-lg ...' }
button: 'font-button text-sm font-semibold ...'
```

### 6. **Atomic Components**
- `<Heading>` → Uses design tokens (automatically gets brand fonts)
- `<Text>` → Uses design tokens (automatically gets brand fonts)
- Brand-specific components still available: `<BrandTitle>`, `<BrandH1>`, etc.

## How It Works

1. **BrandProvider** loads Google Fonts dynamically and injects CSS variables
2. **CSS variables** are referenced in Tailwind config
3. **Tailwind utilities** (`font-heading`, `font-body`) are available everywhere
4. **Base styles** apply fonts to raw HTML elements
5. **Atomic components** use design tokens that reference brand fonts

## Usage

### Option A: Use Atomic Components (Recommended)
```tsx
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';

<Heading level={1}>This uses Bebas Neue</Heading>
<Text variant="body-md">This uses Roboto Mono</Text>
```

### Option B: Use Tailwind Utilities
```tsx
<h1 className="font-heading text-4xl">Bebas Neue heading</h1>
<p className="font-body text-base">Roboto Mono body text</p>
<button className="font-button">Bebas Neue button</button>
```

### Option C: Use Raw HTML (Automatic)
```tsx
<h1>This automatically uses Bebas Neue</h1>
<p>This automatically uses Roboto Mono</p>
<button>This automatically uses Bebas Neue</button>
```

### Option D: Use Brand Components (Explicit)
```tsx
import { BrandTitle, BrandH1, BrandBody } from '@/components/branding/typography';

<BrandTitle>Anton title font</BrandTitle>
<BrandH1>Bebas Neue heading</BrandH1>
<BrandBody>Roboto Mono body</BrandBody>
```

## Benefits

✅ **Single source of truth** - Change fonts in one place (preset)
✅ **No refactoring needed** - Existing components work automatically
✅ **Framework agnostic** - Works with any component library
✅ **Zero runtime overhead** - Pure CSS, no JavaScript
✅ **Theme switching** - Dynamic font loading via BrandProvider
✅ **Type-safe** - TypeScript support throughout
✅ **Scalable** - Easy to add new themes/brands

## Adding a New Brand Theme

1. Create a new preset in `lib/branding/presets/`
2. Define typography configuration
3. BrandProvider automatically loads fonts and injects CSS variables
4. All components automatically use the new fonts

## Font Loading

Fonts are loaded from Google Fonts via the `BrandProvider`:
- Dynamically generates Google Fonts URL
- Injects `<link>` tag into document head
- Updates when theme changes
- Includes all required font weights (300-900)

## Fallbacks

If fonts fail to load, the system falls back to:
- `sans-serif` for headings
- `monospace` for body text
- System fonts as final fallback
