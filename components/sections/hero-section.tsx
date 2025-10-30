"use client";

import { Button } from "@/components/ui/button";
import { Play, Users, Award, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: "100K+", label: "Lives Changed" },
  { icon: Award, value: "4.9/5", label: "Rating" },
  { icon: TrendingUp, value: "50+", label: "Programs" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zone-red-primary/10 via-zone-red-base to-zone-red-secondary/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Red Zone Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zone-red-primary to-transparent" />
      
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zone-red-base/50 to-zone-red-base" />

      <div className="container relative z-10 mx-auto px-3 sm:px-4 py-20 sm:py-24 md:py-28 lg:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-montserrat text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Transform Your Body in{" "}
              <span className="bg-gradient-to-r from-zone-red-primary via-zone-red-accent to-zone-red-primary bg-clip-text text-transparent">
                90 Days
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground px-4"
          >
            Join 100,000+ members who achieved lasting results with our
            science-based programs, expert coaching, and supportive community
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 sm:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4"
          >
            <Button size="lg" asChild className="text-sm sm:text-base md:text-lg h-11 sm:h-12 md:h-14">
              <Link href="/join">
                Start Your Journey
                <TrendingUp className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-sm sm:text-base md:text-lg h-11 sm:h-12 md:h-14">
              <Link href="#video">
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Watch Success Stories
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 sm:mt-14 md:mt-16 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-1.5 sm:mb-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-zone-red-primary/10 border border-zone-red-primary/20">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-zone-red-primary" />
                </div>
                <div className="font-montserrat text-xl sm:text-2xl md:text-3xl font-bold text-zone-red-metallic">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16"
          >
            <div className="mx-auto h-12 w-6 rounded-full border-2 border-primary/30">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mx-auto mt-2 h-2 w-2 rounded-full bg-primary"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
