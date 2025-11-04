import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate revenue metrics
    const totalRevenue = data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
    const subscriptionRevenue = data?.filter(t => t.type === 'subscription')
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
    const oneTimeRevenue = data?.filter(t => t.type === 'one_time')
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    return NextResponse.json({
      transactions: data,
      metrics: {
        totalRevenue,
        subscriptionRevenue,
        oneTimeRevenue,
        transactionCount: data?.length || 0,
        averageTransaction: data?.length ? totalRevenue / data.length : 0
      }
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue' },
      { status: 500 }
    );
  }
}
