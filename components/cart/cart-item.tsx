"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { CartItem as CartItemType } from "@/types/shop";
import { Text } from "@/components/atoms/text";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  
  const price = item.selectedVariant?.price || item.product.price;
  const itemTotal = price * item.quantity;

  const handleIncrement = () => {
    updateQuantity(
      item.product.id,
      item.quantity + 1,
      item.selectedVariant?.id
    );
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(
        item.product.id,
        item.quantity - 1,
        item.selectedVariant?.id
      );
    }
  };

  const handleRemove = () => {
    removeItem(item.product.id, item.selectedVariant?.id);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm">{item.product.name}</h3>
          {item.selectedVariant && (
            <p className="text-xs text-muted-foreground mt-1">
              {item.selectedVariant.name}: {item.selectedVariant.value}
            </p>
          )}
          <p className="text-sm font-bold mt-1">${price.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrement}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold">${itemTotal.toFixed(2)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
