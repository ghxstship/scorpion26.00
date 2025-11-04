import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      post_type,
      content,
      workout_session_id,
      cardio_activity_id,
      badge_id,
      media_urls,
      visibility
    } = body;

    // Validate post type
    const validTypes = ['workout', 'achievement', 'photo', 'status'];
    if (!validTypes.includes(post_type)) {
      return NextResponse.json(
        { error: 'Invalid post type' },
        { status: 400 }
      );
    }

    // Create the post
    const { data: post, error } = await supabase
      .from('activity_posts')
      .insert({
        user_id: session.user.id,
        post_type,
        content,
        workout_session_id,
        cardio_activity_id,
        badge_id,
        media_urls: media_urls || [],
        visibility: visibility || 'public'
      })
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error in posts route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
