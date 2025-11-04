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
    <section ref={ref} className="py-24 bg-gradient-to-b from-zone-red-base via-zone-red-secondary/30 to-zone-red-base relative">
      {/* Red Zone Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zone-red-primary to-transparent" />
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <Heading level={2} className="font-montserrat text-4xl sm:text-5xl">
            Why Elite Fitness Works
          </Heading>
          <Text variant="body-lg" className="mt-4 text-muted-foreground">
            Three pillars of sustainable transformation
          </Text>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full border-2 border-zone-red-secondary/30 bg-zone-red-base/50 backdrop-blur-sm transition-all hover:border-zone-red-primary hover:shadow-lg hover:shadow-zone-red-primary/20">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zone-red-primary/10 border border-zone-red-primary/20">
                    <Icon icon={feature.icon} size="2xl" className="text-zone-red-primary" aria-hidden={true} />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <Text variant="body-sm" className="mr-2 mt-1 text-zone-red-primary">✓</Text>
                        <Text variant="body-sm" className="text-zone-red-metallic/90">{benefit}</Text>
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
          className="mt-16 text-center"
        >
          <Button size="lg" asChild>
            <Link href="/about">Learn More About Our Method</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
