"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { containerClasses, heroClasses } from "@/lib/design-tokens";

export default function FAQHeroSection() {
  return (
    <section className={`relative ${heroClasses.md} flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-24`}>
      <div className={containerClasses.default}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Heading level={1} className="font-montserrat text-5xl leading-tight sm:text-6xl lg:text-7xl">
            Frequently Asked Questions
          </Heading>
          <Text variant="body-lg" className="mt-6 text-muted-foreground sm:text-2xl">
            Everything you need to know about our programs
          </Text>
        </motion.div>
      </div>
    </section>
  );
}
