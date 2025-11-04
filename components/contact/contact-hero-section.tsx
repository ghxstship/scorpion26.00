"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

export default function ContactHeroSection() {
  return (
    <section className="relative min-h-[35vh] sm:min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Heading level={1} className="font-montserrat text-3xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Get In Touch
          </Heading>
          <Text variant="body-lg" className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground px-4">
            Have questions? We&apos;re here to help you start your fitness journey
          </Text>
        </motion.div>
      </div>
    </section>
  );
}
