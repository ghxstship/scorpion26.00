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

    const { data: kudos, error } = await supabase
      .from('post_kudos')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching kudos:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ kudos: kudos || [] });
  } catch (error) {
    console.error('Error in kudos route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Check if post exists and is accessible
    const { data: post } = await supabase
      .from('activity_posts')
      .select('id, user_id')
      .eq('id', params.id)
      .single();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Add kudos
    const { data: kudos, error } = await supabase
      .from('post_kudos')
      .insert({
        post_id: params.id,
        user_id: session.user.id
      })
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Already gave kudos' },
          { status: 409 }
        );
      }
      console.error('Error adding kudos:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification for post author (if not self)
    if (post.user_id !== session.user.id) {
      await supabase.from('notifications').insert({
        user_id: post.user_id,
        type: 'social_kudos',
        title: 'New Kudos',
        message: 'Someone gave kudos to your post',
        data: {
          post_id: params.id,
          from_user_id: session.user.id
        }
      });
    }

    return NextResponse.json({ kudos });
  } catch (error) {
    console.error('Error in kudos post route:', error);
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
      .from('post_kudos')
      .delete()
      .eq('post_id', params.id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error removing kudos:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in kudos delete route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
