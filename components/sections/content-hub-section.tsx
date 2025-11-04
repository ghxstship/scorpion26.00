"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";

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
    <section ref={ref} className={`${sectionClasses.xl} bg-gradient-to-b from-muted/30 via-background to-muted/30 relative`}>
      {/* Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className={containerClasses.default}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <Heading level={2} className="font-montserrat text-4xl sm:text-5xl">
            Latest Content
          </Heading>
          <Text variant="body-lg" className="mt-4 text-muted-foreground">
            Free workouts, nutrition tips, and success stories
          </Text>
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
              <Card className="group h-full overflow-hidden transition-all border-2 border-border bg-card/50 backdrop-blur-sm hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <Badge className="absolute left-4 top-4 bg-primary/90 text-primary-foreground">
                    {item.type}
                  </Badge>
                </div>

                <CardHeader>
                  <Text variant="label" className="mb-2 text-primary">
                    {item.category}
                  </Text>
                  <CardTitle className="line-clamp-2 text-xl">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Icon icon={Calendar} size="sm" className="text-muted-foreground" aria-hidden={true} />
                      <Text variant="body-sm" className="text-muted-foreground">{item.date}</Text>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon icon={Clock} size="sm" className="text-muted-foreground" aria-hidden={true} />
                      <Text variant="body-sm" className="text-muted-foreground">{item.readTime}</Text>
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
          <Button variant="secondary" size="lg" asChild>
            <Link href="/content">View All Content</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
