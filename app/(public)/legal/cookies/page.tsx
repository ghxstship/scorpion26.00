import { Metadata } from "next";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

export const metadata: Metadata = {
  title: "Cookie Policy | Elite Fitness",
  description: "Learn about how Elite Fitness uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <Heading level={1} className="text-4xl font-heading mb-4">
            Cookie Policy
          </Heading>
          <Text variant="body-sm" className="text-muted-foreground mb-8">
            Last updated: November 2024
          </Text>

          <section className="mb-8">
            <Heading level={2} className="text-2xl font-heading mb-4">
              What Are Cookies
            </Heading>
            <Text variant="body-md" className="mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
            </Text>
          </section>

          <section className="mb-8">
            <Heading level={2} className="text-2xl font-heading mb-4">
              How We Use Cookies
            </Heading>
            <Text variant="body-md" className="mb-4">
              We use cookies for the following purposes:
            </Text>
            <ul className="list-disc pl-6 space-y-2">
              <li><Text variant="body-md">Essential cookies: Required for the website to function properly</Text></li>
              <li><Text variant="body-md">Analytics cookies: Help us understand how visitors use our site</Text></li>
              <li><Text variant="body-md">Preference cookies: Remember your settings and preferences</Text></li>
              <li><Text variant="body-md">Marketing cookies: Track your activity to show relevant ads</Text></li>
            </ul>
          </section>

          <section className="mb-8">
            <Heading level={2} className="text-2xl font-heading mb-4">
              Managing Cookies
            </Heading>
            <Text variant="body-md" className="mb-4">
              You can control and manage cookies through your browser settings. Please note that removing or blocking cookies may impact your user experience and some features may no longer function properly.
            </Text>
          </section>

          <section className="mb-8">
            <Heading level={2} className="text-2xl font-heading mb-4">
              Contact Us
            </Heading>
            <Text variant="body-md">
              If you have questions about our use of cookies, please contact us at privacy@elitefitness.com
            </Text>
          </section>
        </div>
      </div>
    </main>
  );
}
