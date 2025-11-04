import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refunds" },
    { name: "Cookie Policy", href: "/cookies" },
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
        <div className="mb-12 rounded-lg bg-primary p-8 text-primary-foreground">
          <div className="mx-auto max-w-2xl text-center">
            <Mail className="mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 font-montserrat text-2xl font-bold">
              Get 7 Free Workout Videos
            </h3>
            <p className="mb-6 text-primary-foreground/90">
              Join 100K+ members and get exclusive fitness tips, nutrition guides, and workout plans delivered to your inbox.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row" aria-label="Newsletter signup">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background text-foreground"
                aria-label="Email address"
                required
              />
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="whitespace-nowrap"
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
                <span className="font-montserrat text-xl font-bold text-primary-foreground">
                  EF
                </span>
              </div>
              <span className="font-montserrat text-xl font-bold">
                Elite Fitness
              </span>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">
              Transform your body and mind with science-based fitness programs trusted by 100K+ members worldwide.
            </p>
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
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="mb-4 font-semibold">Programs</h4>
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
            <h4 className="mb-4 font-semibold">Company</h4>
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
            <h4 className="mb-4 font-semibold">Resources</h4>
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
            <h4 className="mb-4 font-semibold">Legal</h4>
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
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Elite Fitness Coaching. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                🔒 Secure Checkout
              </span>
              <span className="text-sm text-muted-foreground">
                ⭐ 4.9/5 Rating
              </span>
              <span className="text-sm text-muted-foreground">
                ✓ 30-Day Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
