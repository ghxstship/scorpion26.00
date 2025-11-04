"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, GraduationCap, Medal, Trophy, Users } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text as TextAtom } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const credentials = [
  {
    icon: GraduationCap,
    title: "NASM Certified Personal Trainer",
    organization: "National Academy of Sports Medicine",
    year: "2016",
  },
  {
    icon: BookOpen,
    title: "Precision Nutrition Level 1",
    organization: "Precision Nutrition",
    year: "2017",
  },
  {
    icon: Award,
    title: "Corrective Exercise Specialist",
    organization: "NASM",
    year: "2018",
  },
  {
    icon: Users,
    title: "Behavior Change Specialist",
    organization: "NASM",
    year: "2019",
  },
  {
    icon: Trophy,
    title: "Performance Enhancement Specialist",
    organization: "NASM",
    year: "2020",
  },
  {
    icon: Medal,
    title: "Master Trainer Certification",
    organization: "ACE",
    year: "2021",
  },
];

const achievements = [
  "Featured in Men's Health Magazine",
  "ESPN Fitness Expert Contributor",
  "Shape Magazine Top 10 Coaches",
  "Fitness Business Summit Keynote Speaker",
  "100K+ Client Transformations",
  "4.9/5 Average Client Rating",
];

export default function CredentialsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <Heading level={2} className="font-montserrat text-4xl sm:text-5xl">
            Credentials & Achievements
          </Heading>
          <TextAtom variant="body-lg" className="mt-4 text-muted-foreground">
            Backed by education, proven by results
          </TextAtom>
        </motion.div>

        {/* Certifications */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {credentials.map((credential, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon icon={credential.icon} size="2xl" className="text-primary" aria-hidden={true} />
                  </div>
                  <Heading level={3} className="text-xl mb-2">{credential.title}</Heading>
                  <TextAtom variant="body-sm" className="text-muted-foreground">
                    {credential.organization}
                  </TextAtom>
                  <TextAtom variant="body-sm" className="text-muted-foreground">
                    Certified {credential.year}
                  </TextAtom>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <Heading level={3} className="mb-6 text-center text-2xl">
                Notable Achievements
              </Heading>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Icon icon={Trophy} size="md" className="text-primary" aria-hidden={true} />
                    <TextAtom variant="body-sm">{achievement}</TextAtom>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
