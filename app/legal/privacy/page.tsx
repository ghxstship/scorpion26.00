import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-montserrat text-4xl font-bold">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground">Last updated: March 2024</p>
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, subscribe to our services, or communicate with us.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience.
          </p>

          <h2>3. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties except as described in this privacy policy or with your consent.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information at any time through your account settings.
          </p>

          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and hold certain information.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at privacy@elitefitness.com
          </p>
        </div>
      </div>
    </div>
  );
}
