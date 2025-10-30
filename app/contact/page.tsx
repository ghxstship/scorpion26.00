import { Metadata } from "next";
import ContactHeroSection from "@/components/contact/contact-hero-section";
import ContactFormSection from "@/components/contact/contact-form-section";
import ContactInfoSection from "@/components/contact/contact-info-section";

export const metadata: Metadata = {
  title: "Contact Us - Get In Touch",
  description: "Have questions? We're here to help. Contact our team for support, program inquiries, or partnership opportunities.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactFormSection />
      <ContactInfoSection />
    </>
  );
}
