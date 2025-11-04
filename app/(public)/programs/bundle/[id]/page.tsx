import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Program Bundle | Elite Fitness",
  description: "View detailed information about this program bundle.",
};

// This would typically fetch from a database or API
const bundles: Record<string, any> = {
  "starter-bundle": {
    name: "Starter Bundle",
    description: "Everything you need to begin your fitness journey with confidence.",
    programs: ["Beginner Strength", "Nutrition Basics", "Cardio Fundamentals"],
    price: 99,
    savings: 30,
  },
  "elite-bundle": {
    name: "Elite Bundle",
    description: "Complete access to all programs and premium features.",
    programs: ["All Programs", "Personal Coaching", "Meal Plans", "Community Access"],
    price: 299,
    savings: 100,
  },
};

export default function BundleDetailPage({ params }: { params: { id: string } }) {
  const bundle = bundles[params.id];

  if (!bundle) {
    notFound();
  }

  return (
    <main className="min-h-screen py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Heading level={1} className="text-4xl font-montserrat mb-4">
            {bundle.name}
          </Heading>
          <Text variant="body-lg" className="mb-8 text-muted-foreground">
            {bundle.description}
          </Text>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <Heading level={3} className="mb-4">Included Programs</Heading>
              <ul className="space-y-2">
                {bundle.programs.map((program: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">✓</span>
                    <Text variant="body-md">{program}</Text>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Heading level={2} className="text-3xl font-montserrat mb-2">
                    ${bundle.price}
                  </Heading>
                  <Text variant="body-sm" className="text-muted-foreground">
                    Save ${bundle.savings}
                  </Text>
                </div>
                <Button size="lg" asChild>
                  <Link href="/join">Get This Bundle</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" asChild>
            <Link href="/programs">← Back to Programs</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
