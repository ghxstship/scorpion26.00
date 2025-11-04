import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { RecoveryScoreCalculator } from '@/lib/ai/recovery-score';
import type { RecoveryInput } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: RecoveryInput = await request.json();

    const calculator = new RecoveryScoreCalculator();
    const result = await calculator.calculateRecoveryScore(user.id, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating recovery score:', error);
    return NextResponse.json(
      { error: 'Failed to calculate recovery score' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    const calculator = new RecoveryScoreCalculator();
    
    if (searchParams.get('trend') === 'true') {
      const trend = await calculator.getRecoveryTrend(user.id);
      return NextResponse.json({ trend });
    }

    const avgScore = await calculator.getAverageRecoveryScore(user.id, days);
    const shouldDeload = await calculator.shouldDeload(user.id);

    return NextResponse.json({
      average_score: avgScore,
      should_deload: shouldDeload,
    });
  } catch (error) {
    console.error('Error fetching recovery data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recovery data' },
      { status: 500 }
    );
  }
}
