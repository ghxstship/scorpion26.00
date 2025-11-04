"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { formClasses } from "@/lib/design-tokens";

export default function NewsletterSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-8 text-center">
              <Mail className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h2 className="mb-2 font-heading text-3xl font-bold">
                Never Miss New Content
              </h2>
              <p className="mb-6 text-muted-foreground">
                Get weekly fitness tips, workout videos, and nutrition guides delivered to your inbox
              </p>
              <form className={formClasses.inline}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                  required
                />
                <Button type="submit" size="lg" className="whitespace-nowrap">
                  Subscribe Free
                </Button>
              </form>
              <p className="mt-4 text-xs text-muted-foreground">
                Join 50K+ subscribers. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
