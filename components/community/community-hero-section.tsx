"use client";

import { motion } from "framer-motion";

export default function CommunityHeroSection() {
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
            Join Our Community
          </h1>
          <p className="mt-6 text-xl text-muted-foreground sm:text-2xl">
            100K+ members supporting each other every day
          </p>
          <p className="mt-4 text-lg text-foreground/80">
            You don&apos;t have to do this alone. Connect, share, and grow together.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
