import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify ownership
    const { data: connection } = await supabase
      .from('health_connections')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!connection || connection.user_id !== user.id) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('health_connections')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Connection deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting health connection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete health connection' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Verify ownership
    const { data: connection } = await supabase
      .from('health_connections')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!connection || connection.user_id !== user.id) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('health_connections')
      .update({
        sync_enabled: body.sync_enabled,
        sync_frequency_hours: body.sync_frequency_hours,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      connection: {
        ...data,
        access_token: undefined,
        refresh_token: undefined,
      },
    });
  } catch (error: any) {
    console.error('Error updating health connection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update health connection' },
      { status: 500 }
    );
  }
}
