"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Rating } from "@/components/atoms/rating";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

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
    <section ref={ref} className={`${spacingClasses.sectionY.lg} bg-muted/30`}>
      <div className={`container mx-auto ${spacingClasses.containerX}`}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={`${spacingClasses.mb.xl} text-center`}
        >
          <Heading level={2} className="font-heading">
            Real People, Real Results
          </Heading>
          <Text variant="body-lg" className={`${spacingClasses.mt.md} text-muted-foreground`}>
            Join thousands who transformed their lives
          </Text>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${spacingClasses.mb.xl} grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4`}
        >
          {stats.map((stat, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-4 sm:p-6 text-center">
                <Heading level={3} className="font-heading text-2xl sm:text-3xl md:text-4xl text-primary">
                  {stat.value}
                </Heading>
                <Text variant="body-sm" className="mt-2 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </Text>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className={gridClasses.cards['3col']}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full transition-all hover:shadow-lg">
                <CardContent className={spacingClasses.card}>
                  {/* Rating */}
                  <div className={spacingClasses.mb.md}>
                    <Rating rating={testimonial.rating} size="md" />
                  </div>

                  {/* Quote */}
                  <Text variant="body-md" className={`${spacingClasses.mb.lg} text-foreground/80`}>
                    &ldquo;{testimonial.quote}&rdquo;
                  </Text>

                  {/* Profile */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <Text variant="label" className="font-semibold text-sm sm:text-base">{testimonial.name}</Text>
                      <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground">
                        {testimonial.result}
                      </Text>
                      <Text variant="caption" className="text-xs text-primary">
                        {testimonial.program}
                      </Text>
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
          className={`${spacingClasses.mt.xl} text-center`}
        >
          <Text variant="body-lg" className="text-muted-foreground">
            Want to see more transformations?
          </Text>
          <a
            href="/results"
            className={`${spacingClasses.mt.sm} inline-block font-semibold text-primary hover:underline`}
          >
            View All Success Stories →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
