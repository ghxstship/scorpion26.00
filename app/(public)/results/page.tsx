import { Metadata } from "next";
import ResultsHeroSection from "@/components/results/results-hero-section";
import TransformationGallerySection from "@/components/results/transformation-gallery-section";
import VideoTestimonialsSection from "@/components/results/video-testimonials-section";
import StatsSection from "@/components/results/stats-section";
import CTASection from "@/components/shared/cta-section";

export const metadata: Metadata = {
  title: "Success Stories - Real Transformations",
  description: "See real results from 100K+ members who transformed their lives. Browse before/after photos, video testimonials, and inspiring success stories.",
};

export default function ResultsPage() {
  return (
    <>
      <ResultsHeroSection />
      <StatsSection />
      <TransformationGallerySection />
      <VideoTestimonialsSection />
      <CTASection />
    </>
  );
}
