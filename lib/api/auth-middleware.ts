// Enhanced API Middleware with Supabase Authentication
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserRole, Permission } from '@/lib/auth/rbac-types';
import { hasPermission, isRoleAtLeast } from '@/lib/auth/rbac-utils';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthenticatedUser;
}

/**
 * Authenticate request using Supabase
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  authenticated: boolean;
  user?: AuthenticatedUser;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    
    // Get user from Supabase session
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { authenticated: false, error: 'Not authenticated' };
    }

    // Get user role from database
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('roles(level)', { ascending: true })
      .limit(1)
      .single();

    const role = (userRole as any)?.roles?.name || UserRole.GUEST;

    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email!,
        role,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, error: 'Authentication failed' };
  }
}

/**
 * Middleware to require authentication
 */
export function withAuth(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const auth = await authenticateRequest(request);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: auth.error || 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    return handler(request, auth.user);
  };
}

/**
 * Middleware to require specific permission
 */
export function withPermission(
  permission: Permission,
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return withAuth(async (request, user) => {
    if (!hasPermission(user.role, permission)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Requires ${permission} permission`,
          },
        },
        { status: 403 }
      );
    }

    return handler(request, user);
  });
}

/**
 * Middleware to require specific role(s)
 */
export function withRole(
  allowedRoles: UserRole[],
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return withAuth(async (request, user) => {
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Requires one of: ${allowedRoles.join(', ')}`,
          },
        },
        { status: 403 }
      );
    }

    return handler(request, user);
  });
}

/**
 * Middleware to require minimum role level
 */
export function withMinRole(
  minimumRole: UserRole,
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return withAuth(async (request, user) => {
    if (!isRoleAtLeast(user.role, minimumRole)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Requires at least ${minimumRole} role`,
          },
        },
        { status: 403 }
      );
    }

    return handler(request, user);
  });
}

/**
 * Response helpers
 */
export function successResponse<T>(data: T, meta?: any) {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta }),
  });
}

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
