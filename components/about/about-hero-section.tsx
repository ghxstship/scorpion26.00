"use client";

import Image from "next/image";
import { Award } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";
import { motion } from "framer-motion";

export default function AboutHeroSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`max-w-3xl mx-auto text-center ${spacingClasses.gap.lg}`}>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading level={1} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">About Elite Fitness</Heading>
            <Text variant="body-lg" className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              From personal struggle to transforming 100,000+ lives
            </Text>
            <Text variant="body-lg" className="mt-4 sm:mt-6 text-base sm:text-lg text-foreground/80 px-4">
              What started as a personal journey to overcome weight struggles
              has evolved into a global movement helping people achieve lasting
              transformations through science-based methods and genuine support.
            </Text>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-6 sm:gap-8 justify-center">
              <div>
                <Heading level={3} className="text-3xl sm:text-4xl font-bold text-primary">10+</Heading>
                <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground">Years Experience</Text>
              </div>
              <div>
                <Heading level={3} className="text-3xl sm:text-4xl font-bold text-primary">100K+</Heading>
                <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground">Lives Changed</Text>
              </div>
              <div>
                <Heading level={3} className="text-3xl sm:text-4xl font-bold text-primary">4.9/5</Heading>
                <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground">Member Rating</Text>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon={Award} size="md" className="text-primary sm:h-8 sm:w-8" aria-hidden={true} />
                <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground">Award Winning</Text>
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
