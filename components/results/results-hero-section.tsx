"use client";

import { motion } from "framer-motion";

export default function ResultsHeroSection() {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="font-montserrat text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Real People, Real Results
          </h1>
          <p className="mt-6 text-xl text-muted-foreground sm:text-2xl">
            Over 100,000 transformations and counting
          </p>
          <p className="mt-4 text-lg text-foreground/80">
            Every transformation you see here is verified and achieved through our science-based programs
          </p>
        </motion.div>
      </div>
    </section>
  );
}
