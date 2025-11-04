import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, successResponse, errorResponse, AuthenticatedUser } from '@/lib/api/auth-middleware';

// GET /api/community/posts/[id] - Get post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = params;
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) {
        return errorResponse('NOT_FOUND', 'Post not found', 404);
      }

      return successResponse(data);
    } catch (error: any) {
      console.error('Post GET error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to fetch post', 500);
    }
  })(request);
}

// PATCH /api/community/posts/[id] - Update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = params;
      const body = await request.json();
      const supabase = await createClient();

      // Verify ownership
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!post || post.user_id !== user.id) {
        return errorResponse('FORBIDDEN', 'You can only edit your own posts', 403);
      }

      const { data, error } = await supabase
        .from('posts')
        .update({
          content: body.content,
          media_urls: body.media_urls,
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
      console.error('Post PATCH error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to update post', 500);
    }
  })(request);
}

// DELETE /api/community/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = params;
      const supabase = await createClient();

      // Verify ownership
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!post || post.user_id !== user.id) {
        return errorResponse('FORBIDDEN', 'You can only delete your own posts', 403);
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        return errorResponse('DATABASE_ERROR', error.message, 500);
      }

      return successResponse({ deleted: true });
    } catch (error: any) {
      console.error('Post DELETE error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to delete post', 500);
    }
  })(request);
}
