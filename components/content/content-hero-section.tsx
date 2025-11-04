"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { heroClasses } from "@/lib/design-tokens";

export default function ContentHeroSection() {
  return (
    <section className={`relative ${heroClasses.lg} flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-24`}>
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <Heading level={1} className="font-montserrat text-5xl leading-tight sm:text-6xl lg:text-7xl">
            Free Fitness Content
          </Heading>
          <Text variant="body-lg" className="mt-6 text-muted-foreground sm:text-2xl">
            Workouts, nutrition tips, and transformation stories
          </Text>
          <Text variant="body-md" className="mt-4 text-foreground/80">
            New content added every week to help you on your fitness journey
          </Text>
        </motion.div>
      </div>
    </section>
  );
}
