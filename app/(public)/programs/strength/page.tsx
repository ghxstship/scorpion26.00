import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { Dumbbell, TrendingUp, Award, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Strength Building Program | Elite Fitness",
  description: "Build serious strength with our progressive powerlifting and strength training program.",
};

export default function StrengthPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={1} className="text-4xl md:text-5xl font-heading mb-6">
              Strength Building Program
            </Heading>
            <Text variant="body-lg" className="mb-8 text-muted-foreground">
              Build maximum strength with progressive overload training, compound movements, and expert programming designed for serious lifters.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/join">Start Building Strength</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Talk to a Coach</Link>
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
                <Icon icon={Dumbbell} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Compound Focus</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Master the big 3: squat, bench press, and deadlift
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={TrendingUp} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Progressive Overload</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Systematic progression to maximize strength gains
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Award} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Expert Programming</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Designed by certified strength and conditioning coaches
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon icon={Zap} size="2xl" className="mx-auto mb-4 text-primary" aria-hidden={true} />
                <Heading level={3} className="mb-2">Periodization</Heading>
                <Text variant="body-sm" className="text-muted-foreground">
                  Strategic training cycles for optimal performance
                </Text>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Heading level={2} className="text-3xl font-heading mb-8 text-center">
              Program Details
            </Heading>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">4-Day Training Split</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Optimized training frequency with upper/lower or push/pull/legs splits
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Strength-Focused Nutrition</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    High-protein meal plans to support muscle recovery and growth
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Form Analysis</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Video form checks to ensure safe and effective lifting technique
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Accessory Work</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Targeted exercises to address weak points and prevent injury
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
            Get Stronger Today
          </Heading>
          <Text variant="body-lg" className="mb-8 max-w-2xl mx-auto">
            Join our strength building program and unlock your full potential with expert coaching and proven methods.
          </Text>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/join">Start Your Journey</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
