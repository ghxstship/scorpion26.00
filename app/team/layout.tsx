import DashboardLayoutWrapper from "@/components/layouts/dashboard-layout-wrapper";

/**
 * Team Layout
 * 
 * Wraps all team member routes with DashboardLayout.
 * Handles authentication and provides consistent navigation.
 */
export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
