import { Metadata } from "next";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Heading level={1} className="mb-8 font-montserrat text-4xl">Privacy Policy</Heading>
        <div className="prose prose-lg max-w-none space-y-6">
          <Text variant="body-md" className="text-muted-foreground">Last updated: March 2024</Text>
          
          <div>
            <Heading level={2} className="mb-3">1. Information We Collect</Heading>
            <Text variant="body-md">
              We collect information you provide directly to us, such as when you create an account, subscribe to our services, or communicate with us.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">2. How We Use Your Information</Heading>
            <Text variant="body-md">
              We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">3. Information Sharing</Heading>
            <Text variant="body-md">
              We do not share your personal information with third parties except as described in this privacy policy or with your consent.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">4. Data Security</Heading>
            <Text variant="body-md">
              We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">5. Your Rights</Heading>
            <Text variant="body-md">
              You have the right to access, update, or delete your personal information at any time through your account settings.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">6. Cookies</Heading>
            <Text variant="body-md">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">7. Changes to This Policy</Heading>
            <Text variant="body-md">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">8. Contact Us</Heading>
            <Text variant="body-md">
              If you have any questions about this privacy policy, please contact us at privacy@elitefitness.com
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
