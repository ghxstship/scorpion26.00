# Shop & Cart Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your keys
```

**Minimum Required for Testing:**
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

### Step 2: Run the Development Server

```bash
npm run dev
```

### Step 3: Test the Cart

1. Navigate to `/shop`
2. Click "Add to Cart" on any product
3. Cart drawer opens automatically
4. View cart icon in header (shows item count)
5. Adjust quantities or remove items
6. Click checkout (will fail without real Stripe keys)

## 🎯 Key Features

### Cart Management
- **Persistent Storage**: Cart survives page refresh
- **Real-time Updates**: Badge updates instantly
- **Toast Notifications**: Feedback on every action
- **Responsive Design**: Works on mobile and desktop

### Payment Integration
- **Stripe**: Full checkout with hosted payment page
- **Shopify**: Native Shopify checkout experience
- **Easy Switching**: Toggle between providers in cart

### Product Display
- **Grid View**: Responsive product grid on `/shop`
- **Detail Pages**: Individual product pages at `/shop/[id]`
- **Image Galleries**: Multiple product images
- **Stock Status**: Real-time inventory display

## 📁 Key Files

```
lib/store/cart-store.ts          # Cart state management
components/cart/cart-drawer.tsx   # Main cart UI
components/layout/header.tsx      # Cart button location
app/api/checkout/stripe/route.ts  # Stripe API
app/api/checkout/shopify/route.ts # Shopify API
```

## 🔧 Common Customizations

### Change Tax Rate
```typescript
// lib/store/cart-store.ts
const TAX_RATE = 0.08; // Change to your rate
```

### Change Shipping Threshold
```typescript
// lib/store/cart-store.ts
const FREE_SHIPPING_THRESHOLD = 100; // Change amount
const SHIPPING_COST = 9.99; // Change cost
```

### Update Products
```typescript
// components/shop/product-grid-section.tsx
const products: Product[] = [
  {
    id: "prod_1",
    name: "Your Product",
    price: 29.99,
    stripePriceId: "price_xxx", // From Stripe Dashboard
    // ... other fields
  }
];
```

## 🧪 Testing Without Payment Setup

The cart works fully without payment credentials:
- ✅ Add/remove items
- ✅ Update quantities
- ✅ View totals
- ✅ Persistent storage
- ❌ Checkout (requires API keys)

## 🎨 Styling

All components use:
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Pre-built components
- **Framer Motion**: Smooth animations
- **Gym Colors**: Brand color palette from `lib/gym-colors.ts`

## 📱 Mobile Experience

- Responsive cart drawer
- Touch-friendly buttons
- Optimized images
- Mobile-first design

## 🐛 Troubleshooting

**Cart not showing items?**
- Check browser console for errors
- Verify localStorage is enabled
- Clear cache and reload

**Checkout button not working?**
- Add Stripe/Shopify API keys to `.env.local`
- Restart dev server after adding keys
- Check console for API errors

**Products not displaying?**
- Verify product data structure matches `Product` type
- Check image URLs are accessible
- Ensure `inStock: true` is set

## 📚 Next Steps

1. **Add Real Products**: Replace mock data with your catalog
2. **Configure Stripe**: Set up products in Stripe Dashboard
3. **Test Checkout**: Use test card `4242 4242 4242 4242`
4. **Customize Styling**: Update colors and layout
5. **Add Features**: Reviews, wishlists, search, etc.

## 🔗 Useful Links

- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Shopify Buy SDK](https://shopify.github.io/js-buy-sdk/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Full Documentation](./SHOP_IMPLEMENTATION.md)

## 💡 Pro Tips

- Use Stripe test mode for development
- Keep product IDs consistent across providers
- Test mobile experience early
- Monitor cart abandonment rates
- Add analytics tracking

## ⚡ Performance

- Cart state optimized with Zustand
- Images lazy-loaded with Next.js Image
- Persistent storage with localStorage
- Minimal re-renders with selective subscriptions

## 🔐 Security

- API keys in environment variables only
- Server-side payment processing
- No sensitive data in client state
- HTTPS required for production

---

**Need Help?** Check `SHOP_IMPLEMENTATION.md` for detailed documentation.
