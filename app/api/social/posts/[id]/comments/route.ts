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

    const { data: comments, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', params.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comments: comments || [] });
  } catch (error) {
    console.error('Error in comments route:', error);
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

    const body = await request.json();
    const { content, parent_comment_id } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
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

    // Create comment
    const { data: comment, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: params.id,
        user_id: session.user.id,
        content: content.trim(),
        parent_comment_id
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
      console.error('Error creating comment:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification for post author (if not self)
    if (post.user_id !== session.user.id) {
      await supabase.from('notifications').insert({
        user_id: post.user_id,
        type: parent_comment_id ? 'social_reply' : 'social_comment',
        title: parent_comment_id ? 'New Reply' : 'New Comment',
        message: parent_comment_id
          ? 'Someone replied to your comment'
          : 'Someone commented on your post',
        data: {
          post_id: params.id,
          comment_id: comment.id,
          from_user_id: session.user.id
        }
      });
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error in comments post route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
