"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutHeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-montserrat text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              Our Story
            </h1>
            <p className="mt-6 text-xl text-muted-foreground sm:text-2xl">
              From personal struggle to transforming 100,000+ lives
            </p>
            <p className="mt-6 text-lg text-foreground/80">
              What started as a personal journey to overcome weight struggles
              has evolved into a global movement helping people achieve lasting
              transformations through science-based methods and genuine support.
            </p>
            <div className="mt-8 flex flex-wrap gap-8">
              <div>
                <div className="text-4xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">100K+</div>
                <div className="text-sm text-muted-foreground">Lives Changed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">4.9/5</div>
                <div className="text-sm text-muted-foreground">Member Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop"
                alt="Our Story"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
