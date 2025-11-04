"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ONBOARDING_STEPS = [
  "Welcome",
  "Assessment",
  "Goals",
  "Preferences",
  "Health",
  "Complete",
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = getCurrentUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch onboarding progress
    fetch("/api/onboarding/progress")
      .then((res) => res.json())
      .then((data) => {
        if (data.progress) {
          setCurrentStep(data.progress.current_step || 1);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch onboarding progress:", error);
        setLoading(false);
      });
  }, [user, router]);

  const handleSkip = async () => {
    try {
      await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skipped: true }),
      });
      router.push("/member/dashboard");
    } catch (error) {
      console.error("Failed to skip onboarding:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Get Started</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Skip for now
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="container mx-auto px-4 py-8">
        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={ONBOARDING_STEPS.length}
          steps={ONBOARDING_STEPS}
        />

        {/* Content */}
        <div className="max-w-2xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
