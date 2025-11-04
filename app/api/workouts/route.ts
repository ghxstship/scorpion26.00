import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, withPermission, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import { Permission } from '@/lib/auth/rbac-types';

// GET /api/workouts - List workouts
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const programId = searchParams.get('program_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let query = supabase
      .from('workouts')
      .select('*', { count: 'exact' })
      .eq('is_published', true);
    
    if (programId) {
      query = query.eq('program_id', programId);
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
    console.error('Workouts GET error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch workouts', 500);
  }
});

// POST /api/workouts - Create a new workout
export const POST = withPermission(
  Permission.MANAGE_CONTENT,
  async (request: NextRequest, user) => {
    try {
      const body = await request.json();
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('workouts')
        .insert({
          ...body,
          created_by: user.id,
          is_published: false,
        })
        .select()
        .single();
      
      if (error) {
        return errorResponse('DATABASE_ERROR', error.message, 500);
      }
      
      return successResponse(data);
    } catch (error: any) {
      console.error('Workouts POST error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to create workout', 500);
    }
  }
);
