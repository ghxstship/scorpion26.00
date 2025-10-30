"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, FileText, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";

const categories = ["All", "Workouts", "Nutrition", "Mindset", "Success Stories"];

const contentItems = [
  {
    type: "Video",
    category: "Workouts",
    title: "30-Minute Full Body HIIT Workout",
    excerpt: "Burn calories and build strength with this intense home workout. No equipment needed.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    date: "Mar 20, 2024",
    readTime: "30 min",
    icon: Video,
  },
  {
    type: "Article",
    category: "Nutrition",
    title: "The Ultimate Guide to Meal Prep",
    excerpt: "Learn how to prepare a week's worth of healthy meals in just 2 hours.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
    date: "Mar 18, 2024",
    readTime: "8 min read",
    icon: FileText,
  },
  {
    type: "Success Story",
    category: "Success Stories",
    title: "How Sarah Lost 45 Pounds in 90 Days",
    excerpt: "The inspiring journey of one member's sustainable transformation.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop",
    date: "Mar 15, 2024",
    readTime: "6 min read",
    icon: Users,
  },
  {
    type: "Video",
    category: "Workouts",
    title: "Beginner Strength Training Basics",
    excerpt: "Perfect introduction to weight training for complete beginners.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    date: "Mar 12, 2024",
    readTime: "25 min",
    icon: Video,
  },
  {
    type: "Article",
    category: "Nutrition",
    title: "10 High-Protein Breakfast Ideas",
    excerpt: "Start your day right with these delicious and nutritious breakfast recipes.",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=600&fit=crop",
    date: "Mar 10, 2024",
    readTime: "5 min read",
    icon: FileText,
  },
  {
    type: "Article",
    category: "Mindset",
    title: "Building Sustainable Fitness Habits",
    excerpt: "The psychology behind lasting behavior change and how to apply it.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    date: "Mar 8, 2024",
    readTime: "7 min read",
    icon: FileText,
  },
];

export default function ContentGridSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredContent = activeCategory === "All" 
    ? contentItems 
    : contentItems.filter(item => item.category === activeCategory);

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap justify-center gap-3"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <Badge className="absolute left-4 top-4 bg-background/90 text-foreground">
                    <item.icon className="mr-1 h-3 w-3" />
                    {item.type}
                  </Badge>
                </div>

                <CardHeader>
                  <div className="mb-2 text-sm font-semibold text-primary">
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
                  <Button variant="ghost" className="mt-4 w-full" asChild>
                    <Link href="#">Read More →</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
