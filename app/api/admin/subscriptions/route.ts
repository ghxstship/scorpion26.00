import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let query = supabase
      .from('subscriptions')
      .select('*, user:profiles(full_name, email), plan:subscription_plans(name, price)')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate metrics
    const activeCount = data?.filter(s => s.status === 'active').length || 0;
    const mrr = data?.filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (s.plan?.price || 0), 0) || 0;

    return NextResponse.json({
      subscriptions: data,
      metrics: {
        activeCount,
        mrr,
        totalCount: data?.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
