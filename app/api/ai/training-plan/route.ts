import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TrainingPlanGenerator } from '@/lib/ai/plan-generator';
import type { TrainingPlanRequest } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: Omit<TrainingPlanRequest, 'user_id'> = await request.json();

    const generator = new TrainingPlanGenerator();
    const result = await generator.generatePlan({
      user_id: user.id,
      ...body,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating training plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate training plan' },
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

    const generator = new TrainingPlanGenerator();
    const plans = await generator.getUserPlans(user.id);

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching training plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training plans' },
      { status: 500 }
    );
  }
}
