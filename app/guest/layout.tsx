import DashboardLayoutWrapper from "@/components/layouts/dashboard-layout-wrapper";

/**
 * Guest Layout
 * 
 * Wraps all guest/trial routes with DashboardLayout.
 * Handles authentication and provides consistent navigation.
 */
export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
