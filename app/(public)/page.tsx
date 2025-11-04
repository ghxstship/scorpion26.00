import HeroSection from "@/components/sections/hero-section";
import SocialProofSection from "@/components/sections/social-proof-section";
import ValuePropositionSection from "@/components/sections/value-proposition-section";
import ProgramShowcaseSection from "@/components/sections/program-showcase-section";
import FounderSection from "@/components/sections/founder-section";
import MediaFeaturesSection from "@/components/sections/media-features-section";
import ContentHubSection from "@/components/sections/content-hub-section";
import FinalConversionSection from "@/components/sections/final-conversion-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofSection />
      <ValuePropositionSection />
      <ProgramShowcaseSection />
      <FounderSection />
      <MediaFeaturesSection />
      <ContentHubSection />
      <FinalConversionSection />
    </>
  );
}
