import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch content analytics
    const { data: submissions, error: submissionsError } = await supabase
      .from('content_submissions')
      .select('views, engagement_rate')
      .eq('collaborator_id', user.id)
      .eq('status', 'approved');

    if (submissionsError) throw submissionsError;

    const totalViews = submissions?.reduce((sum, s) => sum + (s.views || 0), 0) || 0;
    const avgEngagement = submissions?.length 
      ? submissions.reduce((sum, s) => sum + (s.engagement_rate || 0), 0) / submissions.length 
      : 0;

    // Fetch follower count
    const { count: followers, error: followersError } = await supabase
      .from('collaborator_followers')
      .select('*', { count: 'exact', head: true })
      .eq('collaborator_id', user.id);

    if (followersError) throw followersError;

    return NextResponse.json({
      totalViews,
      engagementRate: Math.round(avgEngagement * 100) / 100,
      followers: followers || 0,
      contentCount: submissions?.length || 0
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
