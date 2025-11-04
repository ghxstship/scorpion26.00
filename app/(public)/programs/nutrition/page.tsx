import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { Utensils, BookOpen, Calculator, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nutrition Coaching | Elite Fitness",
  description: "Personalized nutrition coaching to fuel your fitness goals and optimize performance.",
};

export default function NutritionPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={1} className="text-4xl md:text-5xl font-montserrat mb-6">
              Nutrition Coaching
            </Heading>
            <Text variant="body-lg" className="mb-8 text-muted-foreground">
              Transform your relationship with food through personalized nutrition coaching, meal planning, and evidence-based guidance from certified nutritionists.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/join">Start Nutrition Coaching</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Book a Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Utensils} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Custom Meal Plans</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Personalized plans based on your preferences and goals
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={BookOpen} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Nutrition Education</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Learn the science behind optimal nutrition
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Calculator} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Macro Tracking</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Flexible approach to hitting your nutrition targets
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Users} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">1-on-1 Support</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Direct access to certified nutrition coaches
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
                  <Heading level={3} className="mb-2">Initial Assessment</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Comprehensive evaluation of your current diet, goals, and lifestyle
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Personalized Meal Plans</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Weekly meal plans with recipes, shopping lists, and prep guides
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Bi-Weekly Check-ins</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Regular progress reviews and plan adjustments with your coach
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Supplement Guidance</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Evidence-based recommendations for optimal supplementation
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
            Fuel Your Fitness Goals
          </Heading>
          <Text variant="body-lg" className="mb-8 max-w-2xl mx-auto">
            Get expert nutrition coaching tailored to your unique needs and preferences.
          </Text>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/join">Start Coaching Today</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
