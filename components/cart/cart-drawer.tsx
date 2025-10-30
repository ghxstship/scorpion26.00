"use client";

import { useCartStore } from "@/lib/store/cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import CartItem from "./cart-item";
import CartSummary from "./cart-summary";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CartDrawer() {
  const { items, isOpen, closeCart, getItemCount } = useCartStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckout = async (provider: 'stripe' | 'shopify') => {
    try {
      if (provider === 'stripe') {
        // Prepare Stripe checkout items
        const checkoutItems = items.map((item) => ({
          priceId: item.selectedVariant?.stripePriceId || item.product.stripePriceId || '',
          quantity: item.quantity,
        }));

        // Validate that all items have price IDs
        if (checkoutItems.some((item) => !item.priceId)) {
          toast({
            title: "Configuration Error",
            description: "Some products are not configured for Stripe checkout. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        const response = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: checkoutItems,
            successUrl: `${window.location.origin}/shop/success`,
            cancelUrl: `${window.location.origin}/shop/cart`,
          }),
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL received');
        }
      } else {
        // Prepare Shopify checkout items
        const checkoutItems = items.map((item) => ({
          variantId: item.selectedVariant?.shopifyVariantId || item.product.shopifyVariantId || '',
          quantity: item.quantity,
        }));

        // Validate that all items have variant IDs
        if (checkoutItems.some((item) => !item.variantId)) {
          toast({
            title: "Configuration Error",
            description: "Some products are not configured for Shopify checkout. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        const response = await fetch('/api/checkout/shopify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: checkoutItems }),
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL received');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({getItemCount()})
          </SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add some items to get started
            </p>
            <Button onClick={() => {
              closeCart();
              router.push('/shop');
            }}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              {items.map((item, index) => (
                <CartItem key={`${item.product.id}-${item.selectedVariant?.id || index}`} item={item} />
              ))}
            </div>

            <div className="border-t border-border pt-4 mt-auto">
              <CartSummary onCheckout={handleCheckout} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
