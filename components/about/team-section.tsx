"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";

const team = [
  {
    name: "Alex Johnson",
    role: "Founder & Head Coach",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
    bio: "NASM-CPT, Precision Nutrition L1",
  },
  {
    name: "Sarah Martinez",
    role: "Lead Nutrition Coach",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    bio: "RD, Sports Nutritionist",
  },
  {
    name: "Mike Chen",
    role: "Strength & Conditioning Coach",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "CSCS, Performance Specialist",
  },
  {
    name: "Emily Rodriguez",
    role: "Community Manager",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Behavior Change Specialist",
  },
];

export default function TeamSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`${sectionClasses.xl} bg-background`}>
      <div className={containerClasses.default}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <Heading level={2} className="font-heading text-4xl sm:text-5xl">
            Meet the Team
          </Heading>
          <Text variant="body-lg" className="mt-4 text-muted-foreground">
            Expert coaches dedicated to your success
          </Text>
        </motion.div>

        <div className={gridClasses.cards['4col']}>
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-square">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <Heading level={3} className="font-semibold">{member.name}</Heading>
                  <Text variant="body-sm" className="text-primary">{member.role}</Text>
                  <Text variant="body-xs" className="text-muted-foreground mt-2">{member.bio}</Text>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
