# Animation System Implementation Guide

## Overview

This guide documents the comprehensive animation and interaction system implemented across the application. The system provides consistent, performant, and accessible motion design.

---

## Architecture

### Core Libraries

**Animation Tokens** (`/lib/animation-tokens.ts`)
- Centralized animation values (duration, easing, scale, etc.)
- Tailwind utility classes for common patterns
- Consistent timing and motion across the app

**Motion Variants** (`/lib/motion-variants.ts`)
- Framer Motion animation presets
- Reusable variants for common animations
- Viewport and stagger configurations

**Hover Effects** (`/lib/hover-effects.ts`)
- Pre-configured hover effect combinations
- Consistent interaction patterns
- Easy-to-use utility classes

---

## Animation Tokens

### Duration Scale

```typescript
import { animationTokens } from '@/lib/animation-tokens';

animationTokens.duration = {
  instant: 100,   // Immediate feedback
  fast: 200,      // Quick transitions
  normal: 300,    // Standard transitions
  slow: 500,      // Deliberate animations
  slower: 700,    // Dramatic effects
  slowest: 1000,  // Special effects
}
```

### Easing Functions

```typescript
animationTokens.easing = {
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
}
```

### Spring Configurations

```typescript
animationTokens.spring = {
  gentle: { stiffness: 100, damping: 15 },
  bouncy: { stiffness: 300, damping: 20 },
  stiff: { stiffness: 400, damping: 30 },
  soft: { stiffness: 50, damping: 20 },
}
```

---

## Component Enhancements

### Button Component

**Enhanced Features:**
- Smooth scale on hover (`hover:scale-[1.02]`)
- Active press state (`active:scale-[0.98]`)
- Shadow lift on hover
- 200ms transition duration

```tsx
<Button variant="default">Click Me</Button>
// Automatically includes hover/active animations
```

### Card Component

**Enhanced Features:**
- Smooth transitions on all properties
- 300ms duration for hover effects
- Ready for lift/shadow animations

```tsx
<Card className="hover:-translate-y-2 hover:shadow-2xl">
  {/* Card content */}
</Card>
```

### Badge Component

**Enhanced Features:**
- Scale on hover (`hover:scale-105`)
- Smooth color transitions
- 200ms animation duration

```tsx
<Badge variant="default">New</Badge>
```

### Input Component

**Enhanced Features:**
- Border color transition on hover
- Focus ring animation
- Smooth 200ms transitions

```tsx
<Input placeholder="Enter text..." />
```

### Icon Component

**New Animation Support:**
```tsx
<Icon icon={Loader2} animation="spin" />
<Icon icon={Star} animation="bounce" />
<Icon icon={Heart} animation="pulse" />
```

---

## Framer Motion Variants

### Basic Animations

**Fade In:**
```tsx
import { fadeVariants } from '@/lib/motion-variants';

<motion.div variants={fadeVariants} initial="hidden" animate="visible">
  Content
</motion.div>
```

**Slide Up:**
```tsx
import { slideUpVariants } from '@/lib/motion-variants';

<motion.div variants={slideUpVariants} initial="hidden" animate="visible">
  Content
</motion.div>
```

**Scale In:**
```tsx
import { scaleVariants } from '@/lib/motion-variants';

<motion.div variants={scaleVariants} initial="hidden" animate="visible">
  Content
</motion.div>
```

### Hover Animations

**Card Hover:**
```tsx
import { cardHoverVariants } from '@/lib/motion-variants';

<motion.div 
  variants={cardHoverVariants}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
>
  Card content
</motion.div>
```

**Button Hover:**
```tsx
import { buttonHoverVariants } from '@/lib/motion-variants';

<motion.button variants={buttonHoverVariants}>
  Click Me
</motion.button>
```

### Stagger Animations

**Container and Items:**
```tsx
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion-variants';

<motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Scroll-Based Animations

### AnimatedSection Component

**Basic Usage:**
```tsx
import { AnimatedSection } from '@/components/shared/animated-section';

<AnimatedSection animation="slideUp">
  <h2>Section Title</h2>
  <p>Section content...</p>
</AnimatedSection>
```

**Available Animations:**
- `fade` - Simple fade in
- `slideUp` - Slide up with fade
- `slideDown` - Slide down with fade
- `slideLeft` - Slide from right
- `slideRight` - Slide from left
- `scale` - Scale up with fade

**Advanced Options:**
```tsx
<AnimatedSection
  animation="slideUp"
  delay={0.2}
  duration="slow"
  threshold="partial"
  once={true}
>
  Content
</AnimatedSection>
```

---

## Tailwind Animations

### New Keyframe Animations

**Slide Up:**
```tsx
<div className="animate-slide-up">Content</div>
```

**Scale In:**
```tsx
<div className="animate-scale-in">Content</div>
```

**Shimmer (Loading):**
```tsx
<div className="animate-shimmer bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10">
  Loading...
</div>
```

**Pulse Glow:**
```tsx
<Badge className="animate-pulse-glow">Live</Badge>
```

**Bounce Subtle:**
```tsx
<Icon icon={ArrowDown} className="animate-bounce-subtle" />
```

---

## Hover Effects Library

### Card Hover Effects

```tsx
import { cardHoverEffects } from '@/lib/hover-effects';

<div className={cardHoverEffects.lift}>Card</div>
<div className={cardHoverEffects.scale}>Card</div>
<div className={cardHoverEffects.glow}>Card</div>
```

### Button Hover Effects

```tsx
import { buttonHoverEffects } from '@/lib/hover-effects';

<button className={buttonHoverEffects.scale}>Button</button>
<button className={buttonHoverEffects.lift}>Button</button>
```

### Link Hover Effects

```tsx
import { linkHoverEffects } from '@/lib/hover-effects';

<a className={linkHoverEffects.underline}>Link</a>
<a className={linkHoverEffects.color}>Link</a>
```

### Icon Hover Effects

```tsx
import { iconHoverEffects } from '@/lib/hover-effects';

<Icon className={iconHoverEffects.rotate} />
<Icon className={iconHoverEffects.scale} />
<Icon className={iconHoverEffects.spin} />
```

---

## Page Transitions

### PageTransition Component

```tsx
import { PageTransition } from '@/components/shared/page-transition';

export default function Page() {
  return (
    <PageTransition>
      <h1>Page Content</h1>
      {/* Rest of page */}
    </PageTransition>
  );
}
```

**Features:**
- Automatic fade + slide transition
- Respects reduced motion preferences
- 300ms duration
- Smooth page changes

---

## Accessibility

### Reduced Motion Support

**useReducedMotion Hook:**
```tsx
import { useReducedMotion } from '@/hooks/use-reduced-motion';

function Component() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
    >
      Content
    </motion.div>
  );
}
```

**Automatic Support:**
- `AnimatedSection` automatically respects reduced motion
- `PageTransition` disables animations for reduced motion
- All components gracefully degrade

---

## Performance Best Practices

### GPU-Accelerated Properties

✅ **Use these (GPU-accelerated):**
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur, brightness)

❌ **Avoid these (CPU-intensive):**
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`

### Optimization Tips

1. **Use `will-change` sparingly:**
```tsx
<div className="hover:will-change-transform">
  Only on hover
</div>
```

2. **Limit concurrent animations:**
- Stagger animations instead of all at once
- Use viewport detection to animate only visible elements

3. **Reduce motion complexity:**
- Simpler animations = better performance
- Fewer animated properties = smoother

4. **Lazy load heavy animations:**
```tsx
const HeavyAnimation = lazy(() => import('./HeavyAnimation'));
```

---

## Common Patterns

### Hero Section Animation

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
>
  <h1>Hero Title</h1>
</motion.div>
```

### Card Grid with Stagger

```tsx
<motion.div
  variants={staggerContainerVariants}
  initial="hidden"
  animate="visible"
  className="grid grid-cols-3 gap-6"
>
  {cards.map((card, i) => (
    <motion.div
      key={card.id}
      variants={staggerItemVariants}
      whileHover={{ y: -8 }}
    >
      <Card>{card.content}</Card>
    </motion.div>
  ))}
</motion.div>
```

### Navigation Link with Underline

```tsx
<Link
  href="/about"
  className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
>
  About
</Link>
```

### Loading Skeleton with Shimmer

```tsx
<Skeleton shimmer className="h-20 w-full" />
```

---

## Migration Guide

### Updating Existing Components

**Before:**
```tsx
<div className="hover:shadow-lg">
  Card
</div>
```

**After:**
```tsx
<div className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
  Card
</div>
```

### Adding Scroll Animations

**Before:**
```tsx
<section>
  <h2>Section Title</h2>
  <p>Content</p>
</section>
```

**After:**
```tsx
<AnimatedSection animation="slideUp">
  <h2>Section Title</h2>
  <p>Content</p>
</AnimatedSection>
```

---

## Testing Checklist

- [ ] All interactive elements have hover states
- [ ] Animations run at 60 FPS
- [ ] Reduced motion preferences respected
- [ ] No layout shift from animations
- [ ] Mobile animations perform well
- [ ] Keyboard navigation not affected
- [ ] Screen readers work correctly

---

## Resources

- **Animation Tokens:** `/lib/animation-tokens.ts`
- **Motion Variants:** `/lib/motion-variants.ts`
- **Hover Effects:** `/lib/hover-effects.ts`
- **Hooks:** `/hooks/use-reduced-motion.ts`
- **Components:** `/components/shared/animated-section.tsx`
- **Tailwind Config:** `/tailwind.config.ts`

---

**Last Updated:** November 3, 2025  
**Version:** 1.0.0
