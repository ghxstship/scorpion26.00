import { Metadata } from "next";
import ShopHeroSection from "@/components/shop/shop-hero-section";
import ProductGridSection from "@/components/shop/product-grid-section";

export const metadata: Metadata = {
  title: "Shop - Fitness Gear & Supplements",
  description: "Browse our curated selection of fitness equipment, apparel, and supplements to support your transformation journey.",
};

export default function ShopPage() {
  return (
    <>
      <ShopHeroSection />
      <ProductGridSection />
    </>
  );
}
