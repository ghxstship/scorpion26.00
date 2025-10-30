"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    name: "Sarah Johnson",
    age: 32,
    result: "Lost 45 lbs in 90 days",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "I never thought I could achieve this. The program changed my life completely!",
    rating: 5,
    program: "90-Day Transformation",
  },
  {
    name: "Mike Chen",
    age: 28,
    result: "Gained 20 lbs muscle",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "Best investment I've made. The coaching and community support are incredible.",
    rating: 5,
    program: "Strength Building",
  },
  {
    name: "Emily Rodriguez",
    age: 35,
    result: "Lost 30 lbs, kept it off",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "Finally found a sustainable approach. No more yo-yo dieting!",
    rating: 5,
    program: "Weight Loss",
  },
];

const stats = [
  { value: "100,000+", label: "Members Worldwide" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "2M+ lbs", label: "Total Weight Lost" },
  { value: "98%", label: "Success Rate" },
];

export default function SocialProofSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-montserrat text-4xl font-bold sm:text-5xl">
            Real People, Real Results
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Join thousands who transformed their lives
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 grid grid-cols-2 gap-6 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-6 text-center">
                <div className="font-montserrat text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="mb-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="mb-6 text-foreground/80">
                    "{testimonial.quote}"
                  </p>

                  {/* Profile */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.result}
                      </div>
                      <div className="text-xs text-primary">
                        {testimonial.program}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Video Testimonials CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-muted-foreground">
            Want to see more transformations?
          </p>
          <a
            href="/results"
            className="mt-2 inline-block font-semibold text-primary hover:underline"
          >
            View All Success Stories →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
