import { NextRequest } from 'next/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import { createClient } from '@/lib/supabase/server';

// GET /api/onboarding/progress - Get user's onboarding progress
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      throw error;
    }

    // If no onboarding record exists, create one
    if (!data) {
      const { data: newProgress, error: createError } = await supabase
        .from('onboarding_progress')
        .insert({
          user_id: user.id,
          current_step: 1,
          completed_steps: [],
        })
        .select()
        .single();

      if (createError) throw createError;

      return successResponse({ progress: newProgress });
    }

    return successResponse({ progress: data });
  } catch (error: any) {
    console.error('Onboarding progress GET error:', error);
    return errorResponse('INTERNAL_ERROR', error.message, 500);
  }
});
