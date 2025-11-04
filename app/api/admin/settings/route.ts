import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Return default settings if none exist
    if (!data) {
      return NextResponse.json({
        settings: {
          site_name: 'Elite Fitness',
          site_description: 'Transform your fitness journey',
          support_email: 'support@elitefitness.com',
          user_registration_enabled: true,
          email_notifications_enabled: true,
          maintenance_mode: false,
          public_api_enabled: true,
          two_factor_required: true,
          session_timeout_enabled: true,
          session_timeout_minutes: 30
        }
      });
    }

    return NextResponse.json({ settings: data });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('system_settings')
      .upsert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ settings: data });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
