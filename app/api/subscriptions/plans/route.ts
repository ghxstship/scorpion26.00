import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/auth-middleware';

// GET /api/subscriptions/plans - List subscription plans (public)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      return errorResponse('DATABASE_ERROR', error.message, 500);
    }

    return successResponse(data);
  } catch (error: any) {
    console.error('Plans GET error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch plans', 500);
  }
}
