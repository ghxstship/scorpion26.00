"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CartButton from "@/components/cart/cart-button";
import CartDrawer from "@/components/cart/cart-drawer";
import { isAuthenticated } from "@/lib/auth/demo-auth";
import { Icon } from "@/components/atoms/icon";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status on mount and when localStorage changes
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
    };
    
    checkAuth();
    
    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener("storage", checkAuth);
    
    // Custom event for same-tab login/logout
    window.addEventListener("authChange", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
      role="banner"
    >
      <nav className="container mx-auto flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 lg:px-8" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2" aria-label="Elite Fitness home">
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
                className="flex items-center text-sm font-medium text-foreground/80 transition-all duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.name}
                {item.submenu && (
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                )}
              </Link>

              {/* Submenu */}
              {item.submenu && activeSubmenu === item.name && (
                <div className="absolute left-0 top-full pt-2 animate-fade-in">
                  <div className="w-56 rounded-lg border bg-background p-2 shadow-lg">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block rounded-md px-4 py-2 text-sm text-foreground/80 transition-all duration-200 hover:bg-accent hover:text-primary hover:translate-x-1"
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
          {isLoggedIn ? (
            <Button variant="default" asChild>
              <Link href="/member/dashboard">
                <Icon icon={User} size="sm" className="mr-2" aria-hidden={true} />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="lg" asChild>
                <Link href="/join">Start Free Trial</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <CartButton />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <Icon icon={X} size="md" aria-hidden={true} />
            ) : (
              <Icon icon={Menu} size="md" aria-hidden={true} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-slide-up" role="navigation" aria-label="Mobile navigation">
          <div className="space-y-1 border-t bg-background px-3 sm:px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block rounded-md px-2.5 sm:px-3 py-2 text-sm sm:text-base font-medium text-foreground/80 transition-all duration-200 hover:bg-accent hover:text-primary hover:translate-x-1"
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
              {isLoggedIn ? (
                <Button className="w-full" asChild>
                  <Link href="/member/dashboard">
                    <Icon icon={User} size="sm" className="mr-2" aria-hidden={true} />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/join">Start Free Trial</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Cart Drawer */}
      <CartDrawer />
    </header>
  );
}
