import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { Calendar, Users, Trophy, Target } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "90-Day Transformation Program | Elite Fitness",
  description: "Transform your body in 90 days with our comprehensive fitness and nutrition program.",
};

export default function TransformationPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={1} className="text-4xl md:text-5xl font-montserrat mb-6">
              90-Day Transformation Program
            </Heading>
            <Text variant="body-lg" className="mb-8 text-muted-foreground">
              A complete body transformation program combining structured workouts, personalized nutrition, and expert coaching to help you achieve your fitness goals.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/join">Start Your Transformation</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact a Coach</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Calendar} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">90 Days</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Structured 12-week program with progressive training phases
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Users} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Expert Coaching</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Personal guidance from certified fitness professionals
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Trophy} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Proven Results</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Join 10,000+ members who have transformed their bodies
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Target} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Custom Nutrition</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Personalized meal plans tailored to your goals
                </Text>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Heading level={2} className="text-3xl font-montserrat mb-8 text-center">
              What&apos;s Included
            </Heading>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Comprehensive Workout Plans</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    5-6 workouts per week with detailed video demonstrations and form cues
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Custom Nutrition Guidance</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Macro-based meal plans with recipe ideas and grocery lists
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Weekly Check-ins</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Progress tracking and adjustments with your dedicated coach
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Community Support</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Access to exclusive member community and accountability groups
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
          <Heading level={2} className="text-3xl font-montserrat mb-4">
            Ready to Transform Your Life?
          </Heading>
          <Text variant="body-lg" className="mb-8 max-w-2xl mx-auto">
            Join thousands of members who have achieved incredible results with our 90-Day Transformation Program.
          </Text>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/join">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
