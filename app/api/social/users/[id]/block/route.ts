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

    // Can't block yourself
    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot block yourself' },
        { status: 400 }
      );
    }

    // Block user
    const { data: block, error } = await supabase
      .from('blocked_users')
      .insert({
        blocker_id: session.user.id,
        blocked_id: params.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'User already blocked' },
          { status: 409 }
        );
      }
      console.error('Error blocking user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Remove any follow relationships
    await supabase
      .from('user_follows')
      .delete()
      .or(`follower_id.eq.${session.user.id},following_id.eq.${session.user.id}`)
      .or(`follower_id.eq.${params.id},following_id.eq.${params.id}`);

    return NextResponse.json({ block });
  } catch (error) {
    console.error('Error in block route:', error);
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
      .from('blocked_users')
      .delete()
      .eq('blocker_id', session.user.id)
      .eq('blocked_id', params.id);

    if (error) {
      console.error('Error unblocking user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in unblock route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
