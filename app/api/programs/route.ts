import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, withPermission, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import { Permission } from '@/lib/auth/rbac-types';

// GET /api/programs - List all programs
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    
    let query = supabase
      .from('programs')
      .select('*', { count: 'exact' })
      .eq('is_published', true);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
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
    console.error('Programs GET error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch programs', 500);
  }
});

// POST /api/programs - Create a new program
export const POST = withPermission(
  Permission.MANAGE_CONTENT,
  async (request: NextRequest, user) => {
    try {
      const body = await request.json();
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('programs')
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
      console.error('Programs POST error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to create program', 500);
    }
  }
);
