import { Metadata } from "next";
import JoinFormSection from "@/components/join/join-form-section";

export const metadata: Metadata = {
  title: "Join - Start Your Transformation",
  description: "Create your account and join 100K+ members transforming their lives.",
};

export default function JoinPage() {
  return <JoinFormSection />;
}
