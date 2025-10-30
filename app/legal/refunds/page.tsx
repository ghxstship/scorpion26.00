import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Our 30-day money-back guarantee and refund policy.",
};

export default function RefundsPage() {
  return (
    <div className="container mx-auto px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-montserrat text-4xl font-bold">Refund Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground">Last updated: March 2024</p>
          
          <h2>30-Day Money-Back Guarantee</h2>
          <p>
            We stand behind our programs with a 30-day money-back guarantee. If you&apos;re not completely satisfied with your purchase, you can request a full refund within 30 days of your purchase date.
          </p>

          <h2>How to Request a Refund</h2>
          <p>
            To request a refund, simply contact our support team at support@elitefitness.com with your order number and reason for the refund request. We&apos;ll process your refund within 5-7 business days.
          </p>

          <h2>Refund Eligibility</h2>
          <p>
            Refunds are available for all program purchases within 30 days. After 30 days, all sales are final. Refunds are processed to the original payment method.
          </p>

          <h2>What Happens After a Refund</h2>
          <p>
            Once your refund is processed, your access to the program materials and community will be revoked. You&apos;ll receive a confirmation email once the refund has been completed.
          </p>

          <h2>Questions?</h2>
          <p>
            If you have any questions about our refund policy, please don&apos;t hesitate to contact us at support@elitefitness.com
          </p>
        </div>
      </div>
    </div>
  );
}
