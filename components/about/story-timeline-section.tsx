"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-montserrat text-4xl font-bold sm:text-5xl">
            The Journey
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            From personal transformation to global impact
          </p>
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
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span className="font-bold text-primary">{item.year}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
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
