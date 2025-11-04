import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withMinRole, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import { UserRole } from '@/lib/auth/rbac-types';

// GET /api/admin/audit-logs - View audit logs (Admin only)
export const GET = withMinRole(
  UserRole.ADMIN,
  async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');
      const action = searchParams.get('action');
      const userId = searchParams.get('user_id');

      const supabase = await createClient();

      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (action) {
        query = query.eq('action', action);
      }

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        return errorResponse('DATABASE_ERROR', error.message, 500);
      }

      return successResponse(data, {
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
    } catch (error: any) {
      console.error('Audit logs GET error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to fetch audit logs', 500);
    }
  }
);
