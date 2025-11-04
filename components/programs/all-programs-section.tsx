"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Dumbbell, Target, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";

const programs = [
  {
    id: "transformation",
    name: "90-Day Transformation",
    tagline: "Complete body recomposition program",
    price: 197,
    duration: "90 days",
    difficulty: "All Levels",
    badge: "Most Popular",
    zone: "orange", // VIP/Premium
    features: [
      "Personalized workout plans",
      "Custom nutrition guidance",
      "Weekly progress check-ins",
      "Private community access",
      "Video form analysis",
      "24/7 coach support",
    ],
    results: "Average 20-45 lbs lost",
  },
  {
    id: "strength",
    name: "Strength Building",
    tagline: "Build serious muscle mass",
    price: 147,
    duration: "12 weeks",
    difficulty: "Intermediate",
    badge: null,
    zone: "orange", // VIP/Premium
    features: [
      "Progressive overload training",
      "Muscle-building nutrition",
      "Form video analysis",
      "Supplement guidance",
      "Strength tracking tools",
      "Recovery protocols",
    ],
    results: "Average 10-20 lbs muscle gain",
  },
  {
    id: "weight-loss",
    name: "Weight Loss Mastery",
    tagline: "Sustainable fat loss without deprivation",
    price: 127,
    duration: "8 weeks",
    difficulty: "Beginner",
    badge: "Best Value",
    zone: "yellow", // Core/Basic
    features: [
      "Calorie-optimized meal plans",
      "Fat-burning workouts",
      "Habit coaching",
      "Accountability system",
      "Mindset training",
      "Maintenance plan",
    ],
    results: "Average 15-30 lbs lost",
  },
  {
    id: "nutrition",
    name: "Nutrition Coaching",
    tagline: "Master your diet for life",
    price: 97,
    duration: "6 weeks",
    difficulty: "All Levels",
    badge: null,
    zone: "yellow", // Core/Basic
    features: [
      "Personalized macro targets",
      "Meal planning templates",
      "Recipe database access",
      "Grocery shopping guides",
      "Restaurant eating strategies",
      "Flexible dieting education",
    ],
    results: "Learn sustainable eating habits",
  },
  {
    id: "athlete",
    name: "Athletic Performance",
    tagline: "Train like an elite athlete",
    price: 247,
    duration: "16 weeks",
    difficulty: "Advanced",
    badge: null,
    zone: "orange", // VIP/Premium
    features: [
      "Sport-specific training",
      "Power & speed development",
      "Mobility & flexibility work",
      "Performance nutrition",
      "Recovery optimization",
      "Mental performance coaching",
    ],
    results: "Measurable performance gains",
  },
  {
    id: "home",
    name: "Home Workout Program",
    tagline: "Get fit without a gym",
    price: 77,
    duration: "8 weeks",
    difficulty: "All Levels",
    badge: null,
    zone: "yellow", // Core/Basic
    features: [
      "No equipment needed",
      "30-minute workouts",
      "Bodyweight progressions",
      "Minimal space required",
      "Family-friendly options",
      "Flexible scheduling",
    ],
    results: "Achieve results at home",
  },
];

export default function AllProgramsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="programs" ref={ref} className={`${sectionClasses.xl} bg-gradient-to-b from-zone-yellow-base via-zone-yellow-secondary/20 to-zone-orange-base relative`}>
      {/* Zone transition gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zone-yellow-base/50 via-transparent to-zone-orange-base/50 pointer-events-none" />
      <div className={`${containerClasses.default} relative z-10`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <Heading level={2} className="font-heading text-4xl sm:text-5xl">
            All Programs
          </Heading>
          <Text variant="body-lg" className="mt-4 text-muted-foreground">
            Every program includes our 30-day money-back guarantee
          </Text>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className={`flex h-full flex-col transition-all border-2 ${
                program.zone === 'yellow' 
                  ? 'bg-zone-yellow-base/50 border-zone-yellow-secondary/30 hover:border-zone-yellow-primary hover:shadow-zone-yellow-primary/20' 
                  : 'bg-zone-orange-base/50 border-zone-orange-secondary/30 hover:border-zone-orange-primary hover:shadow-zone-orange-primary/20'
              } hover:shadow-2xl backdrop-blur-sm`}>
                {/* Zone accent bar */}
                <div className={`h-1 ${program.zone === 'yellow' ? 'bg-zone-yellow-primary' : 'bg-zone-orange-primary'}`} />
                {program.badge && (
                  <div className="p-4 pb-0">
                    <Badge className={program.zone === 'yellow' ? 'bg-zone-yellow-primary' : 'bg-zone-orange-primary'}>{program.badge}</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{program.name}</CardTitle>
                  <CardDescription className="text-base">
                    {program.tagline}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="mb-6">
                    <Text variant="body-lg" className="text-4xl font-bold">${program.price}</Text>
                    <Text variant="body-sm" className="text-muted-foreground">One-time payment</Text>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Icon icon={Clock} size="sm" className={program.zone === 'yellow' ? 'text-zone-yellow-primary' : 'text-zone-orange-primary'} aria-hidden={true} />
                      {program.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon icon={Dumbbell} size="sm" className={program.zone === 'yellow' ? 'text-zone-yellow-primary' : 'text-zone-orange-primary'} aria-hidden={true} />
                      {program.difficulty}
                    </div>
                  </div>

                  <div className={`mb-4 rounded-lg p-3 ${
                    program.zone === 'yellow' 
                      ? 'bg-zone-yellow-primary/10 border border-zone-yellow-primary/20' 
                      : 'bg-zone-orange-primary/10 border border-zone-orange-primary/20'
                  }`}>
                    <div className={`flex items-center gap-2 text-sm font-semibold ${
                      program.zone === 'yellow' ? 'text-zone-yellow-primary' : 'text-zone-orange-primary'
                    }`}>
                      <Icon icon={Target} size="sm" aria-hidden={true} />
                      {program.results}
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {program.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <Icon icon={Check} size="sm" className={`mr-2 mt-0.5 flex-shrink-0 ${
                          program.zone === 'yellow' ? 'text-zone-yellow-primary' : 'text-zone-orange-primary'
                        }`} aria-hidden={true} />
                        <Text variant="body-sm" className={program.zone === 'yellow' ? 'text-zone-yellow-metallic/90' : 'text-zone-orange-metallic/90'}>{feature}</Text>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/programs/${program.id}`}>
                      Get Started
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="w-full">
                    <Link href={`/programs/${program.id}`}>
                      Learn More →
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
