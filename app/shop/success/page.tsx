import { Metadata } from "next";
import SuccessSection from "@/components/shop/success-section";

export const metadata: Metadata = {
  title: "Order Successful - Thank You",
  description: "Your order has been successfully placed.",
};

export default function SuccessPage() {
  return <SuccessSection />;
}
