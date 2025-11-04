"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const FITNESS_LEVELS = [
  { value: "beginner", label: "Beginner", description: "New to fitness or returning after a break" },
  { value: "intermediate", label: "Intermediate", description: "Regular exerciser with some experience" },
  { value: "advanced", label: "Advanced", description: "Experienced athlete or fitness enthusiast" },
];

const EXPERIENCE_LEVELS = [
  { value: "never_exercised", label: "Never exercised regularly" },
  { value: "some_experience", label: "Some experience (less than 6 months)" },
  { value: "regular_exerciser", label: "Regular exerciser (6+ months)" },
  { value: "athlete", label: "Athlete or competitive fitness" },
];

const COMMON_LIMITATIONS = [
  "None",
  "Lower back pain",
  "Knee issues",
  "Shoulder problems",
  "Hip issues",
  "Ankle problems",
  "Other injury",
];

export default function AssessmentPage() {
  const router = useRouter();
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [limitations, setLimitations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLimitationToggle = (limitation: string) => {
    if (limitation === "None") {
      setLimitations(limitations.includes("None") ? [] : ["None"]);
    } else {
      const newLimitations = limitations.filter((l) => l !== "None");
      if (limitations.includes(limitation)) {
        setLimitations(newLimitations.filter((l) => l !== limitation));
      } else {
        setLimitations([...newLimitations, limitation]);
      }
    }
  };

  const handleContinue = async () => {
    if (!fitnessLevel || !experienceLevel) {
      alert("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/onboarding/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStep: 3,
          completedSteps: [1, 2],
          fitnessLevel,
          experienceLevel,
          physicalLimitations: limitations.filter((l) => l !== "None"),
        }),
      });
      router.push("/member/onboarding/goals");
    } catch (error) {
      console.error("Failed to update onboarding:", error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/member/onboarding/welcome");
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <Heading level={2} className="text-3xl">
          Fitness Assessment
        </Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Help us understand your current fitness level
        </Text>
      </div>

      <div className="space-y-6">
        {/* Fitness Level */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            What&apos;s your current fitness level? *
          </Label>
          <RadioGroup value={fitnessLevel} onValueChange={setFitnessLevel}>
            <div className="space-y-3">
              {FITNESS_LEVELS.map((level) => (
                <Card key={level.value} className="cursor-pointer hover:border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={level.value} id={level.value} />
                      <div className="flex-1">
                        <Label htmlFor={level.value} className="cursor-pointer font-medium">
                          {level.label}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {level.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Experience Level */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            How much exercise experience do you have? *
          </Label>
          <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
            <div className="space-y-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.value} id={`exp-${level.value}`} />
                  <Label htmlFor={`exp-${level.value}`} className="cursor-pointer">
                    {level.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Physical Limitations */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Do you have any physical limitations or injuries?
          </Label>
          <div className="space-y-2">
            {COMMON_LIMITATIONS.map((limitation) => (
              <div key={limitation} className="flex items-center space-x-2">
                <Checkbox
                  id={limitation}
                  checked={limitations.includes(limitation)}
                  onCheckedChange={() => handleLimitationToggle(limitation)}
                />
                <Label htmlFor={limitation} className="cursor-pointer">
                  {limitation}
                </Label>
              </div>
            ))}
          </div>
        </div>
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
