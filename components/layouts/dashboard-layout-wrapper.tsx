"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, type DemoUser } from "@/lib/auth/demo-auth";
import DashboardLayout from "@/components/layouts/dashboard-layout";

/**
 * Dashboard Layout Wrapper
 * 
 * Handles authentication and wraps content in DashboardLayout.
 * Used by all authenticated route groups (member, admin, collaborator, guest, team).
 * 
 * This component:
 * - Checks authentication status
 * - Redirects to login if not authenticated
 * - Provides logout functionality
 * - Wraps children in DashboardLayout with proper user context
 */
export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
    } else {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      {children}
    </DashboardLayout>
  );
}
