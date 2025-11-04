import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get conversations where user is a participant
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants!inner(
          user_id,
          last_read_at
        ),
        messages(
          id,
          content,
          sender_id,
          created_at,
          sender:profiles!messages_sender_id_fkey(full_name, email)
        )
      `)
      .eq('conversation_participants.user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*, conversation:conversations!inner(participants:conversation_participants!inner(user_id, last_read_at))', { count: 'exact', head: true })
      .eq('conversation_participants.user_id', user.id)
      .gt('created_at', 'conversation_participants.last_read_at');

    return NextResponse.json({
      conversations,
      unreadCount: unreadCount || 0
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipient_id, content } = body;

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (convError) throw convError;

    // Add participants
    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: conversation.id, user_id: user.id },
        { conversation_id: conversation.id, user_id: recipient_id }
      ]);

    if (partError) throw partError;

    // Send first message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        content
      })
      .select()
      .single();

    if (msgError) throw msgError;

    return NextResponse.json({ conversation, message }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
