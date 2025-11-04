import { Metadata } from "next";
import ProgramsHeroSection from "@/components/programs/programs-hero-section";
import ProgramsCardsGrid from "@/components/programs/programs-cards-grid";
import CustomProgramsSection from "@/components/programs/custom-programs-section";
import BundlesSection from "@/components/programs/bundles-section";
import GuaranteeSection from "@/components/programs/guarantee-section";
import FAQSection from "@/components/programs/faq-section";
import CTASection from "@/components/shared/cta-section";

export const metadata: Metadata = {
  title: "Programs - Your Complete Fitness Transformation System",
  description: "28 specialized programs across 7 performance tracks and 4 progressive tiers, plus custom private training. Strength, Performance, Cardio, Nutrition, Mental, Recovery, and Team Sports with flexible weekly, monthly, and annual pricing.",
};

export default function ProgramsPage() {
  return (
    <>
      <ProgramsHeroSection />
      <ProgramsCardsGrid />
      <div id="bundles">
        <BundlesSection />
      </div>
      <CustomProgramsSection />
      <GuaranteeSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
