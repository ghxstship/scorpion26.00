# Atomic Design Implementation Guide

## Overview

This guide documents the atomic design system implementation for consistent UI/UX across the application.

---

## Design Token System

### Location
`/lib/design-tokens.ts`

### Usage

```typescript
import { designTokens, spacingClasses, typographyClasses, gridClasses } from '@/lib/design-tokens';

// Use spacing classes
<div className={spacingClasses.sectionY.lg}>
  <div className={spacingClasses.containerX}>
    {/* Content */}
  </div>
</div>

// Use typography classes
<h1 className={typographyClasses.h1}>Heading</h1>
<p className={typographyClasses.body.md}>Body text</p>

// Use grid classes
<div className={gridClasses.cards['3col']}>
  {/* Cards */}
</div>
```

### Key Principles

1. **Always use design tokens** instead of arbitrary values
2. **Consistent spacing scale**: 4/8/12/16/24/32/48/64/96/128px
3. **Responsive by default**: Mobile-first approach
4. **Typography scale**: 12/14/16/18/20/24/30/36/48/60/72px

---

## Atomic Component Library

### Atoms (Basic Building Blocks)

#### Icon
**Location:** `/components/atoms/icon.tsx`

```typescript
import { Icon } from '@/components/atoms/icon';
import { Star } from 'lucide-react';

<Icon icon={Star} size="md" className="text-primary" aria-hidden={true} />
```

**Sizes:** `xs` | `sm` | `md` | `lg` | `xl` | `2xl`

#### Text
**Location:** `/components/atoms/text.tsx`

```typescript
import { Text } from '@/components/atoms/text';

<Text variant="body-md">This is body text</Text>
<Text variant="caption" className="text-muted-foreground">Caption text</Text>
```

**Variants:** `body-lg` | `body-md` | `body-sm` | `body-xs` | `caption` | `label` | `button`

#### Heading
**Location:** `/components/atoms/heading.tsx`

```typescript
import { Heading } from '@/components/atoms/heading';

<Heading level={1}>Page Title</Heading>
<Heading level={2}>Section Title</Heading>
<Heading level={1} display="lg">Hero Heading</Heading>
```

**Levels:** `1` | `2` | `3` | `4` | `5` | `6`  
**Display sizes:** `sm` | `md` | `lg` (for hero sections)

#### Rating
**Location:** `/components/atoms/rating.tsx`

```typescript
import { Rating } from '@/components/atoms/rating';

<Rating rating={4.5} size="md" showValue={true} />
```

**Sizes:** `sm` | `md` | `lg`

---

### Molecules (Simple Component Combinations)

#### IconWithLabel
**Location:** `/components/molecules/icon-with-label.tsx`

```typescript
import { IconWithLabel } from '@/components/molecules/icon-with-label';
import { Users } from 'lucide-react';

<IconWithLabel 
  icon={Users} 
  label="Team Members" 
  orientation="horizontal"
/>
```

#### StatCard
**Location:** `/components/molecules/stat-card.tsx`

```typescript
import { StatCard } from '@/components/molecules/stat-card';
import { Users } from 'lucide-react';

<StatCard
  icon={Users}
  value="100K+"
  label="Members"
  iconColor="text-primary"
  iconBgColor="bg-primary/10"
/>
```

#### FeatureItem
**Location:** `/components/molecules/feature-item.tsx`

```typescript
import { FeatureItem } from '@/components/molecules/feature-item';
import { Check } from 'lucide-react';

<FeatureItem
  icon={Check}
  title="Feature Name"
  description="Feature description"
  variant="success"
/>
```

**Variants:** `default` | `success` | `muted`

#### PriceDisplay
**Location:** `/components/molecules/price-display.tsx`

```typescript
import { PriceDisplay } from '@/components/molecules/price-display';

<PriceDisplay
  price={99}
  period="monthly"
  showDiscount={true}
  discountPercent={17}
  size="lg"
/>
```

**Periods:** `weekly` | `monthly` | `annual` | `one-time`  
**Sizes:** `sm` | `md` | `lg`

---

## Spacing System

### Section Padding (Vertical)

```typescript
// Small sections
className={spacingClasses.sectionY.sm}  // py-12 md:py-16

// Medium sections
className={spacingClasses.sectionY.md}  // py-16 md:py-20

// Large sections (most common)
className={spacingClasses.sectionY.lg}  // py-20 md:py-24
```

### Container Padding (Horizontal)

```typescript
// Always use this for container horizontal padding
className={spacingClasses.containerX}  // px-4 md:px-6 lg:px-8
```

### Card Padding

```typescript
// Use on CardHeader, CardContent, CardFooter
className={spacingClasses.card}  // p-4 md:p-6
```

### Gap Spacing

```typescript
// Small gaps (between inline elements)
className={spacingClasses.gap.sm}  // gap-2

// Medium gaps (between cards, list items)
className={spacingClasses.gap.md}  // gap-4

// Large gaps (between sections)
className={spacingClasses.gap.lg}  // gap-6

// Extra large gaps
className={spacingClasses.gap.xl}  // gap-8
```

### Margin Utilities

```typescript
// Bottom margins
className={spacingClasses.mb.sm}  // mb-4
className={spacingClasses.mb.md}  // mb-6
className={spacingClasses.mb.lg}  // mb-8
className={spacingClasses.mb.xl}  // mb-12

// Top margins
className={spacingClasses.mt.sm}  // mt-4
className={spacingClasses.mt.md}  // mt-6
className={spacingClasses.mt.lg}  // mt-8
className={spacingClasses.mt.xl}  // mt-12
```

---

## Typography System

### Display Text (Hero Sections)

```typescript
<Heading level={1} display="sm">  // text-4xl sm:text-5xl md:text-6xl
<Heading level={1} display="md">  // text-5xl sm:text-6xl md:text-7xl
<Heading level={1} display="lg">  // text-6xl sm:text-7xl md:text-8xl
```

### Headings

```typescript
<Heading level={1}>  // text-3xl sm:text-4xl md:text-5xl
<Heading level={2}>  // text-2xl sm:text-3xl md:text-4xl
<Heading level={3}>  // text-xl sm:text-2xl md:text-3xl
<Heading level={4}>  // text-lg sm:text-xl md:text-2xl
<Heading level={5}>  // text-base sm:text-lg md:text-xl
<Heading level={6}>  // text-sm sm:text-base md:text-lg
```

### Body Text

```typescript
<Text variant="body-lg">  // text-lg md:text-xl
<Text variant="body-md">  // text-base md:text-lg (default)
<Text variant="body-sm">  // text-sm md:text-base
<Text variant="body-xs">  // text-xs md:text-sm
```

### Special Text

```typescript
<Text variant="caption">   // text-xs text-muted-foreground
<Text variant="label">     // text-sm font-medium
<Text variant="button">    // text-sm font-semibold tracking-wide
```

---

## Grid System

### Card Grids

```typescript
// 2-column grid
<div className={gridClasses.cards['2col']}>
  // grid grid-cols-1 md:grid-cols-2 gap-6
</div>

// 3-column grid (most common)
<div className={gridClasses.cards['3col']}>
  // grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
</div>

// 4-column grid
<div className={gridClasses.cards['4col']}>
  // grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6
</div>
```

### Feature Grids

```typescript
// 2-column feature grid
<div className={gridClasses.features['2col']}>
  // grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12
</div>

// 3-column feature grid
<div className={gridClasses.features['3col']}>
  // grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8
</div>
```

---

## Button System

### Sizes

```typescript
<Button size="sm">    // h-8 px-3 text-sm
<Button size="default"> // h-10 px-4 text-sm
<Button size="lg">    // h-11 px-8 text-sm
<Button size="xl">    // h-12 px-10 text-base
<Button size="icon">  // h-10 w-10
```

### Variants

```typescript
<Button variant="default">     // Primary action
<Button variant="secondary">   // Secondary action
<Button variant="outline">     // Outlined button
<Button variant="ghost">       // Minimal button
<Button variant="destructive"> // Danger action
<Button variant="link">        // Link-style button
```

---

## Card System

### Standard Card Structure

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

### Card Padding

- **Default:** `p-4 md:p-6` (responsive)
- **Override:** Use `className={spacingClasses.card}` for consistency

---

## Responsive Design Patterns

### Breakpoints

```typescript
sm:  640px   // Small devices (tablets)
md:  768px   // Medium devices (small laptops)
lg:  1024px  // Large devices (desktops)
xl:  1280px  // Extra large devices
2xl: 1536px  // Ultra-wide screens
```

### Mobile-First Approach

Always start with mobile styles, then add responsive variants:

```typescript
// ❌ Wrong
<div className="lg:text-base text-sm">

// ✅ Correct
<div className="text-sm lg:text-base">
```

### Common Responsive Patterns

```typescript
// Responsive flex direction
className="flex flex-col md:flex-row"

// Responsive grid columns
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Responsive spacing
className="py-12 md:py-16 lg:py-20"

// Responsive text size
className="text-base md:text-lg lg:text-xl"

// Responsive gap
className="gap-4 md:gap-6 lg:gap-8"
```

---

## Accessibility Guidelines

### Icons

```typescript
// Decorative icons (hidden from screen readers)
<Icon icon={Star} aria-hidden={true} />

// Meaningful icons (with label)
<Icon icon={Star} aria-label="Rating star" />
```

### Headings

- Use semantic heading levels (`<h1>` through `<h6>`)
- Don't skip heading levels
- Use `Heading` component for consistent styling

### Color Contrast

- Ensure WCAG AA compliance (4.5:1 for normal text)
- Test color combinations in both light and dark modes
- Use semantic color tokens (`text-primary`, `text-muted-foreground`)

### Focus States

- All interactive elements have visible focus indicators
- Don't remove focus outlines
- Use `focus-visible:` for keyboard-only focus

---

## Migration Checklist

When refactoring an existing component:

- [ ] Replace hardcoded spacing with `spacingClasses`
- [ ] Replace hardcoded typography with `typographyClasses` or atomic components
- [ ] Use `Icon` atom instead of direct Lucide imports
- [ ] Use `Text` and `Heading` atoms for text content
- [ ] Replace inline feature lists with `FeatureItem` molecule
- [ ] Replace inline stats with `StatCard` molecule
- [ ] Use `Rating` atom for star ratings
- [ ] Apply consistent card padding with `spacingClasses.card`
- [ ] Use grid classes for layouts
- [ ] Ensure responsive breakpoints follow mobile-first approach
- [ ] Add proper ARIA labels for accessibility
- [ ] Test in both light and dark modes

---

## Examples

### Before (Inconsistent)

```typescript
<div className="py-24 px-4">
  <div className="grid gap-8 md:grid-cols-3">
    <div className="flex flex-col items-center">
      <Users className="h-6 w-6 text-primary mb-2" />
      <div className="text-2xl font-bold">100K+</div>
      <div className="text-sm text-gray-500">Members</div>
    </div>
  </div>
</div>
```

### After (Consistent)

```typescript
<div className={`${spacingClasses.sectionY.lg} ${spacingClasses.containerX}`}>
  <div className={gridClasses.features['3col']}>
    <StatCard
      icon={Users}
      value="100K+"
      label="Members"
      iconColor="text-primary"
      iconBgColor="bg-primary/10"
    />
  </div>
</div>
```

---

## Best Practices

1. **Always use atomic components** when available
2. **Never use arbitrary values** - use design tokens
3. **Follow mobile-first** responsive design
4. **Maintain consistent spacing** across all components
5. **Use semantic HTML** with proper heading hierarchy
6. **Ensure accessibility** with ARIA labels and focus states
7. **Test both themes** (light and dark mode)
8. **Keep components small** and focused on single responsibility

---

## Resources

- [Design Tokens](/lib/design-tokens.ts)
- [Atomic Components](/components/atoms/)
- [Molecule Components](/components/molecules/)
- [UI Components](/components/ui/)
- [Tailwind Config](/tailwind.config.ts)
- [Global Styles](/app/globals.css)

---

**Last Updated:** November 3, 2025  
**Version:** 1.0.0
