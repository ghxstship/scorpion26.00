import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, successResponse, errorResponse, AuthenticatedUser } from '@/lib/api/auth-middleware';

// POST /api/community/posts/[id]/like - Toggle like on post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = params;
      const supabase = await createClient();

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);

        // Decrement count
        await supabase.rpc('decrement_post_likes', { post_id_param: id });

        return successResponse({ liked: false });
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ post_id: id, user_id: user.id });

        // Increment count
        await supabase.rpc('increment_post_likes', { post_id_param: id });

        return successResponse({ liked: true });
      }
    } catch (error: any) {
      console.error('Like POST error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to toggle like', 500);
    }
  })(request);
}
