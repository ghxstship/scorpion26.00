// API Middleware for Role-Based Access Control
// This is a demo implementation - in production, use proper JWT validation

import { NextRequest, NextResponse } from "next/server";
import { UserRole, Permission } from "@/lib/auth/rbac-types";
import { hasPermission, isRoleAtLeast } from "@/lib/auth/rbac-utils";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  general: { windowMs: 15 * 60 * 1000, max: 100 },
  auth: { windowMs: 15 * 60 * 1000, max: 5 },
  api: {
    guest: { windowMs: 15 * 60 * 1000, max: 50 },
    member: { windowMs: 15 * 60 * 1000, max: 200 },
    team: { windowMs: 15 * 60 * 1000, max: 500 },
    admin: { windowMs: 15 * 60 * 1000, max: 1000 },
  },
};

/**
 * Authenticate request (demo implementation)
 * In production, validate JWT tokens from Authorization header
 */
export function authenticate(request: NextRequest): {
  authenticated: boolean;
  user?: { id: string; email: string; role: UserRole };
  error?: string;
} {
  // Demo: Check for user data in headers (in production, validate JWT)
  const userHeader = request.headers.get("x-user-data");
  
  if (!userHeader) {
    return { authenticated: false, error: "No authentication provided" };
  }

  try {
    const user = JSON.parse(userHeader);
    
    if (!user.id || !user.email || !user.role) {
      return { authenticated: false, error: "Invalid user data" };
    }

    return { authenticated: true, user };
  } catch {
    return { authenticated: false, error: "Invalid authentication data" };
  }
}

/**
 * Require authentication middleware
 */
export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const auth = authenticate(request);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: auth.error || "Authentication required" } },
        { status: 401 }
      );
    }

    // Attach user to request
    (request as AuthenticatedRequest).user = auth.user;

    return handler(request as AuthenticatedRequest);
  };
}

/**
 * Require specific role(s)
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return requireAuth(async (request: AuthenticatedRequest) => {
      const userRole = request.user?.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "Insufficient permissions",
              details: `Required role: ${allowedRoles.join(" or ")}`,
            },
          },
          { status: 403 }
        );
      }

      return handler(request);
    });
  };
}

/**
 * Require specific permission
 */
export function requirePermission(permission: Permission) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return requireAuth(async (request: AuthenticatedRequest) => {
      const userRole = request.user?.role;

      if (!userRole || !hasPermission(userRole, permission)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: `Requires ${permission} permission`,
            },
          },
          { status: 403 }
        );
      }

      return handler(request);
    });
  };
}

/**
 * Require minimum role level
 */
export function requireMinRole(minimumRole: UserRole) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return requireAuth(async (request: AuthenticatedRequest) => {
      const userRole = request.user?.role;

      if (!userRole || !isRoleAtLeast(userRole, minimumRole)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: `Requires at least ${minimumRole} role`,
            },
          },
          { status: 403 }
        );
      }

      return handler(request);
    });
  };
}

/**
 * Validate request body against schema
 */
export function validateBody<T>(schema: {
  parse: (data: unknown) => T;
}) {
  return (handler: (req: AuthenticatedRequest, body: T) => Promise<NextResponse>) => {
    return async (request: AuthenticatedRequest) => {
      try {
        const rawBody = await request.json();
        const validatedBody = schema.parse(rawBody);
        return handler(request, validatedBody);
      } catch (error: any) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Invalid request body",
              details: error.errors || error.message,
            },
          },
          { status: 400 }
        );
      }
    };
  };
}

/**
 * Error handler wrapper
 */
export function withErrorHandler(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error: any) {
      console.error("API Error:", error);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "An internal error occurred",
            ...(process.env.NODE_ENV === "development" && {
              details: error.message,
              stack: error.stack,
            }),
          },
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Audit log helper
 */
export async function auditLog(data: {
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  // In production, save to database
  console.log("[AUDIT]", {
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, meta?: any) {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta }),
  });
}

/**
 * Error response helper
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: any
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}
