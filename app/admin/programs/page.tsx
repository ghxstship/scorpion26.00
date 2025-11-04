"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

const mockPrograms = [
  { id: 1, name: "Strength Builder", workouts: 24, duration: "12 weeks", status: "Published", enrollments: 342 },
  { id: 2, name: "Fat Loss Accelerator", workouts: 18, duration: "8 weeks", status: "Published", enrollments: 567 },
  { id: 3, name: "Muscle Hypertrophy", workouts: 36, duration: "16 weeks", status: "Draft", enrollments: 0 },
  { id: 4, name: "Athletic Performance", workouts: 20, duration: "10 weeks", status: "Published", enrollments: 234 },
];

export default function AdminProgramsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);

  const fetchPrograms = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/programs');
      const data = await response.json();
      setPrograms(data.programs || mockPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms(mockPrograms);
    }
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    if (!hasPermission(user.role, Permission.MANAGE_CONTENT)) {
      router.push("/member/dashboard");
      return;
    }

    fetchPrograms();
    setIsLoading(false);
  }, [router, fetchPrograms]);

  const handleCreateProgram = () => {
    alert('Create program - modal to be implemented');
  };

  const handleView = (programId: number) => {
    router.push(`/admin/programs/${programId}`);
  };

  const handleEdit = (programId: number) => {
    router.push(`/admin/programs/${programId}/edit`);
  };

  const handleDelete = async (programId: number) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
      const response = await fetch(`/api/admin/programs/${programId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchPrograms();
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={spacingClasses.gap.lg}>
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>Programs</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Manage training programs and content
          </Text>
        </div>
        <Button onClick={handleCreateProgram}>
          <Icon icon={Plus} size="sm" className="mr-2" aria-hidden={true} />
          Create Program
        </Button>
      </div>

      <div className={gridClasses.cards['3col']}>
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Icon icon={FolderOpen} size="lg" className="text-primary" aria-hidden={true} />
                <Badge variant={program.status === "Published" ? "default" : "secondary"}>
                  {program.status}
                </Badge>
              </div>
              <CardTitle className="mt-4">{program.name}</CardTitle>
              <CardDescription>
                {program.workouts} workouts • {program.duration}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Enrollments</span>
                  <span className="font-semibold">{program.enrollments}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(program.id)}>
                    <Icon icon={Eye} size="sm" className="mr-2" aria-hidden={true} />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(program.id)}>
                    <Icon icon={Edit} size="sm" className="mr-2" aria-hidden={true} />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(program.id)}>
                    <Icon icon={Trash2} size="sm" aria-label="Delete program" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
