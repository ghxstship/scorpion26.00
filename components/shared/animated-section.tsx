"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";
import { animationTokens } from "@/lib/animation-tokens";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale";
  delay?: number;
  duration?: keyof typeof animationTokens.duration;
  threshold?: keyof typeof animationTokens.viewport;
  once?: boolean;
}

const animationVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function AnimatedSection({
  children,
  className,
  animation = "slideUp",
  delay = 0,
  duration = "normal",
  threshold = "partial",
  once = true,
}: AnimatedSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: animationTokens.viewport[threshold],
  });

  const prefersReducedMotion = useReducedMotion();
  const variants = animationVariants[animation];

  // If user prefers reduced motion, just fade in
  const accessibleVariants = prefersReducedMotion
    ? animationVariants.fade
    : variants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={accessibleVariants}
      transition={{
        duration: animationTokens.duration[duration] / 1000,
        delay,
        ease: animationTokens.easing.easeOut,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
