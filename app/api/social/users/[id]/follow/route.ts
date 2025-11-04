import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Can't follow yourself
    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', params.id)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already blocked
    const { data: blocked } = await supabase
      .from('blocked_users')
      .select('id')
      .or(`blocker_id.eq.${session.user.id},blocker_id.eq.${params.id}`)
      .or(`blocked_id.eq.${session.user.id},blocked_id.eq.${params.id}`)
      .single();

    if (blocked) {
      return NextResponse.json(
        { error: 'Cannot follow this user' },
        { status: 403 }
      );
    }

    // Create follow relationship
    const { data: follow, error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: session.user.id,
        following_id: params.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Already following this user' },
          { status: 409 }
        );
      }
      console.error('Error creating follow:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification
    await supabase.from('notifications').insert({
      user_id: params.id,
      type: 'social_follow',
      title: 'New Follower',
      message: 'Someone started following you',
      data: {
        from_user_id: session.user.id
      }
    });

    return NextResponse.json({ follow });
  } catch (error) {
    console.error('Error in follow route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', session.user.id)
      .eq('following_id', params.id);

    if (error) {
      console.error('Error unfollowing:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in unfollow route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
