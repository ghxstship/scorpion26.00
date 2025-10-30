"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const contentItems = [
  {
    type: "Article",
    category: "Nutrition",
    title: "The Ultimate Guide to Meal Prep for Busy Professionals",
    excerpt: "Learn how to prepare a week's worth of healthy meals in just 2 hours.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
    date: "Mar 15, 2024",
    readTime: "8 min read",
  },
  {
    type: "Video",
    category: "Workouts",
    title: "30-Minute Full Body HIIT Workout (No Equipment)",
    excerpt: "Burn calories and build strength with this intense home workout.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    date: "Mar 12, 2024",
    readTime: "30 min",
  },
  {
    type: "Success Story",
    category: "Transformation",
    title: "How Sarah Lost 45 Pounds and Kept It Off for 2 Years",
    excerpt: "The inspiring journey of one member's sustainable transformation.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop",
    date: "Mar 10, 2024",
    readTime: "6 min read",
  },
];

export default function ContentHubSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-zone-green-base via-zone-green-secondary/20 to-zone-green-base relative">
      {/* Green Zone Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zone-green-primary to-transparent" />
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-montserrat text-4xl font-bold sm:text-5xl">
            Latest Content
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Free workouts, nutrition tips, and success stories
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {contentItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="group h-full overflow-hidden transition-all border-2 border-zone-green-secondary/30 bg-zone-green-base/50 backdrop-blur-sm hover:border-zone-green-primary hover:shadow-lg hover:shadow-zone-green-primary/20">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <Badge className="absolute left-4 top-4 bg-zone-green-primary/90 text-white">
                    {item.type}
                  </Badge>
                </div>

                <CardHeader>
                  <div className="mb-2 text-sm font-semibold text-zone-green-primary">
                    {item.category}
                  </div>
                  <CardTitle className="line-clamp-2 text-xl">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {item.readTime}
                    </div>
                  </div>
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
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/content">View All Content</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
