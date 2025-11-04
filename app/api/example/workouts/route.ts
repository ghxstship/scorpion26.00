// Example API Route: Workouts (Member and above)
// Demonstrates permission-based access control

import { NextResponse } from "next/server";
import { 
  requirePermission,
  requireMinRole,
  withErrorHandler, 
  successResponse,
  type AuthenticatedRequest 
} from "@/lib/api/middleware";
import { Permission, UserRole } from "@/lib/auth/rbac-types";

/**
 * GET /api/example/workouts
 * List workouts (requires access to member programs)
 */
export const GET = withErrorHandler(
  requirePermission(Permission.ACCESS_MEMBER_PROGRAMS)(async (request: AuthenticatedRequest) => {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const type = searchParams.get("type");

    // Simulate fetching workouts
    const workouts = [
      {
        id: "1",
        title: "Full Body Strength",
        difficulty: "intermediate",
        type: "strength",
        duration: 45,
        equipment: ["dumbbells", "bench"],
      },
      {
        id: "2",
        title: "HIIT Cardio Blast",
        difficulty: "advanced",
        type: "cardio",
        duration: 30,
        equipment: [],
      },
      {
        id: "3",
        title: "Beginner Yoga Flow",
        difficulty: "beginner",
        type: "flexibility",
        duration: 20,
        equipment: ["mat"],
      },
    ];

    // Filter based on query params
    let filtered = workouts;
    if (difficulty) {
      filtered = filtered.filter(w => w.difficulty === difficulty);
    }
    if (type) {
      filtered = filtered.filter(w => w.type === type);
    }

    return successResponse(filtered, {
      filters: { difficulty, type },
      total: filtered.length,
    });
  })
);

/**
 * POST /api/example/workouts
 * Create a workout (Team and Admin only)
 */
export const POST = withErrorHandler(
  requireMinRole(UserRole.TEAM)(async (request: AuthenticatedRequest) => {
    const body = await request.json();

    // Simulate creating workout
    const newWorkout = {
      id: Date.now().toString(),
      ...body,
      createdBy: request.user?.id,
      createdAt: new Date().toISOString(),
      status: "draft",
    };

    return successResponse(newWorkout, {
      message: "Workout created successfully. Submit for approval to publish.",
    });
  })
);
