# Responsive Design Guidelines

**Date:** November 4, 2025  
**Status:** Official Design System Guidelines

---

## Overview

This document provides official guidelines for implementing responsive designs in the Scorpion26.00 codebase. All developers must follow these standards to ensure consistency across the application.

---

## Design Token System

### Always Use Design Tokens

**✅ DO:**
```tsx
import { containerClasses, sectionClasses, heroClasses } from "@/lib/design-tokens";

<section className={sectionClasses.md}>
  <div className={containerClasses.default}>
    {/* content */}
  </div>
</section>
```

**❌ DON'T:**
```tsx
// Avoid inline responsive classes
<section className="py-16 sm:py-20 md:py-24">
  <div className="container mx-auto px-3 sm:px-4 lg:px-8">
    {/* content */}
  </div>
</section>
```

---

## Breakpoint System

### Standard Breakpoints

| Name | Width | Use Case |
|------|-------|----------|
| `sm:` | 640px | Small tablets, large phones |
| `md:` | 768px | Tablets portrait |
| `lg:` | 1024px | Tablets landscape, small desktops |
| `xl:` | 1280px | Standard desktops |
| `2xl:` | 1536px | Large desktops |

### Mobile-First Approach

Always write styles mobile-first, then add breakpoint modifiers:

**✅ DO:**
```tsx
className="text-base md:text-lg lg:text-xl"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

**❌ DON'T:**
```tsx
className="lg:text-xl md:text-lg text-base"  // Wrong order
className="text-xl lg:text-base"  // Desktop-first
```

---

## Container Patterns

### Standard Container

Use `containerClasses.default` for all standard sections:

```tsx
import { containerClasses } from "@/lib/design-tokens";

<div className={containerClasses.default}>
  {/* px-4 sm:px-6 lg:px-8 */}
</div>
```

### Container Variants

```tsx
// Standard container (most common)
containerClasses.default  // px-4 sm:px-6 lg:px-8

// Tighter padding (forms, modals)
containerClasses.tight    // px-4 sm:px-6

// Wider padding (hero sections)
containerClasses.wide     // px-6 sm:px-8 lg:px-12
```

---

## Section Padding

### Vertical Section Padding

Use `sectionClasses` for consistent vertical spacing:

```tsx
import { sectionClasses } from "@/lib/design-tokens";

// Small sections (48px → 64px)
<section className={sectionClasses.sm}>

// Medium sections (64px → 80px) - MOST COMMON
<section className={sectionClasses.md}>

// Large sections (80px → 96px)
<section className={sectionClasses.lg}>

// Extra large sections (96px → 128px)
<section className={sectionClasses.xl}>
```

### When to Use Each Size

- **Small (`sm`):** Compact sections, secondary content
- **Medium (`md`):** Standard sections, most content areas
- **Large (`lg`):** Major sections, feature showcases
- **Extra Large (`xl`):** Hero sections, landing page highlights

---

## Hero Sections

### Hero Height Standards

Use `heroClasses` for consistent hero section heights:

```tsx
import { heroClasses } from "@/lib/design-tokens";

// Small hero (35vh → 40vh)
<section className={`${heroClasses.sm} ...`}>

// Medium hero (40vh → 50vh) - MOST COMMON
<section className={`${heroClasses.md} ...`}>

// Large hero (50vh → 60vh)
<section className={`${heroClasses.lg} ...`}>

// Extra large hero (60vh → 70vh)
<section className={`${heroClasses.xl} ...`}>
```

### Complete Hero Pattern

```tsx
import { containerClasses, heroClasses } from "@/lib/design-tokens";

export default function HeroSection() {
  return (
    <section className={`relative ${heroClasses.md} flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 sm:pt-24 pb-12 sm:pb-16`}>
      <div className={containerClasses.default}>
        {/* Hero content */}
      </div>
    </section>
  );
}
```

---

## Grid Layouts

### Standard Grid Patterns

Use `gridClasses` for consistent grid layouts:

```tsx
import { gridClasses } from "@/lib/design-tokens";

// 2-column grid
<div className={gridClasses.cards['2col']}>

// 3-column grid (MOST COMMON)
<div className={gridClasses.cards['3col']}>

// 4-column grid
<div className={gridClasses.cards['4col']}>
```

### Grid Breakpoint Progression

**Standard Patterns:**
- 2-column: `1 → 2` (mobile → tablet)
- 3-column: `1 → 2 → 3` (mobile → tablet → desktop)
- 4-column: `1 → 2 → 3 → 4` (mobile → small tablet → desktop → large desktop)

**✅ DO:**
```tsx
// Consistent breakpoint progression
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

**❌ DON'T:**
```tsx
// Inconsistent or skipped breakpoints
grid-cols-1 lg:grid-cols-3  // Missing md breakpoint
grid-cols-1 sm:grid-cols-3  // Too aggressive jump
```

---

## Form Layouts

### Form Responsive Patterns

Use `formClasses` for consistent form layouts:

```tsx
import { formClasses } from "@/lib/design-tokens";

// Inline form (stack on mobile, inline on desktop)
<form className={formClasses.inline}>
  {/* flex-col gap-3 sm:flex-row */}
</form>

// Stacked form (always stacked)
<form className={formClasses.stacked}>
  {/* flex-col gap-4 */}
</form>

// Inline with larger gap
<form className={formClasses.inlineWithGap}>
  {/* flex-col gap-4 sm:flex-row sm:gap-3 */}
</form>
```

### Form Examples

**Newsletter Form:**
```tsx
<form className={formClasses.inline}>
  <Input type="email" placeholder="Email" className="flex-1" />
  <Button type="submit">Subscribe</Button>
</form>
```

**Contact Form:**
```tsx
<form className={formClasses.stacked}>
  <Input type="text" placeholder="Name" />
  <Input type="email" placeholder="Email" />
  <Textarea placeholder="Message" />
  <Button type="submit">Send</Button>
</form>
```

---

## Typography Responsive Patterns

### Use Typography Classes

```tsx
import { typographyClasses } from "@/lib/design-tokens";

// Headings
<h1 className={typographyClasses.h1}>
<h2 className={typographyClasses.h2}>
<h3 className={typographyClasses.h3}>

// Body text
<p className={typographyClasses.body.md}>
<p className={typographyClasses.body.sm}>
```

### Typography Breakpoint Pattern

**Standard Progression:**
```tsx
// Headings: 3 breakpoints
text-3xl sm:text-4xl md:text-5xl  // h1
text-2xl sm:text-3xl md:text-4xl  // h2
text-xl sm:text-2xl md:text-3xl   // h3

// Body: 2 breakpoints
text-base md:text-lg              // body-md
text-sm md:text-base              // body-sm
```

---

## Arbitrary Values

### When Arbitrary Values Are Acceptable

**✅ ACCEPTABLE:**
- Unique hero heights: `min-h-[35vh]`
- Decorative elements: `h-[2px]`, `w-[1px]`
- One-off custom sizes: `max-w-[42rem]`
- Specific viewport units: `min-h-[calc(100vh-4rem)]`

**❌ NOT ACCEPTABLE:**
- Common spacing: Use design tokens instead
- Standard text sizes: Use typography classes
- Container widths: Use container classes
- Grid gaps: Use grid classes

### Creating New Design Tokens

If you find yourself using the same arbitrary value multiple times, create a design token:

```typescript
// Add to design-tokens.ts
export const customClasses = {
  myPattern: 'min-h-[35vh] sm:min-h-[40vh]',
};
```

---

## Responsive Display Patterns

### Show/Hide Elements

**Common Patterns:**
```tsx
// Desktop only
className="hidden lg:flex"
className="hidden lg:block"

// Mobile only
className="lg:hidden"
className="block lg:hidden"

// Tablet and up
className="hidden md:flex"

// Mobile and tablet only
className="md:hidden"
```

### Responsive Flex Direction

```tsx
// Stack on mobile, row on desktop
className="flex flex-col sm:flex-row"

// Reverse on desktop
className="flex flex-col lg:flex-row-reverse"

// With alignment changes
className="flex flex-col items-start sm:flex-row sm:items-center"
```

---

## Spacing Guidelines

### Gap Spacing

**Standard Gap Values:**
```tsx
gap-2   // 8px  - Tight spacing
gap-3   // 12px - Compact spacing
gap-4   // 16px - Standard spacing (MOST COMMON)
gap-6   // 24px - Comfortable spacing
gap-8   // 32px - Loose spacing
```

**Responsive Gap:**
```tsx
gap-4 md:gap-6    // Standard → Comfortable
gap-3 sm:gap-4    // Compact → Standard
```

### Margin/Padding Spacing

**Use Consistent Scale:**
```tsx
// Small
px-2 py-1    // Badges, tags
px-3 py-2    // Buttons (small)

// Medium
px-4 py-2    // Buttons (default)
px-6 py-3    // Buttons (large)

// Large
px-8 py-4    // Cards, sections
px-12 py-6   // Hero sections
```

---

## Component-Specific Patterns

### Card Components

```tsx
<Card className="p-4 md:p-6">
  <CardHeader className="pb-2">
    <CardTitle className="text-lg sm:text-xl">
  </CardHeader>
  <CardContent className="space-y-3 sm:space-y-4">
    {/* content */}
  </CardContent>
</Card>
```

### Button Groups

```tsx
// Stack on mobile, inline on desktop
<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
  <Button>Primary</Button>
  <Button variant="outline">Secondary</Button>
</div>
```

### Navigation

```tsx
// Mobile menu
<div className="lg:hidden">
  {/* Mobile navigation */}
</div>

// Desktop menu
<div className="hidden lg:flex lg:items-center lg:space-x-8">
  {/* Desktop navigation */}
</div>
```

---

## Testing Checklist

### Breakpoint Testing

Test every component at these widths:

- [ ] **375px** - Mobile (iPhone SE)
- [ ] **640px** - Small tablet transition
- [ ] **768px** - Tablet portrait
- [ ] **1024px** - Tablet landscape / Small desktop
- [ ] **1280px** - Standard desktop
- [ ] **1536px** - Large desktop

### Visual Testing

- [ ] No horizontal scroll at any breakpoint
- [ ] Text remains readable at all sizes
- [ ] Images scale appropriately
- [ ] Buttons remain clickable (min 44x44px)
- [ ] Forms are usable on mobile
- [ ] Navigation is accessible
- [ ] Cards don't break layout
- [ ] Spacing is consistent

### Functional Testing

- [ ] Touch targets are large enough (mobile)
- [ ] Hover states work (desktop)
- [ ] Focus states are visible
- [ ] Keyboard navigation works
- [ ] Screen readers can navigate
- [ ] No layout shift between breakpoints

---

## Common Mistakes to Avoid

### ❌ Inconsistent Container Padding

```tsx
// DON'T mix padding patterns
<div className="container mx-auto px-3 sm:px-4 lg:px-8">  // Wrong
<div className="container mx-auto px-4 md:px-6 lg:px-8">  // Wrong

// DO use standard pattern
<div className={containerClasses.default}>  // Correct
```

### ❌ Too Many Breakpoints

```tsx
// DON'T over-specify
<div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">

// DO use fewer, meaningful breakpoints
<div className="text-sm md:text-base lg:text-lg">
```

### ❌ Skipping Breakpoints

```tsx
// DON'T skip breakpoints
<div className="grid-cols-1 lg:grid-cols-3">  // Missing md

// DO provide smooth progression
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### ❌ Hardcoded Values

```tsx
// DON'T hardcode common patterns
<section className="py-16 sm:py-20 md:py-24">

// DO use design tokens
<section className={sectionClasses.md}>
```

---

## Migration Guide

### Updating Existing Components

**Step 1:** Import design tokens
```tsx
import { containerClasses, sectionClasses, heroClasses, formClasses } from "@/lib/design-tokens";
```

**Step 2:** Replace inline classes
```tsx
// Before
<section className="py-16 sm:py-20 md:py-24">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">

// After
<section className={sectionClasses.md}>
  <div className={containerClasses.default}>
```

**Step 3:** Test at all breakpoints

**Step 4:** Commit with descriptive message
```
refactor: standardize responsive patterns in [component-name]

- Use design token classes for container and section
- Replace inline responsive classes
- Ensure consistent breakpoint usage
```

---

## Quick Reference

### Import Statement

```tsx
import {
  containerClasses,
  sectionClasses,
  heroClasses,
  formClasses,
  gridClasses,
  spacingClasses,
  typographyClasses,
} from "@/lib/design-tokens";
```

### Most Common Patterns

```tsx
// Standard section
<section className={sectionClasses.md}>
  <div className={containerClasses.default}>
    <div className={gridClasses.cards['3col']}>
      {/* cards */}
    </div>
  </div>
</section>

// Hero section
<section className={`${heroClasses.md} ...`}>
  <div className={containerClasses.default}>
    {/* hero content */}
  </div>
</section>

// Form
<form className={formClasses.inline}>
  <Input className="flex-1" />
  <Button>Submit</Button>
</form>
```

---

## Support

For questions or clarifications about these guidelines:

1. Check the design tokens file: `/lib/design-tokens.ts`
2. Review example implementations in `/components`
3. Refer to the comprehensive audit: `/docs/COMPREHENSIVE_BREAKPOINT_AUDIT.md`

---

## Version History

- **v1.0** (Nov 4, 2025) - Initial guidelines established
- All future updates will be documented here

---

## Conclusion

Following these guidelines ensures:
- ✅ Consistent responsive behavior across the application
- ✅ Easier maintenance and updates
- ✅ Better developer experience
- ✅ Improved code quality
- ✅ Faster development time

**Remember:** When in doubt, use design tokens. If a pattern doesn't exist, create it and document it.
