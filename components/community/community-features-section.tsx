"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Calendar, Award, Video, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";

const features = [
  {
    icon: MessageSquare,
    title: "Private Forums",
    description: "Connect with members, ask questions, and share your journey in our exclusive community forums.",
  },
  {
    icon: Users,
    title: "Accountability Partners",
    description: "Get matched with accountability partners who share similar goals and keep each other motivated.",
  },
  {
    icon: Calendar,
    title: "Group Challenges",
    description: "Join monthly challenges, compete with others, and win prizes while staying motivated.",
  },
  {
    icon: Video,
    title: "Live Workouts",
    description: "Participate in live group workouts and training sessions with certified coaches.",
  },
  {
    icon: Award,
    title: "Achievement System",
    description: "Earn badges, level up, and celebrate milestones as you progress on your fitness journey.",
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description: "Access exclusive workout plans, meal prep guides, and educational content.",
  },
];

export default function CommunityFeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`${sectionClasses.xl} bg-gradient-to-b from-zone-pink-base via-zone-pink-secondary/20 to-zone-pink-base relative`}>
      {/* Pink Zone Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zone-pink-primary to-transparent" />
      <div className={containerClasses.default}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            Community Features
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Everything you need to stay connected and motivated
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full transition-all border-2 border-zone-pink-secondary/30 bg-zone-pink-base/50 backdrop-blur-sm hover:border-zone-pink-primary hover:shadow-lg hover:shadow-zone-pink-primary/20">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zone-pink-primary/10 border border-zone-pink-primary/20">
                    <feature.icon className="h-6 w-6 text-zone-pink-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
