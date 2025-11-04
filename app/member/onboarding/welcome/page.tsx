"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { Target, TrendingUp, Users, Zap } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  const handleStart = async () => {
    try {
      await fetch("/api/onboarding/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStep: 2,
          completedSteps: [1],
        }),
      });
      router.push("/member/onboarding/assessment");
    } catch (error) {
      console.error("Failed to update onboarding:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <Heading level={1} className="text-4xl">
          Welcome to Your Fitness Journey! 🎉
        </Heading>
        <Text variant="body-lg" className="text-muted-foreground max-w-2xl mx-auto">
          Let&apos;s take a few minutes to personalize your experience. We&apos;ll create a
          custom plan tailored to your goals, fitness level, and preferences.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon icon={Target} size="lg" className="text-primary" aria-hidden={true} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Personalized Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Set clear, achievable goals and track your progress every step of the way.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon icon={Zap} size="lg" className="text-primary" aria-hidden={true} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI-Powered Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Get workout plans that adapt to your progress and preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon icon={TrendingUp} size="lg" className="text-primary" aria-hidden={true} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your improvements with detailed analytics and insights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon icon={Users} size="lg" className="text-primary" aria-hidden={true} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Join Community</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with others, share achievements, and stay motivated.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={handleStart} className="px-12">
          Let&apos;s Get Started
        </Button>
      </div>

      <div className="text-center">
        <Text variant="body-sm" className="text-muted-foreground">
          This will only take 3-5 minutes
        </Text>
      </div>
    </div>
  );
}
