"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function GuaranteeSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-8 lg:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <Shield className="mx-auto mb-6 h-16 w-16 text-primary" />
                <h2 className="mb-4 font-montserrat text-3xl font-bold sm:text-4xl">
                  30-Day Money-Back Guarantee
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  We're so confident in our programs that we offer a full refund if you're not completely satisfied within the first 30 days. No questions asked.
                </p>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center">
                    <Clock className="mb-3 h-8 w-8 text-primary" />
                    <h3 className="mb-2 font-semibold">30 Days</h3>
                    <p className="text-sm text-muted-foreground">
                      Full refund period
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <RefreshCw className="mb-3 h-8 w-8 text-primary" />
                    <h3 className="mb-2 font-semibold">Easy Process</h3>
                    <p className="text-sm text-muted-foreground">
                      Simple refund request
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Shield className="mb-3 h-8 w-8 text-primary" />
                    <h3 className="mb-2 font-semibold">No Questions</h3>
                    <p className="text-sm text-muted-foreground">
                      Hassle-free guarantee
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
