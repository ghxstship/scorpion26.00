import { Metadata } from "next";
import CommunityHeroSection from "@/components/community/community-hero-section";
import CommunityFeaturesSection from "@/components/community/community-features-section";
import CommunityStatsSection from "@/components/community/community-stats-section";
import CTASection from "@/components/shared/cta-section";

export const metadata: Metadata = {
  title: "Community - Join 100K+ Members",
  description: "Connect with like-minded fitness enthusiasts, share your journey, get support, and celebrate wins together.",
};

export default function CommunityPage() {
  return (
    <>
      <CommunityHeroSection />
      <CommunityStatsSection />
      <CommunityFeaturesSection />
      <CTASection />
    </>
  );
}
