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

const faqs = [
  {
    question: "What are the 7 training tracks?",
    answer: "Our 7 specialized tracks are: Strength & Conditioning (Red), Performance Training (Orange), Cardio & Core (Yellow), Nutrition (Green), Mental Stamina (Blue), Recovery (Purple), and Team Sports & Group Fitness (Pink). Each track focuses on a specific aspect of complete fitness development.",
  },
  {
    question: "What's the difference between the 4 tiers?",
    answer: "Starter provides foundation training accessible to everyone. Advanced offers enhanced programming with premium features. Pro delivers professional-grade training systems. Elite is our invitation-only program for world-class performers with limited spots (8-12 members per track).",
  },
  {
    question: "How does pricing work?",
    answer: "All programs offer flexible pricing: weekly, monthly, or annual subscriptions. Annual plans save you 17% compared to monthly. Bundles provide even greater savings—up to 45% off when you combine multiple tracks or levels.",
  },
  {
    question: "Can I access multiple tracks?",
    answer: "Yes! You can purchase individual programs or save with our bundled packages. All Tracks bundles give you access to all 7 tracks at one tier. Complete Journey bundles provide all tiers of a single track for progressive development.",
  },
  {
    question: "How do I qualify for Elite level programs?",
    answer: "Elite programs are invitation-only with limited spots (8-12 members per track). Invitations are extended to high-performing Pro or Fancy members who demonstrate exceptional commitment and results. You can also apply directly through our application process.",
  },
  {
    question: "Can I switch between levels?",
    answer: "Absolutely! You can upgrade to a higher level at any time. When upgrading, we'll credit your current subscription toward the new level. Downgrades are processed at the end of your current billing cycle.",
  },
  {
    question: "What's included at each tier?",
    answer: "Starter includes basic programming and community access. Advanced adds personalized plans and bi-weekly coaching. Pro provides fully customized programming and weekly coaching. Elite offers world-class coaching teams, exclusive camps, and career development opportunities. Custom Private Training (separate) includes daily personalized programming and unlimited coach access.",
  },
  {
    question: "Do bundles include all features?",
    answer: "Yes! Bundles include all features from the individual programs at that level. Plus, you get priority support, lifetime program updates, and access to exclusive bundle-member events and communities.",
  },
  {
    question: "How do I access my programs?",
    answer: "After purchase, you'll receive immediate access to our member portal and mobile app. All workouts, nutrition plans, coaching, and resources are available instantly across all your devices.",
  },
  {
    question: "What if I'm not satisfied?",
    answer: "We offer a 30-day money-back guarantee on all programs and bundles. If you're not completely satisfied within the first 30 days, we'll refund your purchase—no questions asked.",
  },
];

export default function FAQSection() {
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
          <h2 className="font-montserrat text-4xl font-bold sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Got questions? We&apos;ve got answers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
