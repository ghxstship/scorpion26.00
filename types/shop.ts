/**
 * Shop and Cart Type Definitions
 * Supports both Stripe and Shopify integrations
 */

export type PaymentProvider = 'stripe' | 'shopify';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number; // Original price for sale items
  images: string[];
  category: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  variants?: ProductVariant[];
  tags?: string[];
  // Provider-specific IDs
  stripeProductId?: string;
  stripePriceId?: string;
  shopifyProductId?: string;
  shopifyVariantId?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number; // If different from base price
  inStock: boolean;
  stripePriceId?: string;
  shopifyVariantId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface CheckoutSession {
  sessionId: string;
  provider: PaymentProvider;
  url: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface OrderSummary {
  orderId: string;
  orderNumber: string;
  provider: PaymentProvider;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

// Stripe-specific types
export interface StripeProductData {
  productId: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

// Shopify-specific types
export interface ShopifyProductData {
  productId: string;
  variantId: string;
  title: string;
  description: string;
  price: string;
  images: Array<{ src: string }>;
}

// Fitness Program Types
export type ProgramTrack = 
  | 'strength-conditioning'
  | 'performance-training'
  | 'cardio-core'
  | 'nutrition'
  | 'mental-stamina'
  | 'recovery'
  | 'team-sports';

export type ProgramLevel = 
  | 'starter'
  | 'advanced'
  | 'pro'
  | 'elite';

export type CustomProgramLevel = 'fancy';

export type PricingPeriod = 'weekly' | 'monthly' | 'annual';

export interface ProgramPricing {
  weekly: number;
  monthly: number;
  annual: number;
  annualSavings: number; // Percentage saved vs monthly
}

export interface FitnessProgram {
  id: string;
  track: ProgramTrack;
  level: ProgramLevel | CustomProgramLevel;
  name: string;
  description: string;
  tagline: string;
  pricing: ProgramPricing;
  features: string[];
  benefits: string[];
  requirements?: string[];
  maxParticipants?: number; // For elite/fancy levels
  isInviteOnly: boolean;
  badge?: string;
  stripeProductId?: string;
  stripePriceIds?: {
    weekly?: string;
    monthly?: string;
    annual?: string;
  };
}

export interface ProgramBundle {
  id: string;
  name: string;
  description: string;
  type: 'single-tier-all-tracks' | 'single-track-all-tiers';
  tier?: ProgramLevel; // For single-tier bundles
  track?: ProgramTrack; // For single-track bundles
  pricing: ProgramPricing;
  includedPrograms: string[]; // Program IDs
  features: string[];
  badge?: string;
  savings: number; // Percentage saved vs individual
  maxParticipants?: number; // For elite/fancy bundles
  stripeProductId?: string;
  stripePriceIds?: {
    weekly?: string;
    monthly?: string;
    annual?: string;
  };
}

export interface TrackInfo {
  id: ProgramTrack;
  name: string;
  description: string;
  color: string;
  icon: string;
  zone: keyof typeof import('@/lib/gym-colors').gymZones;
}

export interface LevelInfo {
  id: ProgramLevel;
  name: string;
  displayName: string;
  description: string;
  accessType: 'public' | 'premium' | 'professional' | 'private' | 'invite-only';
}
