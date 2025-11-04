import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press & Media | Elite Fitness",
  description: "Press releases, media coverage, and brand assets for Elite Fitness.",
};

export default function PressPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Heading level={1} className="text-4xl font-montserrat mb-4 text-center">
            Press & Media
          </Heading>
          <Text variant="body-lg" className="mb-12 text-center text-muted-foreground">
            Latest news, press releases, and media coverage about Elite Fitness.
          </Text>

          <section className="mb-16">
            <Heading level={2} className="text-2xl font-montserrat mb-6">
              Press Releases
            </Heading>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <Text variant="body-sm" className="text-primary mb-2">November 2024</Text>
                  <Heading level={3} className="mb-2">Elite Fitness Reaches 100,000 Members</Heading>
                  <Text variant="body-md" className="text-muted-foreground">
                    Elite Fitness celebrates a major milestone with over 100,000 active members worldwide.
                  </Text>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-16">
            <Heading level={2} className="text-2xl font-montserrat mb-6">
              Media Inquiries
            </Heading>
            <Card>
              <CardContent className="pt-6">
                <Text variant="body-md" className="mb-4">
                  For press inquiries, interviews, or media kits, please contact our press team.
                </Text>
                <Button asChild>
                  <Link href="/contact">Contact Press Team</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
