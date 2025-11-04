import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ConnectProviderRequest } from '@/types/health';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: connections, error } = await supabase
      .from('health_connections')
      .select('*')
      .eq('user_id', user.id)
      .order('connected_at', { ascending: false });

    if (error) throw error;

    // Remove sensitive tokens from response
    const sanitizedConnections = connections?.map(conn => ({
      ...conn,
      access_token: undefined,
      refresh_token: undefined,
    }));

    return NextResponse.json({ connections: sanitizedConnections });
  } catch (error: any) {
    console.error('Error fetching health connections:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch health connections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ConnectProviderRequest = await request.json();
    const { provider, access_token, refresh_token, token_expires_at, metadata } = body;

    if (!provider || !access_token) {
      return NextResponse.json(
        { error: 'Provider and access_token are required' },
        { status: 400 }
      );
    }

    // Check if connection already exists
    const { data: existing } = await supabase
      .from('health_connections')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .single();

    if (existing) {
      // Update existing connection
      const { data, error } = await supabase
        .from('health_connections')
        .update({
          access_token,
          refresh_token,
          token_expires_at,
          metadata,
          sync_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        connection: {
          ...data,
          access_token: undefined,
          refresh_token: undefined,
        },
        message: 'Connection updated successfully',
      });
    } else {
      // Create new connection
      const { data, error } = await supabase
        .from('health_connections')
        .insert({
          user_id: user.id,
          provider,
          access_token,
          refresh_token,
          token_expires_at,
          metadata: metadata || {},
          sync_enabled: true,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        connection: {
          ...data,
          access_token: undefined,
          refresh_token: undefined,
        },
        message: 'Connection created successfully',
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error creating health connection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create health connection' },
      { status: 500 }
    );
  }
}
