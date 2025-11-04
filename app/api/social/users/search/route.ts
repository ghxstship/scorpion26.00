import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Search users by name or email
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, bio, follower_count, following_count')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .neq('id', session.user.id)
      .eq('profile_visibility', 'public')
      .limit(limit);

    if (error) {
      console.error('Error searching users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check if current user follows each result
    const usersWithStatus = await Promise.all(
      (users || []).map(async (user) => {
        const { data: isFollowing } = await supabase
          .from('user_follows')
          .select('id')
          .eq('follower_id', session.user.id)
          .eq('following_id', user.id)
          .single();

        const { data: isBlocked } = await supabase
          .from('blocked_users')
          .select('id')
          .or(`blocker_id.eq.${session.user.id},blocker_id.eq.${user.id}`)
          .or(`blocked_id.eq.${session.user.id},blocked_id.eq.${user.id}`)
          .single();

        return {
          ...user,
          is_following: !!isFollowing,
          is_blocked: !!isBlocked
        };
      })
    );

    // Filter out blocked users
    const filteredUsers = usersWithStatus.filter(u => !u.is_blocked);

    return NextResponse.json({ users: filteredUsers });
  } catch (error) {
    console.error('Error in search route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
