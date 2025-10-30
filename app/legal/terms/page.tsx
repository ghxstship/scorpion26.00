import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Elite Fitness Coaching services.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-montserrat text-4xl font-bold">Terms of Service</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground">Last updated: March 2024</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Elite Fitness Coaching services, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials (information or software) on Elite Fitness Coaching for personal, non-commercial transitory viewing only.
          </p>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on Elite Fitness Coaching are provided on an &apos;as is&apos; basis. Elite Fitness Coaching makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall Elite Fitness Coaching or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Elite Fitness Coaching.
          </p>

          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on Elite Fitness Coaching could include technical, typographical, or photographic errors. Elite Fitness Coaching does not warrant that any of the materials on its website are accurate, complete or current.
          </p>

          <h2>6. Links</h2>
          <p>
            Elite Fitness Coaching has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.
          </p>

          <h2>7. Modifications</h2>
          <p>
            Elite Fitness Coaching may revise these terms of service for its website at any time without notice.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </div>
      </div>
    </div>
  );
}
