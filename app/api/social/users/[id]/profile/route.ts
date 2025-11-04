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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if blocked
    const { data: blocked } = await supabase
      .from('blocked_users')
      .select('id')
      .or(`blocker_id.eq.${session.user.id},blocker_id.eq.${params.id}`)
      .or(`blocked_id.eq.${session.user.id},blocked_id.eq.${params.id}`)
      .single();

    if (blocked) {
      return NextResponse.json(
        { error: 'Cannot view this profile' },
        { status: 403 }
      );
    }

    // Check if following
    const { data: followData } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', session.user.id)
      .eq('following_id', params.id)
      .single();

    // Get recent activity posts
    const { data: recentPosts } = await supabase
      .from('activity_posts')
      .select('*')
      .eq('user_id', params.id)
      .in('visibility', params.id === session.user.id ? ['public', 'followers', 'private'] : ['public'])
      .order('created_at', { ascending: false })
      .limit(10);

    // Get workout stats
    const { data: workoutStats } = await supabase
      .from('workout_sessions')
      .select('id')
      .eq('user_id', params.id);

    const { data: cardioStats } = await supabase
      .from('cardio_activities')
      .select('distance, duration')
      .eq('user_id', params.id);

    // Get badges
    const { data: badges } = await supabase
      .from('user_badges')
      .select(`
        *,
        badges (
          name,
          description,
          icon,
          tier
        )
      `)
      .eq('user_id', params.id)
      .order('earned_at', { ascending: false })
      .limit(6);

    const totalDistance = cardioStats?.reduce((sum, activity) => sum + (activity.distance || 0), 0) || 0;
    const totalDuration = cardioStats?.reduce((sum, activity) => sum + (activity.duration || 0), 0) || 0;

    return NextResponse.json({
      profile: {
        ...profile,
        is_following: !!followData,
        is_own_profile: params.id === session.user.id
      },
      stats: {
        total_workouts: workoutStats?.length || 0,
        total_distance: totalDistance,
        total_duration: totalDuration
      },
      recent_posts: recentPosts || [],
      badges: badges || []
    });
  } catch (error) {
    console.error('Error in profile route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
