import { Metadata } from "next";
import LoginFormSection from "@/components/login/login-form-section";

export const metadata: Metadata = {
  title: "Login - Member Portal",
  description: "Access your member dashboard, track progress, and connect with the community.",
};

export default function LoginPage() {
  return <LoginFormSection />;
}
