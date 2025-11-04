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

    const { data: followers, error } = await supabase
      .from('user_follows')
      .select(`
        follower_id,
        created_at,
        profiles:follower_id (
          id,
          full_name,
          avatar_url,
          bio,
          follower_count,
          following_count
        )
      `)
      .eq('following_id', params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching followers:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check if current user follows each follower
    const followersWithStatus = await Promise.all(
      (followers || []).map(async (follower) => {
        const { data: isFollowing } = await supabase
          .from('user_follows')
          .select('id')
          .eq('follower_id', session.user.id)
          .eq('following_id', follower.follower_id)
          .single();

        return {
          ...follower.profiles,
          is_following: !!isFollowing,
          followed_at: follower.created_at
        };
      })
    );

    return NextResponse.json({ followers: followersWithStatus });
  } catch (error) {
    console.error('Error in followers route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
