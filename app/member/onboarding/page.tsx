"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to welcome step
    router.push("/member/onboarding/welcome");
  }, [router]);

  return null;
}
