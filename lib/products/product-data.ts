import { Product } from "@/types/shop";

/**
 * Product catalog - centralized product data
 * In production, replace with API calls or CMS integration
 */
export const products: Product[] = [
  {
    id: "prod_1",
    name: "Premium Resistance Bands Set",
    description: "Professional-grade resistance bands for strength training and mobility work. This comprehensive set includes 5 bands with varying resistance levels, perfect for all fitness levels.",
    price: 29.99,
    rating: 4.8,
    reviews: 234,
    images: [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
    ],
    category: "Equipment",
    badge: "Best Seller",
    inStock: true,
    tags: ["resistance", "bands", "training"],
    stripePriceId: "price_resistance_bands",
    shopifyVariantId: "gid://shopify/ProductVariant/resistance_bands",
  },
  {
    id: "prod_2",
    name: "Whey Protein Isolate",
    description: "Premium whey protein isolate for muscle recovery and growth. 25g protein per serving with minimal carbs and fat.",
    price: 49.99,
    rating: 4.9,
    reviews: 567,
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=600&fit=crop",
    ],
    category: "Supplements",
    badge: "Popular",
    inStock: true,
    tags: ["protein", "supplements", "recovery"],
    stripePriceId: "price_whey_protein",
    shopifyVariantId: "gid://shopify/ProductVariant/whey_protein",
  },
  {
    id: "prod_3",
    name: "Performance Training Shirt",
    description: "Moisture-wicking performance shirt for intense workouts. Lightweight, breathable fabric keeps you cool and dry.",
    price: 34.99,
    rating: 4.7,
    reviews: 189,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    ],
    category: "Apparel",
    inStock: true,
    tags: ["apparel", "shirt", "training"],
    stripePriceId: "price_training_shirt",
    shopifyVariantId: "gid://shopify/ProductVariant/training_shirt",
    variants: [
      {
        id: "var_1",
        name: "Size",
        value: "Small",
        inStock: true,
        stripePriceId: "price_training_shirt_s",
        shopifyVariantId: "gid://shopify/ProductVariant/training_shirt_s",
      },
      {
        id: "var_2",
        name: "Size",
        value: "Medium",
        inStock: true,
        stripePriceId: "price_training_shirt_m",
        shopifyVariantId: "gid://shopify/ProductVariant/training_shirt_m",
      },
      {
        id: "var_3",
        name: "Size",
        value: "Large",
        inStock: true,
        stripePriceId: "price_training_shirt_l",
        shopifyVariantId: "gid://shopify/ProductVariant/training_shirt_l",
      },
    ],
  },
  {
    id: "prod_4",
    name: "Adjustable Dumbbells",
    description: "Space-saving adjustable dumbbells with quick-change weight system. Replaces 15 sets of weights.",
    price: 199.99,
    rating: 4.9,
    reviews: 423,
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
    ],
    category: "Equipment",
    badge: "Top Rated",
    inStock: true,
    tags: ["dumbbells", "weights", "strength"],
    stripePriceId: "price_dumbbells",
    shopifyVariantId: "gid://shopify/ProductVariant/dumbbells",
  },
  {
    id: "prod_5",
    name: "Pre-Workout Formula",
    description: "Energy-boosting pre-workout supplement for maximum performance. Clean energy without the crash.",
    price: 39.99,
    rating: 4.6,
    reviews: 312,
    images: [
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=600&h=600&fit=crop",
    ],
    category: "Supplements",
    inStock: true,
    tags: ["pre-workout", "supplements", "energy"],
    stripePriceId: "price_preworkout",
    shopifyVariantId: "gid://shopify/ProductVariant/preworkout",
  },
  {
    id: "prod_6",
    name: "Yoga Mat Pro",
    description: "Extra-thick yoga mat with superior grip and cushioning. Perfect for yoga, pilates, and stretching.",
    price: 44.99,
    rating: 4.8,
    reviews: 278,
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop",
    ],
    category: "Equipment",
    inStock: true,
    tags: ["yoga", "mat", "recovery"],
    stripePriceId: "price_yoga_mat",
    shopifyVariantId: "gid://shopify/ProductVariant/yoga_mat",
  },
];

/**
 * Get product by ID
 */
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

/**
 * Get products by tag
 */
export function getProductsByTag(tag: string): Product[] {
  return products.filter((product) => product.tags?.includes(tag));
}

/**
 * Search products by name or description
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(products.map((product) => product.category)));
}

/**
 * Get all unique tags
 */
export function getTags(): string[] {
  const tags = products.flatMap((product) => product.tags || []);
  return Array.from(new Set(tags));
}

/**
 * Get featured products (with badges)
 */
export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.badge);
}

/**
 * Get products sorted by rating
 */
export function getTopRatedProducts(limit?: number): Product[] {
  const sorted = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get products sorted by price
 */
export function getProductsByPrice(ascending: boolean = true): Product[] {
  return [...products].sort((a, b) =>
    ascending ? a.price - b.price : b.price - a.price
  );
}
