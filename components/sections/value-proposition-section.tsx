"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Users2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";

const features = [
  {
    icon: Brain,
    title: "Science-Based Approach",
    description: "Evidence-backed methods proven by research and thousands of success stories",
    benefits: [
      "Personalized nutrition plans",
      "Progressive training protocols",
      "Data-driven adjustments",
      "Expert-designed programs",
    ],
  },
  {
    icon: Users2,
    title: "Community Support",
    description: "Connect with like-minded individuals on the same journey to greatness",
    benefits: [
      "24/7 community access",
      "Weekly group challenges",
      "Accountability partners",
      "Member success events",
    ],
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "Track your progress with our comprehensive metrics and celebrate milestones",
    benefits: [
      "Real-time progress tracking",
      "Before/after comparisons",
      "Performance analytics",
      "Achievement rewards",
    ],
  },
];

export default function ValuePropositionSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`${sectionClasses.md} bg-gradient-to-b from-muted/30 via-background to-muted/30 relative`}>
      {/* Red Zone Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zone-red-primary to-transparent" />
      <div className={containerClasses.default}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-14 md:mb-16 text-center"
        >
          <Heading level={2} className="font-montserrat text-3xl sm:text-4xl md:text-5xl">
            Why Elite Fitness Works
          </Heading>
          <Text variant="body-lg" className="mt-3 sm:mt-4 text-muted-foreground px-4">
            Three pillars of sustainable transformation
          </Text>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full border-2 border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <CardHeader className="p-5 sm:p-6">
                  <div className="mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                    <Icon icon={feature.icon} size="xl" className="text-primary sm:h-10 sm:w-10" aria-hidden={true} />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 sm:p-6 pt-0">
                  <ul className="space-y-2.5 sm:space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <Text variant="body-sm" className="mr-2 mt-0.5 text-primary flex-shrink-0">✓</Text>
                        <Text variant="body-sm" className="text-muted-foreground text-sm">{benefit}</Text>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 sm:mt-14 md:mt-16 text-center"
        >
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/about">Learn More About Our Method</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
