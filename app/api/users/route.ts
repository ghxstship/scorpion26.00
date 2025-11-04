import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withMinRole, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import { UserRole } from '@/lib/auth/rbac-types';

// GET /api/users - List all users (Admin/Team only)
export const GET = withMinRole(
  UserRole.TEAM,
  async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const role = searchParams.get('role');
      const search = searchParams.get('search');

      const supabase = await createClient();

      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(
            roles(name, level)
          )
        `, { count: 'exact' });

      if (role) {
        query = query.eq('user_roles.roles.name', role);
      }

      if (search) {
        query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

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
      console.error('Users GET error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to fetch users', 500);
    }
  }
);
