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
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { Calendar } from "lucide-react";

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
          <Heading level={1} className="text-3xl font-montserrat">Welcome back, {user.name}!</Heading>
          <Text variant="body-md" className="text-muted-foreground mt-1 flex items-center gap-2">
            <Icon icon={Calendar} size="sm" aria-hidden={true} />
            Here&apos;s what&apos;s happening with your account today.
          </Text>
        </div>

        {/* Dashboard Content */}
        {renderDashboardContent()}
      </div>
    </DashboardLayout>
  );
}
