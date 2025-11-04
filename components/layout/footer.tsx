import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { containerClasses, formClasses } from "@/lib/design-tokens";

const footerLinks = {
  programs: [
    { name: "90-Day Transformation", href: "/programs/transformation" },
    { name: "Strength Building", href: "/programs/strength" },
    { name: "Weight Loss", href: "/programs/weight-loss" },
    { name: "Nutrition Coaching", href: "/programs/nutrition" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/about#story" },
    { name: "Press", href: "/press" },
    { name: "Careers", href: "/careers" },
  ],
  resources: [
    { name: "Blog", href: "/content" },
    { name: "Success Stories", href: "/results" },
    { name: "FAQ", href: "/faq" },
    { name: "Community", href: "/community" },
  ],
  legal: [
    { name: "Terms of Service", href: "/legal/terms" },
    { name: "Privacy Policy", href: "/legal/privacy" },
    { name: "Refund Policy", href: "/legal/refunds" },
    { name: "Cookie Policy", href: "/legal/cookies" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50" role="contentinfo">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-12 rounded-lg bg-primary p-6 sm:p-8 text-primary-foreground">
          <div className="mx-auto max-w-2xl text-center">
            <Icon icon={Mail} size="xl" className="mx-auto mb-3 sm:mb-4 sm:h-12 sm:w-12" aria-hidden={true} />
            <Heading level={3} className="mb-2 font-heading text-xl sm:text-2xl">
              Get 7 Free Workout Videos
            </Heading>
            <Text variant="body-md" className="mb-4 sm:mb-6 text-sm sm:text-base text-primary-foreground/90">
              Join 100K+ members and get exclusive fitness tips, nutrition guides, and workout plans delivered to your inbox.
            </Text>
            <form className={formClasses.inline} aria-label="Newsletter signup">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background text-foreground h-11 sm:h-12"
                aria-label="Email address"
                required
              />
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="whitespace-nowrap h-11 sm:h-12"
              >
                Get Started Free
              </Button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="font-heading text-xl font-bold text-primary-foreground">
                  EF
                </span>
              </div>
              <span className="font-heading text-xl font-bold">
                Elite Fitness
              </span>
            </Link>
            <Text variant="body-sm" className="mb-4 text-muted-foreground">
              Transform your body and mind with science-based fitness programs trusted by 100K+ members worldwide.
            </Text>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label={social.name}
                >
                  <Icon icon={social.icon} size="md" aria-hidden={true} />
                </a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <Heading level={4} className="mb-4">Programs</Heading>
            <ul className="space-y-2" role="list">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <Heading level={4} className="mb-4">Company</Heading>
            <ul className="space-y-2" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <Heading level={4} className="mb-4">Resources</Heading>
            <ul className="space-y-2" role="list">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <Heading level={4} className="mb-4">Legal</Heading>
            <ul className="space-y-2" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Elite Fitness Coaching. All rights reserved.
            </Text>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                🔒 Secure Checkout
              </Text>
              <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                ⭐ 4.9/5 Rating
              </Text>
              <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                ✓ 30-Day Guarantee
              </Text>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
