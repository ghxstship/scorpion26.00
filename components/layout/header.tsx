"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CartButton from "@/components/cart/cart-button";
import CartDrawer from "@/components/cart/cart-drawer";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Programs",
    href: "/programs",
    submenu: [
      { name: "All Programs", href: "/programs" },
      { name: "Starter Tier", href: "/programs#bundles" },
      { name: "Advanced Tier", href: "/programs#bundles" },
      { name: "Pro Tier", href: "/programs#bundles" },
      { name: "Elite Tier", href: "/programs#bundles" },
      { name: "Custom Private Training", href: "/programs#custom" },
    ],
  },
  { name: "About", href: "/about" },
  { name: "Results", href: "/results" },
  { name: "Content", href: "/content" },
  { name: "Shop", href: "/shop" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-montserrat text-base sm:text-xl font-bold text-primary-foreground">
              EF
            </span>
          </div>
          <span className="font-montserrat text-base sm:text-xl font-bold">
            Elite Fitness
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          {navigation.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() =>
                item.submenu && setActiveSubmenu(item.name)
              }
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <Link
                href={item.href}
                className="flex items-center text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {item.name}
                {item.submenu && (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </Link>

              {/* Submenu */}
              {item.submenu && activeSubmenu === item.name && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="w-56 rounded-lg border bg-background p-2 shadow-lg">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block rounded-md px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <CartButton />
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/join">Start Free Trial</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <CartButton />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 border-t bg-background px-3 sm:px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block rounded-md px-2.5 sm:px-3 py-2 text-sm sm:text-base font-medium text-foreground/80 hover:bg-accent hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block rounded-md px-3 py-2 text-sm text-foreground/60 hover:bg-accent hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/join">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Cart Drawer */}
      <CartDrawer />
    </header>
  );
}
