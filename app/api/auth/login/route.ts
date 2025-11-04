import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Get user role from database
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(name, level)')
      .eq('user_id', data.user.id)
      .eq('is_active', true)
      .order('roles(level)', { ascending: true })
      .limit(1)
      .single();

    const roleName = (userRole as any)?.roles?.name || 'guest';

    return NextResponse.json({
      user: data.user,
      session: data.session,
      role: roleName,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
