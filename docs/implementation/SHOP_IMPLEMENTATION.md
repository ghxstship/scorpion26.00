# Shop & Shopping Cart Implementation Guide

## Overview

This implementation provides a fully functional e-commerce store with shopping cart capabilities, supporting both **Stripe** and **Shopify** payment integrations.

## Features

### ✅ Core Functionality
- **Shopping Cart Management** - Zustand-powered persistent cart with localStorage
- **Dual Payment Integration** - Support for both Stripe and Shopify checkout
- **Product Management** - Complete product catalog with variants support
- **Responsive UI** - Mobile-friendly cart drawer and product grid
- **Real-time Updates** - Cart badge updates and toast notifications
- **Tax & Shipping Calculation** - Automatic calculation with free shipping threshold

### 🛒 Cart Features
- Add/remove items
- Update quantities
- Persistent storage (survives page refresh)
- Cart drawer with slide-out animation
- Item count badge on cart icon
- Subtotal, tax, and shipping calculations
- Free shipping over $100

### 💳 Payment Options
- **Stripe Checkout** - Hosted checkout page with full payment processing
- **Shopify Buy SDK** - Native Shopify checkout experience
- Easy switching between payment providers

## File Structure

```
├── types/
│   └── shop.ts                          # TypeScript types for products, cart, checkout
├── lib/
│   ├── store/
│   │   └── cart-store.ts                # Zustand cart state management
│   ├── stripe/
│   │   ├── stripe-client.ts             # Client-side Stripe initialization
│   │   └── stripe-server.ts             # Server-side Stripe operations
│   └── shopify/
│       └── shopify-client.ts            # Shopify Buy SDK integration
├── app/
│   ├── api/
│   │   └── checkout/
│   │       ├── stripe/route.ts          # Stripe checkout API endpoint
│   │       └── shopify/route.ts         # Shopify checkout API endpoint
│   └── shop/
│       ├── page.tsx                     # Shop main page
│       └── success/
│           └── page.tsx                 # Order success page
├── components/
│   ├── cart/
│   │   ├── cart-button.tsx              # Cart icon with badge
│   │   ├── cart-drawer.tsx              # Slide-out cart panel
│   │   ├── cart-item.tsx                # Individual cart item component
│   │   └── cart-summary.tsx             # Cart totals and checkout
│   ├── shop/
│   │   ├── product-grid-section.tsx     # Product listing grid
│   │   ├── shop-hero-section.tsx        # Shop page hero
│   │   └── success-section.tsx          # Success page content
│   └── ui/
│       ├── sheet.tsx                    # Drawer/sheet component
│       └── separator.tsx                # Separator component
└── .env.example                         # Environment variables template
```

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed:
- `stripe` - Stripe Node.js SDK
- `@stripe/stripe-js` - Stripe client-side SDK
- `shopify-buy` - Shopify Buy SDK
- `zustand` - State management

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

#### Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Get your API keys (use test keys for development)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

#### Shopify Setup

1. Go to your Shopify Admin
2. Navigate to **Apps** > **Develop apps** > **Create an app**
3. Configure **Storefront API** access
4. Get your credentials and add to `.env.local`:
   ```
   NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
   ```

### 3. Configure Products

Products are currently hardcoded in `components/shop/product-grid-section.tsx`. For production:

#### Option A: Use Stripe Products
1. Create products in [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Get the `price_id` for each product
3. Update products array with `stripePriceId`

#### Option B: Use Shopify Products
1. Products are automatically synced from your Shopify store
2. Use `fetchShopifyProducts()` to retrieve them
3. Update products array with `shopifyProductId` and `shopifyVariantId`

#### Option C: Hybrid Approach
Support both by adding both IDs to each product:
```typescript
{
  id: "prod_1",
  name: "Product Name",
  stripePriceId: "price_...",
  shopifyVariantId: "gid://shopify/ProductVariant/...",
  // ... other fields
}
```

## Usage

### Adding Cart to Your Layout

The cart is already integrated into the header (`components/layout/header.tsx`):
- Cart button shows item count
- Cart drawer opens on click
- Persists across page navigation

### Using the Cart Store

```typescript
import { useCartStore } from '@/lib/store/cart-store';

function MyComponent() {
  const { 
    addItem, 
    removeItem, 
    updateQuantity,
    getItemCount,
    getTotal 
  } = useCartStore();

  // Add item to cart
  addItem(product, quantity, variant);

  // Get cart info
  const itemCount = getItemCount();
  const total = getTotal();
}
```

### Checkout Flow

1. User adds items to cart
2. Opens cart drawer
3. Reviews items and totals
4. Selects payment provider (Stripe or Shopify)
5. Clicks "Checkout"
6. Redirected to payment provider
7. After payment, redirected to success page
8. Cart is automatically cleared

## API Endpoints

### POST `/api/checkout/stripe`
Creates a Stripe checkout session.

**Request Body:**
```json
{
  "items": [
    { "priceId": "price_...", "quantity": 1 }
  ],
  "successUrl": "https://...",
  "cancelUrl": "https://...",
  "metadata": { "key": "value" }
}
```

**Response:**
```json
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

### POST `/api/checkout/shopify`
Creates a Shopify checkout.

**Request Body:**
```json
{
  "items": [
    { "variantId": "gid://...", "quantity": 1 }
  ]
}
```

**Response:**
```json
{
  "checkoutId": "...",
  "url": "https://your-store.myshopify.com/..."
}
```

## Customization

### Tax Rate
Edit `lib/store/cart-store.ts`:
```typescript
const TAX_RATE = 0.08; // 8% tax rate
```

### Shipping Costs
Edit `lib/store/cart-store.ts`:
```typescript
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
```

### Product Data Source
Replace hardcoded products in `components/shop/product-grid-section.tsx` with:
- API calls to your backend
- Stripe Product API
- Shopify Storefront API
- CMS integration

### Styling
All components use Tailwind CSS and can be customized via:
- `tailwind.config.ts` - Theme colors
- Component className props
- `lib/gym-colors.ts` - Brand color palette

## Testing

### Test Stripe Integration
1. Use test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC

### Test Shopify Integration
1. Use Shopify test mode
2. Test orders won't charge real money
3. Check Shopify Admin for test orders

## Production Checklist

- [ ] Replace test API keys with production keys
- [ ] Set up proper product catalog
- [ ] Configure shipping rates
- [ ] Set up tax calculation (consider tax automation services)
- [ ] Add order confirmation emails
- [ ] Set up webhook handlers for payment events
- [ ] Add inventory management
- [ ] Implement order tracking
- [ ] Add customer accounts
- [ ] Set up analytics tracking

## Troubleshooting

### Cart not persisting
- Check localStorage is enabled
- Clear browser cache
- Check for console errors

### Checkout fails
- Verify API keys are correct
- Check product IDs match provider
- Ensure success/cancel URLs are correct
- Check browser console for errors

### Products not showing
- Verify product data structure matches `Product` type
- Check image URLs are accessible
- Ensure `inStock` is set to `true`

## Support

For issues or questions:
- Check TypeScript types in `types/shop.ts`
- Review component implementations
- Check browser console for errors
- Verify environment variables are set

## Future Enhancements

Potential additions:
- Product search and filtering
- Product detail pages with image galleries
- Customer reviews and ratings
- Wishlist functionality
- Order history
- Discount codes/coupons
- Gift cards
- Subscription products
- Multi-currency support
- Internationalization
