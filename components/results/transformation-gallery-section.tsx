"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";

const transformations = [
  {
    name: "Sarah Johnson",
    age: 32,
    program: "90-Day Transformation",
    result: "Lost 45 lbs",
    timeframe: "90 days",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "I never thought I could achieve this!",
  },
  {
    name: "Mike Chen",
    age: 28,
    program: "Strength Building",
    result: "Gained 20 lbs muscle",
    timeframe: "12 weeks",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "Best investment I've made.",
  },
  {
    name: "Emily Rodriguez",
    age: 35,
    program: "Weight Loss",
    result: "Lost 30 lbs",
    timeframe: "8 weeks",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "Finally found a sustainable approach.",
  },
  {
    name: "David Thompson",
    age: 42,
    program: "90-Day Transformation",
    result: "Lost 50 lbs",
    timeframe: "90 days",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    quote: "Changed my life completely.",
  },
  {
    name: "Jessica Lee",
    age: 29,
    program: "Strength Building",
    result: "Gained 15 lbs muscle",
    timeframe: "12 weeks",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    quote: "Stronger than ever before.",
  },
  {
    name: "Robert Martinez",
    age: 38,
    program: "Weight Loss",
    result: "Lost 40 lbs",
    timeframe: "10 weeks",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    quote: "The community support was incredible.",
  },
];

export default function TransformationGallerySection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`${sectionClasses.xl} bg-muted/30`}>
      <div className={containerClasses.default}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            Transformation Gallery
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Real results from real people
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {transformations.map((transformation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-square">
                  <Image
                    src={transformation.image}
                    alt={transformation.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute right-4 top-4 bg-primary">
                    {transformation.result}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-1 text-xl font-bold">{transformation.name}</h3>
                  <p className="mb-2 text-sm text-primary font-semibold">
                    {transformation.program}
                  </p>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {transformation.timeframe}
                  </p>
                  <p className="italic text-foreground/80">
                    &ldquo;{transformation.quote}&rdquo;
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
