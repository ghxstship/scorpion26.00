// Example API Route: User Management (Admin Only)
// Demonstrates role-based access control with middleware

import { NextRequest, NextResponse } from "next/server";
import { 
  requireRole, 
  withErrorHandler, 
  successResponse, 
  errorResponse,
  auditLog,
  type AuthenticatedRequest 
} from "@/lib/api/middleware";
import { UserRole } from "@/lib/auth/rbac-types";

/**
 * GET /api/example/users
 * List all users (Admin only)
 */
export const GET = withErrorHandler(
  requireRole(UserRole.ADMIN)(async (request: AuthenticatedRequest) => {
    // Simulate fetching users from database
    const users = [
      { id: "1", email: "user1@example.com", role: "member", name: "John Doe" },
      { id: "2", email: "user2@example.com", role: "guest", name: "Jane Smith" },
      { id: "3", email: "admin@example.com", role: "admin", name: "Admin User" },
    ];

    // Log the action
    await auditLog({
      userId: request.user?.id,
      action: "users.list",
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return successResponse(users, {
      pagination: {
        page: 1,
        perPage: 20,
        total: users.length,
        totalPages: 1,
      },
    });
  })
);

/**
 * POST /api/example/users
 * Create a new user (Admin only)
 */
export const POST = withErrorHandler(
  requireRole(UserRole.ADMIN)(async (request: AuthenticatedRequest) => {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.name || !body.role) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Missing required fields",
        400,
        { required: ["email", "name", "role"] }
      );
    }

    // Simulate creating user
    const newUser = {
      id: Date.now().toString(),
      email: body.email,
      name: body.name,
      role: body.role,
      createdAt: new Date().toISOString(),
    };

    // Log the action
    await auditLog({
      userId: request.user?.id,
      action: "users.create",
      resourceType: "user",
      resourceId: newUser.id,
      changes: newUser,
    });

    return successResponse(newUser);
  })
);
