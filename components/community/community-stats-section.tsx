"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle, Trophy, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const stats = [
  { icon: Users, value: "100K+", label: "Active Members" },
  { icon: MessageCircle, value: "50K+", label: "Daily Messages" },
  { icon: Trophy, value: "10K+", label: "Goals Achieved" },
  { icon: Heart, value: "1M+", label: "Support Reactions" },
];

export default function CommunityStatsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-2 text-center">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="font-heading text-4xl font-bold text-primary">
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
