import DashboardLayoutWrapper from "@/components/layouts/dashboard-layout-wrapper";

/**
 * Collaborator Layout
 * 
 * Wraps all collaborator routes with DashboardLayout.
 * Handles authentication and provides consistent navigation.
 */
export default function CollaboratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
