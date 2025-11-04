import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch user metrics
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeUsers } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('last_active', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // Fetch revenue metrics
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    // Fetch engagement metrics
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('duration')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const avgSessionDuration = sessions?.length 
      ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length 
      : 0;

    return NextResponse.json({
      users: {
        total: totalUsers || 0,
        active: activeUsers || 0
      },
      revenue: {
        total: totalRevenue,
        thisMonth: totalRevenue
      },
      engagement: {
        avgSessionDuration: Math.round(avgSessionDuration),
        totalSessions: sessions?.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
