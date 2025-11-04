"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";

export default function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`${sectionClasses.xl} bg-gradient-to-br from-primary to-blue-600 text-primary-foreground`}>
      <div className={containerClasses.default}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Heading level={2} className="font-montserrat text-4xl sm:text-5xl">
            Ready to Start Your Transformation?
          </Heading>
          <Text variant="body-lg" className="mt-6 opacity-90">
            Join 100K+ members who are achieving their fitness goals with our proven programs
          </Text>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="xl" variant="secondary" asChild>
              <Link href="/programs">
                View Programs
                <Icon icon={ArrowRight} size="md" className="ml-2" aria-hidden={true} />
              </Link>
            </Button>
            <Button size="xl" variant="secondary" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
