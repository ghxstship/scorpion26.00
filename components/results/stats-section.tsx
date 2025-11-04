"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Award, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const stats = [
  { icon: Users, value: "100,000+", label: "Members Transformed" },
  { icon: TrendingUp, value: "2M+ lbs", label: "Total Weight Lost" },
  { icon: Award, value: "4.9/5", label: "Average Rating" },
  { icon: Target, value: "98%", label: "Success Rate" },
];

export default function StatsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-16 md:py-20 bg-gradient-to-b from-zone-blue-base via-zone-blue-secondary/20 to-zone-blue-base relative">
      {/* Blue Zone Accent Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zone-blue-primary to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zone-blue-accent to-transparent" />
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-2 border-zone-blue-secondary/30 bg-zone-blue-base/50 backdrop-blur-sm text-center hover:border-zone-blue-primary transition-all">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-zone-blue-primary/10 border border-zone-blue-primary/20">
                    <stat.icon className="h-6 w-6 text-zone-blue-accent" />
                  </div>
                  <div className="font-heading text-4xl font-bold text-zone-blue-primary">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
