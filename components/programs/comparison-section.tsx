"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const features = [
  "Personalized workout plans",
  "Custom nutrition guidance",
  "Progress tracking",
  "Community access",
  "Video form analysis",
  "24/7 coach support",
  "Meal planning templates",
  "Recipe database",
  "Mobile app access",
  "Money-back guarantee",
];

const programs = [
  { name: "90-Day Transform", price: "$197", features: [true, true, true, true, true, true, true, true, true, true] },
  { name: "Strength Building", price: "$147", features: [true, true, true, true, true, true, false, false, true, true] },
  { name: "Weight Loss", price: "$127", features: [true, true, true, true, false, true, true, true, true, true] },
];

export default function ComparisonSection() {
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
            Compare Programs
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Find the perfect fit for your goals
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-left font-semibold">Features</th>
                      {programs.map((program, index) => (
                        <th key={index} className="p-4 text-center">
                          <div className="font-semibold">{program.name}</div>
                          <div className="text-sm text-muted-foreground">{program.price}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, featureIndex) => (
                      <tr key={featureIndex} className="border-b last:border-0">
                        <td className="p-4 text-sm">{feature}</td>
                        {programs.map((program, programIndex) => (
                          <td key={programIndex} className="p-4 text-center">
                            {program.features[featureIndex] ? (
                              <Check className="mx-auto h-5 w-5 text-primary" />
                            ) : (
                              <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
