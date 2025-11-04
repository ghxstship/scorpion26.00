import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrandProvider } from "@/lib/branding/brand-context";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Transform Your Body in 90 Days | Elite Fitness Coaching",
    template: "%s | Elite Fitness Coaching"
  },
  description: "Join 100K+ members who transformed their lives with science-based fitness programs, expert coaching, and a supportive community. Start your journey today.",
  keywords: ["fitness", "personal training", "workout programs", "nutrition coaching", "body transformation", "online fitness"],
  authors: [{ name: "Elite Fitness Coaching" }],
  creator: "Elite Fitness Coaching",
  metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    title: "Transform Your Body in 90 Days | Elite Fitness Coaching",
    description: "Join 100K+ members who transformed their lives with science-based fitness programs.",
    siteName: "Elite Fitness Coaching",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Elite Fitness Coaching",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Transform Your Body in 90 Days | Elite Fitness Coaching",
    description: "Join 100K+ members who transformed their lives with science-based fitness programs.",
    images: ["/og-image.jpg"],
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <Providers>
          <BrandProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <a href="#main-content" className="skip-to-main">
                Skip to main content
              </a>
              {children}
              <Toaster />
            </ThemeProvider>
          </BrandProvider>
        </Providers>
      </body>
    </html>
  );
}
