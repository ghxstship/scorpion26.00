import { Metadata } from "next";
import FAQHeroSection from "@/components/faq/faq-hero-section";
import FAQContentSection from "@/components/faq/faq-content-section";
import CTASection from "@/components/shared/cta-section";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description: "Find answers to common questions about our programs, pricing, support, and more.",
};

export default function FAQPage() {
  return (
    <>
      <FAQHeroSection />
      <FAQContentSection />
      <CTASection />
    </>
  );
}
