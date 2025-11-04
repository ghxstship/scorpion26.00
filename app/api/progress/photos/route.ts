import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';

// GET /api/progress/photos - Get progress photos
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      return errorResponse('DATABASE_ERROR', error.message, 500);
    }

    return successResponse(data);
  } catch (error: any) {
    console.error('Photos GET error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch photos', 500);
  }
});

// POST /api/progress/photos - Upload progress photo
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('progress_photos')
      .insert({
        user_id: user.id,
        date: body.date || new Date().toISOString().split('T')[0],
        photo_urls: body.photo_urls,
        visibility: body.visibility || 'private',
        notes: body.notes,
      })
      .select()
      .single();

    if (error) {
      return errorResponse('DATABASE_ERROR', error.message, 500);
    }

    return successResponse(data);
  } catch (error: any) {
    console.error('Photos POST error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to upload photo', 500);
  }
});
