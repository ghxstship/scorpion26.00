"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, Users2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const values = [
  {
    icon: Heart,
    title: "Authenticity",
    description: "We believe in real results, not false promises. Every transformation is genuine, every testimonial is verified.",
  },
  {
    icon: Target,
    title: "Science-Based",
    description: "Our methods are backed by research and proven by thousands of success stories. No fads, no gimmicks.",
  },
  {
    icon: Users2,
    title: "Community First",
    description: "We're more than a program—we're a supportive family. Your success is our success.",
  },
  {
    icon: Zap,
    title: "Sustainable Change",
    description: "We focus on long-term lifestyle changes, not quick fixes. Build habits that last a lifetime.",
  },
];

export default function MissionValuesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-montserrat text-4xl font-bold sm:text-5xl">
            Our Mission
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground">
            To empower individuals worldwide to achieve lasting fitness
            transformations through science-based methods, genuine support, and
            a community that celebrates every victory—big or small.
          </p>
        </motion.div>

        {/* Values */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 text-center text-3xl font-bold"
          >
            Our Core Values
          </motion.h3>

          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full border-2 transition-all hover:border-primary hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h3 className="mb-4 text-center text-2xl font-bold">
                Our Training Philosophy
              </h3>
              <p className="text-center text-lg text-muted-foreground">
                We believe fitness isn&apos;t about punishment—it&apos;s about empowerment.
                It&apos;s not about perfection—it&apos;s about progress. And it&apos;s not about
                doing it alone—it&apos;s about having a community that lifts you up
                when you need it most. Every body is different, every journey is
                unique, and every person deserves a sustainable path to their goals.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
