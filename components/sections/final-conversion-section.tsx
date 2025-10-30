"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Mail, Smartphone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const benefits = [
  "7 free workout videos delivered instantly",
  "Personalized nutrition guide",
  "Access to our private community",
  "Weekly fitness tips and motivation",
];

export default function FinalConversionSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Mail className="mx-auto mb-6 h-16 w-16" />
            <h2 className="font-montserrat text-4xl font-bold sm:text-5xl">
              Start Your Transformation Today
            </h2>
            <p className="mt-4 text-xl opacity-90">
              Get 7 free workout videos and join 100K+ members on their fitness journey
            </p>
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* Email Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <form className="flex flex-col gap-4 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 h-14 bg-background text-foreground text-lg"
                required
              />
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg whitespace-nowrap"
              >
                Get Started Free
              </Button>
            </form>
            <p className="mt-4 text-center text-sm opacity-75">
              No credit card required. Unsubscribe anytime.
            </p>
          </motion.div>

          {/* App Download */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 border-t border-primary-foreground/20 pt-12 text-center"
          >
            <div className="mb-6 flex items-center justify-center gap-2">
              <Smartphone className="h-6 w-6" />
              <p className="text-lg font-semibold">Download Our Mobile App</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="min-w-[200px]"
              >
                <Link href="#app">
                  <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  App Store
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="min-w-[200px]"
              >
                <Link href="#app">
                  <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Google Play
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center opacity-90"
          >
            <div>
              <div className="text-3xl font-bold">100K+</div>
              <div className="text-sm">Active Members</div>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20" />
            <div>
              <div className="text-3xl font-bold">4.9/5</div>
              <div className="text-sm">App Rating</div>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20" />
            <div>
              <div className="text-3xl font-bold">2M+</div>
              <div className="text-sm">Workouts Completed</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
