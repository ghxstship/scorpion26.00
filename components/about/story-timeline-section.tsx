"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";

const timeline = [
  {
    year: "2014",
    title: "The Struggle",
    description: "60 pounds overweight, exhausted, and frustrated with failed diets. Hit rock bottom and decided enough was enough.",
  },
  {
    year: "2015",
    title: "The Discovery",
    description: "Found science-based training methods. Lost 60 pounds in 9 months through sustainable habits, not quick fixes.",
  },
  {
    year: "2016",
    title: "Helping Others",
    description: "Started coaching friends and family. Realized the power of combining science with genuine support.",
  },
  {
    year: "2017",
    title: "Going Professional",
    description: "Earned certifications and launched online coaching. Helped first 100 clients achieve transformations.",
  },
  {
    year: "2019",
    title: "Building Community",
    description: "Created private community platform. Members started supporting each other's journeys.",
  },
  {
    year: "2021",
    title: "Scaling Impact",
    description: "Reached 10,000 members. Featured in major fitness publications. Expanded team of coaches.",
  },
  {
    year: "2023",
    title: "Global Movement",
    description: "Surpassed 100,000 members worldwide. Launched mobile app and expanded program offerings.",
  },
  {
    year: "2024",
    title: "Today",
    description: "Leading the industry in sustainable transformations. Continuing to innovate and serve our community.",
  },
];

export default function StoryTimelineSection() {
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
          <Heading level={2} className="font-heading text-4xl sm:text-5xl">
            The Journey
          </Heading>
          <Text variant="body-lg" className="mt-4 text-muted-foreground">
            From personal transformation to global impact
          </Text>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 lg:left-1/2" />

          {/* Timeline items */}
          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 flex h-4 w-4 items-center justify-center rounded-full bg-primary lg:left-1/2 lg:-translate-x-1/2">
                  <div className="h-2 w-2 rounded-full bg-background" />
                </div>

                {/* Content */}
                <div className={`ml-20 lg:ml-0 lg:w-1/2 ${index % 2 === 0 ? "lg:pr-12" : "lg:pl-12"}`}>
                  <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-2 flex items-center gap-2">
                        <Icon icon={CheckCircle2} size="lg" className="text-primary" aria-hidden={true} />
                        <span className="font-bold text-primary">{item.year}</span>
                      </div>
                      <Heading level={3} className="mb-2 text-xl">{item.title}</Heading>
                      <Text variant="body-md" className="text-muted-foreground">{item.description}</Text>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
