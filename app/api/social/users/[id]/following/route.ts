import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: following, error } = await supabase
      .from('user_follows')
      .select(`
        following_id,
        created_at,
        profiles:following_id (
          id,
          full_name,
          avatar_url,
          bio,
          follower_count,
          following_count
        )
      `)
      .eq('follower_id', params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching following:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check if current user follows each user
    const followingWithStatus = await Promise.all(
      (following || []).map(async (follow) => {
        const { data: isFollowing } = await supabase
          .from('user_follows')
          .select('id')
          .eq('follower_id', session.user.id)
          .eq('following_id', follow.following_id)
          .single();

        return {
          ...follow.profiles,
          is_following: !!isFollowing,
          followed_at: follow.created_at
        };
      })
    );

    return NextResponse.json({ following: followingWithStatus });
  } catch (error) {
    console.error('Error in following route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
