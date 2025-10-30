import { Metadata } from "next";
import ProductDetailSection from "@/components/shop/product-detail-section";

export const metadata: Metadata = {
  title: "Product Details",
  description: "View product details and add to cart",
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailSection productId={params.id} />;
}
