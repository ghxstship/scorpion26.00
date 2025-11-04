import { Metadata } from "next";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Our 30-day money-back guarantee and refund policy.",
};

export default function RefundsPage() {
  return (
    <div className="container mx-auto px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Heading level={1} className="mb-8 font-heading text-4xl">Refund Policy</Heading>
        <div className="prose prose-lg max-w-none space-y-6">
          <Text variant="body-md" className="text-muted-foreground">Last updated: March 2024</Text>
          
          <div>
            <Heading level={2} className="mb-3">30-Day Money-Back Guarantee</Heading>
            <Text variant="body-md">
              We stand behind our programs with a 30-day money-back guarantee. If you&apos;re not completely satisfied with your purchase, you can request a full refund within 30 days of your purchase date.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">How to Request a Refund</Heading>
            <Text variant="body-md">
              To request a refund, simply contact our support team at support@elitefitness.com with your order number and reason for the refund request. We&apos;ll process your refund within 5-7 business days.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">Refund Eligibility</Heading>
            <Text variant="body-md">
              Refunds are available for all program purchases within 30 days. After 30 days, all sales are final. Refunds are processed to the original payment method.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">What Happens After a Refund</Heading>
            <Text variant="body-md">
              Once your refund is processed, your access to the program materials and community will be revoked. You&apos;ll receive a confirmation email once the refund has been completed.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">Questions?</Heading>
            <Text variant="body-md">
              If you have any questions about our refund policy, please don&apos;t hesitate to contact us at support@elitefitness.com
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
