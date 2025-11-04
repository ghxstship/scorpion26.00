"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, type DemoUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import GuestDashboard from "@/components/dashboard/guest-dashboard";
import MemberDashboardComponent from "@/components/dashboard/member-dashboard";
import CollaboratorDashboard from "@/components/dashboard/collaborator-dashboard";
import TeamDashboard from "@/components/dashboard/team-dashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard";

export default function DashboardPage() {
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

  if (!user) {
    return null;
  }
  
  // Render role-specific dashboard
  const renderDashboardContent = () => {
    switch (user.role) {
      case UserRole.GUEST:
        return <GuestDashboard />;
      case UserRole.MEMBER:
        return <MemberDashboardComponent user={user} />;
      case UserRole.COLLABORATOR:
        return <CollaboratorDashboard user={user} />;
      case UserRole.TEAM:
        return <TeamDashboard user={user} />;
      case UserRole.ADMIN:
        return <AdminDashboard user={user} />;
      default:
        return <GuestDashboard />;
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-montserrat font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>

        {/* Dashboard Content */}
        {renderDashboardContent()}
      </div>
    </DashboardLayout>
  );
}
