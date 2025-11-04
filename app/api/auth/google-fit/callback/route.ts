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
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_FIT_CLIENT_ID!,
        client_secret: process.env.GOOGLE_FIT_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_FIT_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Google Fit token exchange failed:', error);
      return NextResponse.redirect(
        new URL('/member/settings/connections?error=token_exchange_failed', request.url)
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokens;

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
        provider: 'google_fit',
        access_token,
        refresh_token,
        token_expires_at: expiresAt.toISOString(),
        sync_enabled: true,
        metadata: {},
      }, {
        onConflict: 'user_id,provider',
      });

    if (dbError) {
      console.error('Failed to save Google Fit connection:', dbError);
      return NextResponse.redirect(
        new URL('/member/settings/connections?error=save_failed', request.url)
      );
    }

    // Redirect back to connections page with success
    return NextResponse.redirect(
      new URL('/member/settings/connections?success=google_fit_connected', request.url)
    );
  } catch (error: any) {
    console.error('Google Fit OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/member/settings/connections?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
