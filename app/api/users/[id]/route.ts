import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, withMinRole, successResponse, errorResponse, AuthenticatedUser } from '@/lib/api/auth-middleware';
import { UserRole } from '@/lib/auth/rbac-types';

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = params;
      const supabase = await createClient();

      // Users can only view their own profile unless they're Team/Admin
      if (user.id !== id && user.role !== UserRole.ADMIN && user.role !== UserRole.TEAM) {
        return errorResponse('FORBIDDEN', 'You can only view your own profile', 403);
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(
            roles(name, level)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        return errorResponse('NOT_FOUND', 'User not found', 404);
      }

      return successResponse(data);
    } catch (error: any) {
      console.error('User GET error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to fetch user', 500);
    }
  })(request);
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = params;
      const body = await request.json();
      const supabase = await createClient();

      // Users can only update their own profile unless they're Admin
      if (user.id !== id && user.role !== UserRole.ADMIN) {
        return errorResponse('FORBIDDEN', 'You can only update your own profile', 403);
      }

      // Remove sensitive fields
      const { id: _, created_at, ...updateData } = body;

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse('DATABASE_ERROR', error.message, 500);
      }

      return successResponse(data);
    } catch (error: any) {
      console.error('User PATCH error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to update user', 500);
    }
  })(request);
}

// DELETE /api/users/[id] - Delete user (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withMinRole(UserRole.ADMIN, async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = params;
      const supabase = await createClient();

      // Soft delete by updating status
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'deleted', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        return errorResponse('DATABASE_ERROR', error.message, 500);
      }

      return successResponse({ deleted: true });
    } catch (error: any) {
      console.error('User DELETE error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to delete user', 500);
    }
  })(request);
}
