import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { Scale, Heart, Apple, Activity } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Weight Loss Program | Elite Fitness",
  description: "Sustainable weight loss through science-based training and nutrition coaching.",
};

export default function WeightLossPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={1} className="text-4xl md:text-5xl font-heading mb-6">
              Weight Loss Program
            </Heading>
            <Text variant="body-lg" className="mb-8 text-muted-foreground">
              Achieve sustainable weight loss with our science-based approach combining effective workouts, balanced nutrition, and lifestyle coaching.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/join">Start Losing Weight</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Get a Free Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Scale} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Sustainable Results</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Lose 1-2 lbs per week with healthy, maintainable habits
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Heart} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Metabolic Health</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Improve overall health markers and energy levels
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Apple} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Flexible Nutrition</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  No restrictive diets - eat foods you enjoy
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Activity} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Efficient Workouts</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  30-45 minute sessions that maximize fat loss
                </Text>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Heading level={2} className="text-3xl font-heading mb-8 text-center">
              What You Get
            </Heading>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Calorie & Macro Targets</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Personalized nutrition plan based on your metabolism and goals
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Fat-Burning Workouts</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Combination of strength training and cardio for optimal results
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Weekly Progress Tracking</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Monitor weight, measurements, and photos to stay on track
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Lifestyle Coaching</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Build sustainable habits for long-term weight management
                  </Text>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Heading level={2} className="text-3xl font-heading mb-4">
            Start Your Weight Loss Journey
          </Heading>
          <Text variant="body-lg" className="mb-8 max-w-2xl mx-auto">
            Join thousands who have successfully lost weight and kept it off with our proven program.
          </Text>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/join">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
