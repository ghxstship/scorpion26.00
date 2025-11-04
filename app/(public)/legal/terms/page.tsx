import { Metadata } from "next";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Elite Fitness Coaching services.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Heading level={1} className="mb-8 font-heading text-4xl">Terms of Service</Heading>
        <div className="prose prose-lg max-w-none space-y-6">
          <Text variant="body-md" className="text-muted-foreground">Last updated: March 2024</Text>
          
          <div>
            <Heading level={2} className="mb-3">1. Acceptance of Terms</Heading>
            <Text variant="body-md">
              By accessing and using Elite Fitness Coaching services, you accept and agree to be bound by the terms and provision of this agreement.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">2. Use License</Heading>
            <Text variant="body-md">
              Permission is granted to temporarily access the materials (information or software) on Elite Fitness Coaching for personal, non-commercial transitory viewing only.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">3. Disclaimer</Heading>
            <Text variant="body-md">
              The materials on Elite Fitness Coaching are provided on an &apos;as is&apos; basis. Elite Fitness Coaching makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">4. Limitations</Heading>
            <Text variant="body-md">
              In no event shall Elite Fitness Coaching or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Elite Fitness Coaching.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">5. Accuracy of Materials</Heading>
            <Text variant="body-md">
              The materials appearing on Elite Fitness Coaching could include technical, typographical, or photographic errors. Elite Fitness Coaching does not warrant that any of the materials on its website are accurate, complete or current.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">6. Links</Heading>
            <Text variant="body-md">
              Elite Fitness Coaching has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">7. Modifications</Heading>
            <Text variant="body-md">
              Elite Fitness Coaching may revise these terms of service for its website at any time without notice.
            </Text>
          </div>

          <div>
            <Heading level={2} className="mb-3">8. Governing Law</Heading>
            <Text variant="body-md">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
