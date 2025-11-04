import { Metadata } from "next";
import AboutHeroSection from "@/components/about/about-hero-section";
import StoryTimelineSection from "@/components/about/story-timeline-section";
import CredentialsSection from "@/components/about/credentials-section";
import MissionValuesSection from "@/components/about/mission-values-section";
import TeamSection from "@/components/about/team-section";
import CTASection from "@/components/shared/cta-section";

export const metadata: Metadata = {
  title: "About Us - Our Story & Mission",
  description: "Learn about our journey from struggle to success, and how we've helped 100K+ people transform their lives through science-based fitness.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <StoryTimelineSection />
      <CredentialsSection />
      <MissionValuesSection />
      <TeamSection />
      <CTASection />
    </>
  );
}
