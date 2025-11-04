import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers | Elite Fitness",
  description: "Join the Elite Fitness team and help transform lives through fitness.",
};

export default function CareersPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Heading level={1} className="text-4xl font-montserrat mb-4 text-center">
            Join Our Team
          </Heading>
          <Text variant="body-lg" className="mb-12 text-center text-muted-foreground">
            Help us transform lives through fitness. We're always looking for passionate individuals.
          </Text>

          <section className="mb-16">
            <Heading level={2} className="text-2xl font-montserrat mb-6">
              Open Positions
            </Heading>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <Heading level={3} className="mb-2">Fitness Coach</Heading>
                  <Text variant="body-sm" className="text-primary mb-2">Remote • Full-time</Text>
                  <Text variant="body-md" className="text-muted-foreground mb-4">
                    Join our coaching team and help members achieve their fitness goals.
                  </Text>
                  <Button variant="outline" asChild>
                    <Link href="/contact">Apply Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <Heading level={2} className="text-2xl font-montserrat mb-6">
              Why Work With Us
            </Heading>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <Text variant="body-md">Competitive compensation and benefits</Text>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <Text variant="body-md">Remote-first culture</Text>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <Text variant="body-md">Professional development opportunities</Text>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <Text variant="body-md">Make a real impact on people's lives</Text>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
