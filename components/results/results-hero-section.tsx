"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { containerClasses, heroClasses, spacingClasses } from "@/lib/design-tokens";

export default function ResultsHeroSection() {
  return (
    <section className={`relative ${heroClasses.lg} ${spacingClasses.sectionY.lg} flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10`}>
      <div className={containerClasses.default}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <Heading level={1} className="font-heading text-5xl leading-tight sm:text-6xl lg:text-7xl">
            Real People, Real Results
          </Heading>
          <Text variant="body-lg" className="mt-6 text-muted-foreground sm:text-2xl">
            Over 100,000 transformations and counting
          </Text>
          <Text variant="body-md" className="mt-4 text-foreground/80">
            Every transformation you see here is verified and achieved through our science-based programs
          </Text>
        </motion.div>
      </div>
    </section>
  );
}
