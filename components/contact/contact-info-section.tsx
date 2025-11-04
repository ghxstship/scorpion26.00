"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageCircle, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "support@elitefitness.com",
    detail: "Response within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    description: "+1 (555) 123-4567",
    detail: "Mon-Fri, 9am-6pm EST",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Available in app",
    detail: "Instant support",
  },
  {
    icon: MapPin,
    title: "Office",
    description: "123 Fitness Ave, Suite 100",
    detail: "Los Angeles, CA 90001",
  },
];

export default function ContactInfoSection() {
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
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            Other Ways to Reach Us
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full text-center transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-bold">{method.title}</h3>
                  <p className="mb-1 text-sm font-medium">{method.description}</p>
                  <p className="text-xs text-muted-foreground">{method.detail}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
