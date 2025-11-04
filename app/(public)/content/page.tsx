import { Metadata } from "next";
import ContentHeroSection from "@/components/content/content-hero-section";
import ContentGridSection from "@/components/content/content-grid-section";
import NewsletterSection from "@/components/content/newsletter-section";

export const metadata: Metadata = {
  title: "Content Hub - Free Fitness Resources",
  description: "Access free workout videos, nutrition guides, transformation stories, and expert fitness advice. New content added weekly.",
};

export default function ContentPage() {
  return (
    <>
      <ContentHeroSection />
      <ContentGridSection />
      <NewsletterSection />
    </>
  );
}
