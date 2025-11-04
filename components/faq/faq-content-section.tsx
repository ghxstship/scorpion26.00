"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";

const faqCategories = [
  {
    category: "Programs & Pricing",
    questions: [
      {
        q: "What programs do you offer?",
        a: "We offer 6 comprehensive programs: 90-Day Transformation, Strength Building, Weight Loss Mastery, Nutrition Coaching, Athletic Performance, and Home Workout Program. Each is designed for specific goals and fitness levels.",
      },
      {
        q: "How much do programs cost?",
        a: "Programs range from $77 to $247 as one-time payments. All include personalized coaching, nutrition guidance, community access, and our 30-day money-back guarantee.",
      },
      {
        q: "Do you offer payment plans?",
        a: "Yes! We offer flexible payment plans for all programs. Contact our support team to discuss options that work for your budget.",
      },
    ],
  },
  {
    category: "Getting Started",
    questions: [
      {
        q: "I'm a complete beginner. Can I still join?",
        a: "Absolutely! Our programs are designed for all fitness levels. We'll meet you where you are and progress at your pace with full coaching support.",
      },
      {
        q: "What equipment do I need?",
        a: "It depends on your program. Most require basic gym equipment, but our Home Workout Program requires zero equipment. We'll provide a complete equipment list when you enroll.",
      },
      {
        q: "How quickly will I see results?",
        a: "Most members see noticeable changes within 2-4 weeks. Significant transformations typically occur within 8-12 weeks with consistent effort.",
      },
    ],
  },
  {
    category: "Support & Community",
    questions: [
      {
        q: "How does coaching work?",
        a: "You'll have access to certified coaches through our app, email, and private community. Response time is typically within 24 hours, with ongoing support throughout your program.",
      },
      {
        q: "What's included in the community?",
        a: "Private forums, accountability partners, group challenges, live workouts, achievement system, and exclusive resource library with 100K+ active members.",
      },
      {
        q: "Can I get personalized meal plans?",
        a: "Yes! All programs include custom nutrition guidance and meal planning templates tailored to your goals, preferences, and dietary restrictions.",
      },
    ],
  },
];

export default function FAQContentSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`${sectionClasses.xl} bg-background`}>
      <div className={containerClasses.default}>
        <div className="mx-auto max-w-4xl space-y-12">
          {faqCategories.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: catIndex * 0.2 }}
            >
              <h2 className="mb-6 text-2xl font-bold">{category.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, qIndex) => (
                  <AccordionItem key={qIndex} value={`item-${catIndex}-${qIndex}`}>
                    <AccordionTrigger className="text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent>{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
