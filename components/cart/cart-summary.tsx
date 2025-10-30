"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart-store";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CartSummaryProps {
  onCheckout: (provider: 'stripe' | 'shopify') => Promise<void>;
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const { getSubtotal, getTax, getShipping, getTotal } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<'stripe' | 'shopify'>('stripe');

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await onCheckout(provider);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        {subtotal < 100 && (
          <p className="text-xs text-muted-foreground">
            Add ${(100 - subtotal).toFixed(2)} more for free shipping
          </p>
        )}
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant={provider === 'stripe' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => setProvider('stripe')}
          >
            Stripe
          </Button>
          <Button
            variant={provider === 'shopify' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => setProvider('shopify')}
          >
            Shopify
          </Button>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Checkout with ${provider === 'stripe' ? 'Stripe' : 'Shopify'}`
          )}
        </Button>
      </div>
    </div>
  );
}
