import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('collaborator_earnings')
      .select('*')
      .eq('collaborator_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate totals
    const total = data?.reduce((sum, earning) => sum + (earning.amount || 0), 0) || 0;
    const pending = data?.filter(e => e.status === 'pending')
      .reduce((sum, earning) => sum + (earning.amount || 0), 0) || 0;

    return NextResponse.json({
      earnings: data,
      total,
      pending
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}
