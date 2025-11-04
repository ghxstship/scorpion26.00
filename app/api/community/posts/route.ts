import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';

// GET /api/community/posts - List posts
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const supabase = await createClient();

    const { data, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey(id, first_name, last_name, avatar_url)
      `, { count: 'exact' })
      .eq('visibility', 'public')
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
    console.error('Posts GET error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch posts', 500);
  }
});

// POST /api/community/posts - Create post
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content: body.content,
        media_urls: body.media_urls || [],
        post_type: body.post_type || 'update',
        visibility: body.visibility || 'public',
      })
      .select()
      .single();

    if (error) {
      return errorResponse('DATABASE_ERROR', error.message, 500);
    }

    return successResponse(data);
  } catch (error: any) {
    console.error('Posts POST error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to create post', 500);
  }
});
