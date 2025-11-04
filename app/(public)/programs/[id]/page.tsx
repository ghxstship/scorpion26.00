import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Program Details | Elite Fitness",
  description: "View detailed information about this fitness program.",
};

// This would typically fetch from a database or API
const programs: Record<string, any> = {
  "beginner-strength": {
    name: "Beginner Strength Program",
    description: "Perfect for those new to strength training. Build a solid foundation with proper form and progressive overload.",
    duration: "8 weeks",
    level: "Beginner",
    price: 49,
  },
  "advanced-hypertrophy": {
    name: "Advanced Hypertrophy Program",
    description: "Maximize muscle growth with high-volume training and advanced techniques.",
    duration: "12 weeks",
    level: "Advanced",
    price: 79,
  },
};

export default function ProgramDetailPage({ params }: { params: { id: string } }) {
  const program = programs[params.id];

  if (!program) {
    notFound();
  }

  return (
    <main className="min-h-screen py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Heading level={1} className="text-4xl font-montserrat mb-4">
            {program.name}
          </Heading>
          <Text variant="body-lg" className="mb-8 text-muted-foreground">
            {program.description}
          </Text>

          <div className="grid gap-8 md:grid-cols-2 mb-8">
            <Card>
              <CardContent className="pt-6">
                <Heading level={3} className="mb-2">Duration</Heading>
                <Text variant="body-md">{program.duration}</Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Heading level={3} className="mb-2">Level</Heading>
                <Text variant="body-md">{program.level}</Text>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Heading level={2} className="text-3xl font-montserrat mb-2">
                    ${program.price}
                  </Heading>
                  <Text variant="body-sm" className="text-muted-foreground">
                    One-time payment
                  </Text>
                </div>
                <Button size="lg" asChild>
                  <Link href="/join">Get Started</Link>
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
