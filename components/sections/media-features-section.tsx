"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const mediaLogos = [
  "ESPN",
  "Men's Health",
  "Shape Magazine",
  "Fitness",
  "Runner's World",
  "Women's Health",
];

export default function MediaFeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-16 bg-background border-y">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="mb-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            As Featured In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {mediaLogos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-2xl font-bold text-muted-foreground/60 transition-colors hover:text-foreground lg:text-3xl"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
