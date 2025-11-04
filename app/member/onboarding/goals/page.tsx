"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Target, TrendingUp, Heart, Zap } from "lucide-react";

const PRIMARY_GOALS = [
  { value: "weight_loss", label: "Weight Loss", icon: TrendingUp },
  { value: "muscle_gain", label: "Build Muscle", icon: Zap },
  { value: "endurance", label: "Improve Endurance", icon: Heart },
  { value: "general_fitness", label: "General Fitness", icon: Target },
];

const TIMELINES = [
  { value: "30_days", label: "30 Days" },
  { value: "90_days", label: "90 Days" },
  { value: "6_months", label: "6 Months" },
  { value: "1_year", label: "1 Year" },
];

export default function GoalsPage() {
  const router = useRouter();
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [timeline, setTimeline] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!primaryGoal || !timeline) {
      alert("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/onboarding/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStep: 4,
          completedSteps: [1, 2, 3],
          primaryGoal,
          targetTimeline: timeline,
          targetWeight: targetWeight ? parseFloat(targetWeight) : null,
        }),
      });
      router.push("/member/onboarding/preferences");
    } catch (error) {
      console.error("Failed to update onboarding:", error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/member/onboarding/assessment");
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <Heading level={2} className="text-3xl">
          Set Your Goals
        </Heading>
        <Text variant="body-md" className="text-muted-foreground">
          What do you want to achieve?
        </Text>
      </div>

      <div className="space-y-6">
        {/* Primary Goal */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            What&apos;s your primary fitness goal? *
          </Label>
          <RadioGroup value={primaryGoal} onValueChange={setPrimaryGoal}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRIMARY_GOALS.map((goal) => {
                const IconComponent = goal.icon;
                return (
                  <Card
                    key={goal.value}
                    className={`cursor-pointer hover:border-primary ${
                      primaryGoal === goal.value ? "border-primary" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={goal.value} id={goal.value} />
                        <IconComponent className="w-5 h-5 text-primary" />
                        <Label htmlFor={goal.value} className="cursor-pointer flex-1">
                          {goal.label}
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            What&apos;s your target timeline? *
          </Label>
          <RadioGroup value={timeline} onValueChange={setTimeline}>
            <div className="grid grid-cols-2 gap-3">
              {TIMELINES.map((t) => (
                <Card
                  key={t.value}
                  className={`cursor-pointer hover:border-primary ${
                    timeline === t.value ? "border-primary" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={t.value} id={t.value} />
                      <Label htmlFor={t.value} className="cursor-pointer">
                        {t.label}
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Target Weight (Optional) */}
        {primaryGoal === "weight_loss" && (
          <div className="space-y-2">
            <Label htmlFor="targetWeight">
              Target Weight (optional)
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="targetWeight"
                type="number"
                placeholder="e.g., 150"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="max-w-xs"
              />
              <span className="text-sm text-muted-foreground">lbs</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleContinue} disabled={loading} className="flex-1">
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
