import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { healthSyncService } from '@/lib/health/sync-service';
import { SyncRequest } from '@/types/health';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SyncRequest = await request.json();
    const { provider, force } = body;

    // Trigger manual sync
    const results = await healthSyncService.manualSync(user.id, provider);

    const totalRecords = results.reduce((sum, r) => sum + r.records_synced, 0);
    const hasErrors = results.some(r => !r.success);

    return NextResponse.json({
      success: !hasErrors,
      results,
      total_records_synced: totalRecords,
      message: hasErrors 
        ? 'Sync completed with errors' 
        : `Successfully synced ${totalRecords} records`,
    });
  } catch (error: any) {
    console.error('Error syncing health data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync health data' },
      { status: 500 }
    );
  }
}
