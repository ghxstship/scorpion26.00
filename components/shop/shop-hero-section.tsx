"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { containerClasses, heroClasses } from "@/lib/design-tokens";

export default function ShopHeroSection() {
  return (
    <section className={`relative ${heroClasses.md} flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-24`}>
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Heading level={1} className="font-montserrat text-5xl leading-tight sm:text-6xl lg:text-7xl">
            Shop
          </Heading>
          <Text variant="body-lg" className="mt-6 text-muted-foreground sm:text-2xl">
            Premium fitness gear and supplements
          </Text>
        </motion.div>
      </div>
    </section>
  );
}
