"use client";

import { ShoppingCart } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { Badge } from "@/components/ui/badge";

export default function CartButton() {
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={openCart}
      aria-label="Open shopping cart"
    >
      <Icon icon={ShoppingCart} size="md" aria-label="Shopping cart" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {itemCount > 9 ? '9+' : itemCount}
        </Badge>
      )}
    </Button>
  );
}
