"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Award, TrendingUp } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";
import Link from "next/link";
import { motion } from "framer-motion";
import { StatCard } from "@/components/molecules/stat-card";

const stats = [
  { icon: Users, value: "100K+", label: "Lives Changed" },
  { icon: Award, value: "4.9/5", label: "Rating" },
  { icon: TrendingUp, value: "50+", label: "Programs" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary to-muted dark:from-zinc-950 dark:via-zinc-900 dark:to-black" aria-label="Hero section">
      {/* Brand color gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zone-red-primary/15 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-zone-red-accent/10 via-transparent to-transparent" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zone-red-primary/50 to-transparent" />
      
      {/* Atmospheric glow effect - stronger for brand presence */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-250 h-250 bg-zone-red-primary/8 rounded-full blur-3xl" />
      
      {/* Vignette for text contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(255,255,255,0.3)_100%)] dark:bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />

      <div className={`container relative z-10 mx-auto ${spacingClasses.containerX} ${spacingClasses.sectionY.lg}`}>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading level={1} display="md" className="font-montserrat text-foreground">
              Transform Your Body in{" "}
              <span className="bg-gradient-to-r from-zone-red-primary via-zone-red-accent to-zone-red-primary bg-clip-text text-transparent">
                90 Days
              </span>
            </Heading>
          </motion.div>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={spacingClasses.mt.md}
          >
            <Text variant="body-lg" className="text-xl md:text-2xl text-muted-foreground mb-8">
              Join 100,000+ members who achieved lasting results with our
              science-based programs, expert coaching, and supportive community
            </Text>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${spacingClasses.mt.lg} flex flex-col gap-4 sm:flex-row sm:justify-center`}
          >
            <Button size="lg" asChild>
              <Link href="/join">
                Start Your Journey
                <Icon icon={ArrowRight} size="md" className="ml-2" aria-hidden={true} />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="#video">
                <Icon icon={Play} size="md" className="mr-2" aria-hidden={true} />
                Watch Success Stories
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`${spacingClasses.mt.xl} grid grid-cols-3 gap-4 sm:gap-6 md:gap-8`}
            role="list"
            aria-label="Company statistics"
          >
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                iconColor="text-zone-red-primary"
                iconBgColor="bg-zone-red-primary/10"
              />
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16"
            aria-hidden="true"
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
