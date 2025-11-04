import DashboardLayoutWrapper from "@/components/layouts/dashboard-layout-wrapper";

/**
 * Member Layout
 * 
 * Wraps all member routes with DashboardLayout.
 * Handles authentication and provides consistent navigation.
 */
export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
