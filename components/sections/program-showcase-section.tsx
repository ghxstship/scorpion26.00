"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Target } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const programs = [
  {
    title: "90-Day Transformation",
    tagline: "Complete body recomposition",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    duration: "90 days",
    difficulty: "All Levels",
    price: "$197",
    benefits: [
      "Personalized workout plans",
      "Custom nutrition guidance",
      "Weekly progress check-ins",
      "Private community access",
    ],
    badge: "Most Popular",
  },
  {
    title: "Strength Building",
    tagline: "Build serious muscle mass",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    duration: "12 weeks",
    difficulty: "Intermediate",
    price: "$147",
    benefits: [
      "Progressive overload training",
      "Muscle-building nutrition",
      "Form video analysis",
      "Supplement guidance",
    ],
    badge: null,
  },
  {
    title: "Weight Loss Mastery",
    tagline: "Sustainable fat loss",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    duration: "8 weeks",
    difficulty: "Beginner",
    price: "$127",
    benefits: [
      "Calorie-optimized meal plans",
      "Fat-burning workouts",
      "Habit coaching",
      "Accountability system",
    ],
    badge: "Best Value",
  },
];

export default function ProgramShowcaseSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-montserrat text-4xl font-bold sm:text-5xl">
            Choose Your Program
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Science-backed programs designed for real results
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="group h-full overflow-hidden transition-all hover:shadow-2xl">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url(${program.image})` }}
                  />
                  {program.badge && (
                    <Badge className="absolute right-4 top-4 bg-primary">
                      {program.badge}
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl">{program.title}</CardTitle>
                  <CardDescription className="text-base">
                    {program.tagline}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Meta Info */}
                  <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {program.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Dumbbell className="h-4 w-4" />
                      {program.difficulty}
                    </div>
                  </div>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {program.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <Target className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="mt-6">
                    <div className="text-3xl font-bold">{program.price}</div>
                    <div className="text-sm text-muted-foreground">
                      One-time payment
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/programs/${program.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      Learn More
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/programs">View All Programs</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
