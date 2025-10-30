# Elite Fitness Personal Brand Website Template

An enterprise-grade, full-stack fitness personal brand website built with Next.js 14, TypeScript, Tailwind CSS, and modern web technologies. This template is designed for fitness coaches, personal trainers, and wellness brands looking to create a high-converting online presence.

## 🚀 Features

### Core Pages
- **Homepage** - Hero section, social proof, value propositions, program showcase
- **About/Story Page** - Founder journey, credentials, mission statement
- **Programs/Services** - Detailed program pages with pricing and testimonials
- **Content Hub** - Blog, videos, and resources with filtering
- **Results/Testimonials** - Transformation gallery and success stories
- **Shop/Store** - ✅ **FULLY IMPLEMENTED** - Complete e-commerce with cart and dual payment integration
- **Community** - Member portal and social features
- **Contact** - Multi-channel contact options

### Design & UX
- ✅ Mobile-first responsive design
- ✅ Modern, clean UI with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Intersection Observer for scroll animations
- ✅ Dark mode support
- ✅ Accessible (WCAG AA compliant)
- ✅ Fast page loads (<3s)
- ✅ Optimized images with Next.js Image

### Technical Features
- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Server and Client Components
- ✅ SEO optimized with metadata
- ✅ Performance optimized
- ✅ shadcn/ui component library
- ✅ Lucide icons
- ✅ Form validation ready
- ✅ Toast notifications
- ✅ **Shopping Cart** - Zustand state management with localStorage persistence
- ✅ **Stripe Integration** - Complete checkout flow with hosted payment page
- ✅ **Shopify Integration** - Native Shopify checkout support

### Conversion Optimization
- ✅ Multiple CTA placements
- ✅ Email capture forms
- ✅ Social proof elements
- ✅ Trust indicators
- ✅ Urgency elements
- ✅ Money-back guarantee sections
- ✅ Mobile app download CTAs

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

## 🛠️ Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Run the development server:**

```bash
npm run dev
```

3. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts, metadata
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── about/              # About page
│   ├── programs/           # Programs pages
│   ├── content/            # Content hub
│   ├── results/            # Success stories
│   ├── shop/               # E-commerce
│   ├── contact/            # Contact page
│   └── login/              # Authentication
│
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── toast.tsx
│   ├── layout/             # Layout components
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── sections/           # Homepage sections
│   │   ├── hero-section.tsx
│   │   ├── social-proof-section.tsx
│   │   ├── value-proposition-section.tsx
│   │   ├── program-showcase-section.tsx
│   │   ├── founder-section.tsx
│   │   ├── media-features-section.tsx
│   │   ├── content-hub-section.tsx
│   │   └── final-conversion-section.tsx
│   └── theme-provider.tsx
│
├── lib/
│   └── utils.ts            # Utility functions
│
├── hooks/
│   └── use-toast.ts        # Toast notification hook
│
└── public/                 # Static assets
```

## 🎨 Customization

### Brand Colors

Edit `app/globals.css` to customize your brand colors:

```css
:root {
  --primary: 221.2 83.2% 53.3%;        /* Main brand color */
  --secondary: 210 40% 96.1%;          /* Secondary color */
  --accent: 210 40% 96.1%;             /* Accent color */
  /* ... more colors */
}
```

### Content

1. **Update site metadata** in `app/layout.tsx`
2. **Replace placeholder images** with your own
3. **Modify text content** in each section component
4. **Update navigation links** in `components/layout/header.tsx`
5. **Customize footer links** in `components/layout/footer.tsx`

### Fonts

The template uses Inter and Montserrat from Google Fonts. Change in `app/layout.tsx`:

```typescript
const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
```

## 🖼️ Images

Replace placeholder images from Unsplash with your own:

- Hero images
- Program thumbnails
- Testimonial photos
- Founder/coach photos
- Content thumbnails

Use the Next.js Image component for optimization:

```tsx
import Image from "next/image";

<Image
  src="/your-image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // for above-the-fold images
/>
```

## 📱 Responsive Design

All components are mobile-first and responsive:

- Mobile: < 768px
- Tablet: 768px - 1199px
- Desktop: 1200px+

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Deploy

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

## 🔧 Environment Variables

Create a `.env.local` file for environment variables:

```env
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe (for shop checkout)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Shopify (optional - for shop checkout)
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token

# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Email Service
EMAIL_API_KEY=your-email-service-key

# Database (if needed)
DATABASE_URL=your-database-url
```

**See `.env.example` for complete shop configuration details.**

## 📊 Analytics Integration

Add Google Analytics in `app/layout.tsx`:

```tsx
import Script from 'next/script';

// In the layout component
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

## 🔐 Authentication

The template is ready for authentication integration:

- NextAuth.js
- Clerk
- Supabase Auth
- Auth0

Add your preferred auth provider in the `/login` route.

## 💳 Payment Integration

**✅ FULLY IMPLEMENTED** in the shop section:

- ✅ **Stripe** - Complete checkout flow with hosted payment page
- ✅ **Shopify** - Native Shopify Buy SDK integration
- 🔄 PayPal (ready to add)
- 🔄 Square (ready to add)

**Quick Start:**
1. Copy `.env.example` to `.env.local`
2. Add your Stripe/Shopify API keys
3. Test with Stripe test card: `4242 4242 4242 4242`

**Documentation:**
- [SHOP_QUICKSTART.md](./SHOP_QUICKSTART.md) - Get started in 5 minutes
- [SHOP_IMPLEMENTATION.md](./SHOP_IMPLEMENTATION.md) - Complete technical docs
- [SHOP_SUMMARY.md](./SHOP_SUMMARY.md) - Implementation overview

## 📧 Email Marketing

Integrate with:

- Mailchimp
- ConvertKit
- SendGrid
- ActiveCampaign

Add API calls in the email capture forms.

## 🎯 SEO Optimization

The template includes:

- ✅ Semantic HTML
- ✅ Meta tags
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD)
- ✅ Sitemap generation
- ✅ Robots.txt

Add structured data for better SEO:

```tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Name",
  "jobTitle": "Fitness Coach",
  // ... more data
}
</script>
```

## ⚡ Performance Optimization

- Image optimization with Next.js Image
- Code splitting
- Lazy loading
- Font optimization
- CSS optimization
- Minimal JavaScript

## 🧪 Testing

Add testing with:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

## 📝 License

This template is provided as-is for commercial and personal use.

## 🤝 Support

For issues or questions:
- Check the documentation
- Review the code comments
- Consult Next.js documentation

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)

## 🔄 Updates

Keep dependencies updated:

```bash
npm update
```

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in `.next/`

## 🌟 Features to Add

Consider adding:

- [ ] Blog with MDX
- [ ] Video streaming
- [ ] Live chat
- [ ] Member dashboard
- [ ] Progress tracking
- [ ] Workout builder
- [ ] Meal planner
- [ ] Community forum
- [ ] Booking system
- [ ] Subscription management

## 🎨 Design System

The template uses a consistent design system:

- **Typography**: Inter (body), Montserrat (headings)
- **Spacing**: 4px base unit
- **Border Radius**: 0.5rem default
- **Shadows**: Subtle, layered
- **Colors**: HSL-based for easy theming

## 🔍 Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation
- Focus indicators
- Color contrast ratios
- Screen reader friendly

## 📱 Progressive Web App (PWA)

Convert to PWA by adding:

1. `manifest.json`
2. Service worker
3. Offline support
4. Install prompts

## 🌐 Internationalization (i18n)

Add multi-language support with next-intl or next-i18next.

## 🎯 Conversion Rate Optimization

The template includes CRO best practices:

- Clear value propositions
- Social proof throughout
- Multiple CTAs
- Trust indicators
- Urgency elements
- Risk reversal (guarantees)
- Mobile optimization
- Fast loading times

## 🛒 E-Commerce Shop Features

The shop is **fully implemented** with production-ready features:

### Shopping Cart
- ✅ Persistent cart (survives page refresh)
- ✅ Add/remove/update items
- ✅ Real-time totals calculation
- ✅ Item count badge
- ✅ Slide-out cart drawer
- ✅ Toast notifications

### Product Management
- ✅ Product catalog with images
- ✅ Product detail pages
- ✅ Product variants (sizes, colors)
- ✅ Stock status tracking
- ✅ Product search helpers
- ✅ Category filtering

### Checkout
- ✅ Dual payment integration (Stripe + Shopify)
- ✅ Tax calculation (configurable)
- ✅ Shipping calculation
- ✅ Free shipping threshold
- ✅ Order success page
- ✅ Error handling

### Technical
- ✅ Zustand state management
- ✅ TypeScript types
- ✅ API routes for checkout
- ✅ Server-side payment processing
- ✅ Responsive design
- ✅ Optimized performance

**Get Started:** See [SHOP_QUICKSTART.md](./SHOP_QUICKSTART.md) for setup instructions.

---

**Built with ❤️ for fitness professionals who want to scale their impact online.**
