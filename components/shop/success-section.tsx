"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/lib/store/cart-store";
import { motion } from "framer-motion";

export default function SuccessSection() {
  const router = useRouter();
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear the cart after successful checkout
    clearCart();
  }, [clearCart]);

  return (
    <section className="min-h-screen flex items-center justify-center py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6"
              >
                <div className="relative">
                  <CheckCircle className="h-24 w-24 text-primary mx-auto" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  />
                </div>
              </motion.div>
              <CardTitle className="text-4xl font-bold mb-2">
                Order Successful!
              </CardTitle>
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Confirmation Email Sent</h3>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ve sent a confirmation email with your order details and tracking information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Package className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Order Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Your order is being prepared and will be shipped within 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => router.push("/shop")}
                >
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => router.push("/")}
                >
                  Back to Home
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Need help? Contact us at{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-primary hover:underline"
                  >
                    support@example.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
