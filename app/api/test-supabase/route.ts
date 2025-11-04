// Test Supabase Connection
// Visit http://localhost:3000/api/test-supabase to test

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test query - fetch roles
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .order('level', { ascending: true });
    
    if (rolesError) {
      return NextResponse.json({ 
        success: false,
        error: rolesError.message,
        hint: 'Make sure you have run the supabase-schema.sql file in your Supabase SQL Editor'
      }, { status: 500 });
    }
    
    // Test query - count profiles
    const { count: profileCount, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({ 
      success: true,
      message: 'Supabase connection successful!',
      data: {
        roles: roles || [],
        profileCount: profileCount || 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Unknown error',
      hint: 'Check your .env.local file and make sure Supabase credentials are correct'
    }, { status: 500 });
  }
}
