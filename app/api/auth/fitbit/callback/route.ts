import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/member/settings/connections?error=${error}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/member/settings/connections?error=no_code', request.url)
      );
    }

    // Exchange code for access token
    const credentials = Buffer.from(
      `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.FITBIT_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Fitbit token exchange failed:', error);
      return NextResponse.redirect(
        new URL('/member/settings/connections?error=token_exchange_failed', request.url)
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, user_id } = tokens;

    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(
        new URL('/login?error=unauthorized', request.url)
      );
    }

    // Calculate token expiration
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    // Save connection to database
    const { error: dbError } = await supabase
      .from('health_connections')
      .upsert({
        user_id: user.id,
        provider: 'fitbit',
        access_token,
        refresh_token,
        token_expires_at: expiresAt.toISOString(),
        sync_enabled: true,
        metadata: { fitbit_user_id: user_id },
      }, {
        onConflict: 'user_id,provider',
      });

    if (dbError) {
      console.error('Failed to save Fitbit connection:', dbError);
      return NextResponse.redirect(
        new URL('/member/settings/connections?error=save_failed', request.url)
      );
    }

    // Redirect back to connections page with success
    return NextResponse.redirect(
      new URL('/member/settings/connections?success=fitbit_connected', request.url)
    );
  } catch (error: any) {
    console.error('Fitbit OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/member/settings/connections?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
