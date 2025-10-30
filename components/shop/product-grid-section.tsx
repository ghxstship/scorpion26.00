"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCartStore } from "@/lib/store/cart-store";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/shop";
import { products } from "@/lib/products/product-data";

export default function ProductGridSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { addItem, openCart } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    openCart();
  };

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {product.badge && (
                    <Badge className="absolute left-4 top-4 bg-primary">
                      {product.badge}
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <div className="mb-2 text-sm font-semibold text-primary">
                    {product.category}
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews || 0})
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
                </CardContent>

                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
