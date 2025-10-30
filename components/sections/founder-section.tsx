"use client";

import { Button } from "@/components/ui/button";
import { Award, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const credentials = [
  { icon: Award, label: "Certified Personal Trainer" },
  { icon: BookOpen, label: "Sports Nutrition Specialist" },
  { icon: Users, label: "10+ Years Experience" },
];

export default function FounderSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&h=800&fit=crop"
                alt="Founder"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -right-6 rounded-xl bg-background p-6 shadow-xl">
              <div className="text-4xl font-bold text-primary">100K+</div>
              <div className="text-sm text-muted-foreground">
                Lives Transformed
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-montserrat text-4xl font-bold sm:text-5xl">
              Meet Your Coach
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              From struggling with weight to transforming 100,000+ lives
            </p>

            <div className="mt-6 space-y-4 text-foreground/80">
              <p>
                I know what it&apos;s like to feel stuck. Ten years ago, I was 60
                pounds overweight, exhausted, and had tried every fad diet
                imaginable. Nothing worked—until I discovered the science-based
                approach that changed everything.
              </p>
              <p>
                Today, I&apos;ve helped over 100,000 people achieve lasting
                transformations using the same proven methods. No gimmicks, no
                quick fixes—just sustainable results backed by science and
                supported by an incredible community.
              </p>
            </div>

            {/* Credentials */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {credentials.map((cred, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-lg bg-background p-4 text-center"
                >
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <cred.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-sm font-medium">{cred.label}</div>
                </div>
              ))}
            </div>

            {/* Media Features */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-muted-foreground">
                AS FEATURED IN
              </p>
              <div className="mt-4 flex flex-wrap gap-6 opacity-60">
                <div className="text-2xl font-bold">ESPN</div>
                <div className="text-2xl font-bold">MEN&apos;S HEALTH</div>
                <div className="text-2xl font-bold">SHAPE</div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/about">Read My Full Story</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
