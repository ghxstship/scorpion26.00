import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';

// GET /api/subscriptions/my - Get user's subscription
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // Not found is ok
      return errorResponse('DATABASE_ERROR', error.message, 500);
    }

    return successResponse(data || null);
  } catch (error: any) {
    console.error('Subscription GET error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch subscription', 500);
  }
});
