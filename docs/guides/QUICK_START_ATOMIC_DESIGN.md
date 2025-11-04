# Quick Start: Atomic Design System

**Get started in 5 minutes** with the new atomic design system.

---

## 🚀 Quick Reference

### Import What You Need

```typescript
// Design Tokens
import { spacingClasses, typographyClasses, gridClasses } from '@/lib/design-tokens';

// Atoms
import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { Heading } from '@/components/atoms/heading';
import { Rating } from '@/components/atoms/rating';

// Molecules
import { StatCard } from '@/components/molecules/stat-card';
import { FeatureItem } from '@/components/molecules/feature-item';
import { PriceDisplay } from '@/components/molecules/price-display';
```

---

## 📐 Common Patterns

### Section Layout

```typescript
<section className={spacingClasses.sectionY.lg}>
  <div className={`container ${spacingClasses.containerX}`}>
    {/* Content */}
  </div>
</section>
```

### Typography

```typescript
// Hero heading
<Heading level={1} display="md">Transform Your Body</Heading>

// Section heading
<Heading level={2} className={spacingClasses.mb.lg}>
  Our Programs
</Heading>

// Body text
<Text variant="body-lg" className="text-muted-foreground">
  Description text here
</Text>
```

### Grid Layouts

```typescript
// 3-column card grid
<div className={gridClasses.cards['3col']}>
  {items.map(item => <Card key={item.id}>...</Card>)}
</div>

// 2-column feature grid
<div className={gridClasses.features['2col']}>
  {features.map(feature => <FeatureItem key={feature.id} {...feature} />)}
</div>
```

### Stats Display

```typescript
<div className="grid grid-cols-3 gap-6">
  <StatCard
    icon={Users}
    value="100K+"
    label="Members"
    iconColor="text-primary"
  />
  <StatCard
    icon={Award}
    value="4.9/5"
    label="Rating"
  />
  <StatCard
    icon={TrendingUp}
    value="50+"
    label="Programs"
  />
</div>
```

---

## 🎨 Spacing Cheat Sheet

```typescript
// Section padding (vertical)
spacingClasses.sectionY.sm   // py-12 md:py-16
spacingClasses.sectionY.md   // py-16 md:py-20
spacingClasses.sectionY.lg   // py-20 md:py-24

// Container padding (horizontal)
spacingClasses.containerX    // px-4 md:px-6 lg:px-8

// Card padding
spacingClasses.card          // p-4 md:p-6

// Gaps
spacingClasses.gap.sm        // gap-2
spacingClasses.gap.md        // gap-4
spacingClasses.gap.lg        // gap-6
spacingClasses.gap.xl        // gap-8

// Margins
spacingClasses.mb.sm         // mb-4
spacingClasses.mb.md         // mb-6
spacingClasses.mb.lg         // mb-8
spacingClasses.mb.xl         // mb-12
```

---

## 📝 Typography Cheat Sheet

```typescript
// Display (hero sections)
<Heading level={1} display="sm">  // 4xl → 5xl → 6xl
<Heading level={1} display="md">  // 5xl → 6xl → 7xl
<Heading level={1} display="lg">  // 6xl → 7xl → 8xl

// Headings
<Heading level={1}>  // 3xl → 4xl → 5xl
<Heading level={2}>  // 2xl → 3xl → 4xl
<Heading level={3}>  // xl → 2xl → 3xl

// Body text
<Text variant="body-lg">  // lg → xl
<Text variant="body-md">  // base → lg (default)
<Text variant="body-sm">  // sm → base
<Text variant="body-xs">  // xs → sm

// Special
<Text variant="caption">  // xs, muted
<Text variant="label">    // sm, medium weight
```

---

## 🔧 Component Quick Reference

### Icon
```typescript
<Icon icon={Star} size="md" className="text-primary" />
// Sizes: xs, sm, md, lg, xl, 2xl
```

### Rating
```typescript
<Rating rating={4.5} size="md" showValue={true} />
// Sizes: sm, md, lg
```

### FeatureItem
```typescript
<FeatureItem
  icon={Check}
  title="Feature Name"
  description="Description"
  variant="success"
/>
// Variants: default, success, muted
```

### PriceDisplay
```typescript
<PriceDisplay
  price={99}
  period="monthly"
  showDiscount={true}
  discountPercent={17}
/>
// Periods: weekly, monthly, annual, one-time
```

---

## ✅ Migration Checklist

When updating a component:

1. **Replace spacing:**
   - ❌ `py-24` → ✅ `spacingClasses.sectionY.lg`
   - ❌ `px-4` → ✅ `spacingClasses.containerX`
   - ❌ `gap-8` → ✅ `spacingClasses.gap.xl`

2. **Replace typography:**
   - ❌ `<h1 className="text-4xl">` → ✅ `<Heading level={1}>`
   - ❌ `<p className="text-base">` → ✅ `<Text variant="body-md">`

3. **Use atomic components:**
   - ❌ `<Star className="h-4 w-4" />` → ✅ `<Icon icon={Star} size="sm" />`
   - ❌ Inline star rating → ✅ `<Rating rating={4.5} />`

4. **Use molecules:**
   - ❌ Inline stat display → ✅ `<StatCard />`
   - ❌ Inline feature item → ✅ `<FeatureItem />`

---

## 🎯 Common Use Cases

### Hero Section
```typescript
<section className={spacingClasses.sectionY.lg}>
  <div className={`container ${spacingClasses.containerX}`}>
    <Heading level={1} display="md" className={spacingClasses.mb.md}>
      Hero Title
    </Heading>
    <Text variant="body-lg" className="text-muted-foreground">
      Hero description
    </Text>
  </div>
</section>
```

### Feature Section
```typescript
<section className={spacingClasses.sectionY.lg}>
  <div className={`container ${spacingClasses.containerX}`}>
    <Heading level={2} className={spacingClasses.mb.lg}>
      Features
    </Heading>
    <div className={gridClasses.features['3col']}>
      {features.map(feature => (
        <FeatureItem key={feature.id} {...feature} />
      ))}
    </div>
  </div>
</section>
```

### Product Grid
```typescript
<section className={spacingClasses.sectionY.lg}>
  <div className={`container ${spacingClasses.containerX}`}>
    <div className={gridClasses.cards['3col']}>
      {products.map(product => (
        <Card key={product.id}>
          <CardHeader className={spacingClasses.card}>
            <CardTitle>{product.name}</CardTitle>
            <Rating rating={product.rating} size="sm" />
          </CardHeader>
          <CardContent className={spacingClasses.card}>
            <PriceDisplay price={product.price} />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This
```typescript
// Arbitrary values
<div className="py-24 px-4 gap-8">

// Inconsistent typography
<h1 className="text-4xl sm:text-5xl font-bold">

// Inline implementations
<div className="flex items-center gap-2">
  <Star className="h-4 w-4 fill-yellow-400" />
  <Star className="h-4 w-4 fill-yellow-400" />
</div>
```

### ✅ Do This Instead
```typescript
// Design tokens
<div className={`${spacingClasses.sectionY.lg} ${spacingClasses.containerX} ${spacingClasses.gap.xl}`}>

// Atomic components
<Heading level={1}>Title</Heading>

// Reusable molecules
<Rating rating={5} size="sm" />
```

---

## 📚 Learn More

- **Full Guide:** `ATOMIC_DESIGN_IMPLEMENTATION_GUIDE.md`
- **Audit Report:** `UI_UX_AUDIT_REPORT.md`
- **Summary:** `UI_UX_AUDIT_SUMMARY.md`

---

## 💡 Pro Tips

1. **Always start mobile-first:** `text-sm md:text-base lg:text-lg`
2. **Use semantic HTML:** `<Heading level={1}>` renders `<h1>`
3. **Leverage TypeScript:** Components have full type safety
4. **Test both themes:** Always check light and dark mode
5. **Think atomic:** Break complex UI into smaller reusable pieces

---

**Need Help?** Check the examples in:
- `/components/sections/hero-section.tsx`
- `/components/shop/product-grid-section.tsx`
- `/components/dashboard/permissions-card.tsx`
