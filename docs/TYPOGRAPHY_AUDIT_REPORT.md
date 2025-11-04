# Scorpion Typography Audit Report
**Date:** November 4, 2025  
**Status:** ❌ CRITICAL VIOLATIONS FOUND  
**Compliance Level:** ZERO TOLERANCE FAILED

---

## Executive Summary

A comprehensive audit of the Scorpion26.00 codebase has identified **CRITICAL typography violations** that breach the zero-tolerance implementation policy for Scorpion brand typography.

### Violation Categories

1. **❌ Non-Scorpion Font Usage** - `font-montserrat` used instead of Scorpion fonts
2. **❌ Legacy Font Imports** - Inter and Montserrat imported in root layout
3. **❌ Incorrect Font Class** - `font-sans` used instead of `font-body`
4. **⚠️ Raw HTML Elements** - Direct `<h1>`, `<h2>`, etc. without Scorpion components
5. **⚠️ Hardcoded Text Sizes** - Direct size classes instead of design tokens

---

## Critical Violations

### 1. Non-Scorpion Font: `font-montserrat`

**Severity:** 🔴 CRITICAL  
**Impact:** Brand identity compromise  
**Occurrences:** 24+ files

Montserrat is NOT part of the Scorpion typography system. The correct Scorpion fonts are:
- **Title:** Anton
- **Subtitle:** Contrail One  
- **Headings:** Bebas Neue
- **H3/H4:** Oswald
- **Body:** Roboto Mono
- **Buttons:** Bebas Neue

#### Files Using `font-montserrat`:

**Components:**
- `components/results/results-hero-section.tsx` (Line 18)
- `components/results/video-testimonials-section.tsx` (Line 44)
- `components/results/transformation-gallery-section.tsx` (Line 82)
- `components/results/stats-section.tsx` (Line 40)
- `components/programs/programs-hero-section.tsx` (Line 39)
- `components/programs/guarantee-section.tsx` (Line 27)
- `components/programs/programs-cards-grid.tsx` (Line 62+)
- `components/community/community-hero-section.tsx` (Line 18)
- `components/community/community-features-section.tsx` (Line 59)
- `components/community/community-stats-section.tsx` (Line 37)
- `components/login/login-form-section.tsx` (Line 53)

**App Pages:**
- `app/(public)/legal/cookies/page.tsx` (Lines 15, 23, 32, 47, 56)
- `app/(public)/legal/privacy/page.tsx` (Line 14)
- `app/(public)/legal/terms/page.tsx` (Line 14)
- `app/(public)/legal/refunds/page.tsx` (Line 14)
- `app/collaborator/analytics/page.tsx` (Line 32)
- `app/collaborator/media/page.tsx` (Line 34)

**Required Fix:**
```tsx
// ❌ WRONG
<Heading level={1} className="font-montserrat text-5xl">

// ✅ CORRECT - Use design token
<Heading level={1}>

// ✅ CORRECT - Or explicit Scorpion font
<Heading level={1} className="font-heading">
```

---

### 2. Legacy Font Imports in Root Layout

**Severity:** 🔴 CRITICAL  
**File:** `app/layout.tsx`  
**Lines:** 2, 11-21, 78-79

The root layout imports and uses Inter and Montserrat fonts, which are NOT part of the Scorpion brand system.

**Current Code:**
```tsx
import { Inter, Montserrat } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

<html lang="en" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable}`}>
  <body className="font-sans antialiased">
```

**Issue:** 
- `font-sans` maps to `--font-inter`, not Scorpion body font
- Montserrat is completely outside Scorpion brand system
- Body should use `font-body` which maps to Roboto Mono

**Required Fix:**
```tsx
// Remove Inter and Montserrat imports
// BrandProvider handles all Scorpion font loading

<html lang="en" suppressHydrationWarning>
  <body className="font-body antialiased">
```

---

### 3. Tailwind Config Font Mapping Issue

**Severity:** 🟡 MEDIUM  
**File:** `tailwind.config.ts`  
**Lines:** 27-28

**Current Code:**
```typescript
fontFamily: {
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-body)', 'monospace'],
}
```

**Issue:**
- `font-sans` references non-existent `--font-inter`
- Should reference Scorpion body font
- Creates confusion between `font-sans` and `font-body`

**Required Fix:**
```typescript
fontFamily: {
  sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-body)', 'monospace'],
}
```

---

### 4. Raw HTML Elements Without Scorpion Typography

**Severity:** 🟡 MEDIUM  
**Occurrences:** 88+ instances across 65 files

Raw `<h1>`, `<h2>`, `<h3>`, etc. elements are used directly instead of:
- `<Heading>` component (recommended)
- `<BrandH1>`, `<BrandH2>`, etc. components
- Design token classes

**Examples:**
```tsx
// ❌ WRONG - Raw HTML
<h2 className="font-montserrat text-4xl font-bold sm:text-5xl">

// ✅ CORRECT - Use Heading component
<Heading level={2}>Video Testimonials</Heading>

// ✅ ACCEPTABLE - Raw HTML with proper base styles
<h2>Video Testimonials</h2>  // Gets Bebas Neue from globals.css
```

**Note:** Raw HTML elements ARE acceptable since `globals.css` applies Scorpion fonts to all `h1-h6` elements. However, using `<Heading>` component is preferred for consistency.

---

### 5. Hardcoded Text Size Classes

**Severity:** 🟢 LOW  
**Occurrences:** 2700+ instances

Direct size classes (`text-sm`, `text-lg`, `text-2xl`, etc.) are used instead of design token typography classes.

**Examples:**
```tsx
// ⚠️ ACCEPTABLE but not ideal
<p className="text-sm text-muted-foreground">

// ✅ PREFERRED - Use design tokens
<Text variant="body-sm" className="text-muted-foreground">
```

**Note:** This is acceptable for utility purposes but design token components are preferred for consistency.

---

## Scorpion Typography System Reference

### Official Scorpion Fonts

From `lib/branding/presets/scorpion-preset.ts`:

```typescript
typography: {
  title: '"Anton", sans-serif',           // Bold display font
  subtitle: '"Contrail One", sans-serif', // Italic accent font
  heading1: '"Bebas Neue", sans-serif',   // Condensed sans-serif
  heading2: '"Bebas Neue", sans-serif',   // Condensed sans-serif
  heading3: '"Oswald", sans-serif',       // Semi-condensed
  heading4: '"Oswald", sans-serif',       // Semi-condensed
  body: '"Roboto Mono", monospace',       // Monospace body
  button: '"Bebas Neue", sans-serif',     // Condensed sans-serif
  caption: '"Roboto Mono", monospace',    // Monospace caption
}
```

### Correct Usage Patterns

#### Option 1: Atomic Components (Recommended)
```tsx
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';

<Heading level={1}>Uses Bebas Neue automatically</Heading>
<Text variant="body-md">Uses Roboto Mono automatically</Text>
```

#### Option 2: Tailwind Utilities
```tsx
<h1 className="font-heading text-4xl">Bebas Neue heading</h1>
<p className="font-body text-base">Roboto Mono body</p>
<button className="font-button">Bebas Neue button</button>
```

#### Option 3: Raw HTML (Automatic via globals.css)
```tsx
<h1>Automatically uses Bebas Neue</h1>
<p>Automatically uses Roboto Mono</p>
<button>Automatically uses Bebas Neue</button>
```

#### Option 4: Brand Components (Explicit)
```tsx
import { BrandTitle, BrandH1, BrandBody } from '@/components/branding/typography';

<BrandTitle>Anton title font</BrandTitle>
<BrandH1>Bebas Neue heading</BrandH1>
<BrandBody>Roboto Mono body</BrandBody>
```

---

## Remediation Plan

### Phase 1: Critical Fixes (IMMEDIATE)

1. **Remove Legacy Fonts from Root Layout**
   - Remove Inter and Montserrat imports
   - Change `font-sans` to `font-body` in body element
   - Update Tailwind config to remove Inter references

2. **Replace All `font-montserrat` Occurrences**
   - Replace with `font-heading` or remove (let design tokens handle it)
   - 24+ files need updates

### Phase 2: Consistency Improvements (HIGH PRIORITY)

3. **Convert Raw HTML to Components**
   - Replace raw `<h1-h6>` with `<Heading>` components
   - 88+ instances across 65 files

4. **Standardize Text Components**
   - Replace hardcoded sizes with `<Text>` component variants
   - 2700+ instances (can be gradual)

### Phase 3: Verification (REQUIRED)

5. **Automated Testing**
   - Run grep searches to verify zero `font-montserrat` occurrences
   - Verify no `font-sans` usage except in Tailwind config
   - Confirm BrandProvider loads all Scorpion fonts

6. **Visual Regression Testing**
   - Screenshot comparison before/after fixes
   - Verify all pages render with correct Scorpion fonts

---

## Automated Fix Commands

### Find All Violations
```bash
# Find font-montserrat usage
grep -r "font-montserrat" app/ components/ --include="*.tsx"

# Find font-sans usage  
grep -r "font-sans" app/ components/ --include="*.tsx"

# Find raw HTML headings
grep -r "<h[1-6]" app/ components/ --include="*.tsx"
```

### Verification Commands
```bash
# After fixes, these should return 0 results
grep -r "font-montserrat" app/ components/ --include="*.tsx" | wc -l
grep -r "Inter.*from.*next/font" app/ --include="*.tsx" | wc -l
grep -r "Montserrat.*from.*next/font" app/ --include="*.tsx" | wc -l
```

---

## Compliance Checklist

- [ ] Remove Inter and Montserrat from `app/layout.tsx`
- [ ] Update body className from `font-sans` to `font-body`
- [ ] Update Tailwind config `font-sans` to use Scorpion body font
- [ ] Replace all 24+ `font-montserrat` occurrences
- [ ] Verify BrandProvider loads all Scorpion fonts
- [ ] Run automated verification commands
- [ ] Visual regression test on key pages
- [ ] Update documentation to reflect zero-tolerance policy

---

## Zero-Tolerance Policy

**No exceptions.** All typography must use Scorpion brand fonts:
- Anton (Title)
- Contrail One (Subtitle)
- Bebas Neue (Headings, Buttons)
- Oswald (H3/H4)
- Roboto Mono (Body, Captions)

Any use of Inter, Montserrat, or other non-Scorpion fonts is a **CRITICAL VIOLATION**.

---

## Next Steps

1. Execute Phase 1 critical fixes immediately
2. Create automated fix script for `font-montserrat` replacements
3. Run verification commands
4. Update this report with fix status
5. Implement CI/CD checks to prevent future violations

**Report Status:** OPEN - Awaiting fixes
