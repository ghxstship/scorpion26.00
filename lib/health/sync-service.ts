import { createClient } from '@/lib/supabase/client';
// Import health services dynamically to avoid build errors for optional native modules
// import { appleHealthService } from './apple-health';
import { createGoogleFitService } from './google-fit';
import { createFitbitService } from './fitbit';
import { createGarminService } from './garmin';
import { 
  HealthProvider, 
  HealthDataType, 
  HealthConnection,
  DailyStats,
  SyncResponse 
} from '@/types/health';
import { shouldSync, getRetryDelay, isRateLimitError, isAuthError } from './health-utils';

/**
 * Health Data Sync Service
 * 
 * Handles background synchronization of health data from various providers
 * Features:
 * - Scheduled sync (every 4 hours by default)
 * - Incremental sync (only new data)
 * - Error handling and retry logic
 * - Conflict resolution
 * - Queue failed syncs
 */

export class HealthSyncService {
  private supabase = createClient();
  private isRunning = false;
  private syncInterval: NodeJS.Timeout | null = null;

  /**
   * Start the background sync service
   */
  startBackgroundSync(intervalHours: number = 4): void {
    if (this.isRunning) {
      console.log('Sync service already running');
      return;
    }

    this.isRunning = true;
    const intervalMs = intervalHours * 60 * 60 * 1000;

    // Run initial sync
    this.syncAllConnections();

    // Schedule periodic syncs
    this.syncInterval = setInterval(() => {
      this.syncAllConnections();
    }, intervalMs);

    console.log(`Health sync service started (interval: ${intervalHours}h)`);
  }

  /**
   * Stop the background sync service
   */
  stopBackgroundSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isRunning = false;
    console.log('Health sync service stopped');
  }

  /**
   * Sync all active health connections for all users
   */
  private async syncAllConnections(): Promise<void> {
    try {
      const { data: connections, error } = await this.supabase
        .from('health_connections')
        .select('*')
        .eq('sync_enabled', true);

      if (error) throw error;

      if (!connections || connections.length === 0) {
        console.log('No active health connections to sync');
        return;
      }

      console.log(`Syncing ${connections.length} health connections...`);

      for (const connection of connections) {
        // Check if sync is needed based on frequency
        if (!shouldSync(connection.last_sync_at, connection.sync_frequency_hours)) {
          continue;
        }

        await this.syncConnection(connection);
      }

      // Process failed syncs from queue
      await this.processFailedSyncs();
    } catch (error) {
      console.error('Error syncing all connections:', error);
    }
  }

  /**
   * Sync a specific health connection
   */
  async syncConnection(connection: HealthConnection): Promise<SyncResponse> {
    console.log(`Syncing ${connection.provider} for user ${connection.user_id}`);

    const response: SyncResponse = {
      success: false,
      provider: connection.provider,
      data_types: [],
      records_synced: 0,
      errors: [],
    };

    try {
      // Determine date range for sync
      const endDate = new Date();
      const startDate = connection.last_sync_at 
        ? new Date(connection.last_sync_at)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

      // Sync based on provider
      switch (connection.provider) {
        case 'apple_health':
          await this.syncAppleHealth(connection, startDate, endDate, response);
          break;
        case 'google_fit':
          await this.syncGoogleFit(connection, startDate, endDate, response);
          break;
        case 'fitbit':
          await this.syncFitbit(connection, startDate, endDate, response);
          break;
        case 'garmin':
          await this.syncGarmin(connection, startDate, endDate, response);
          break;
        default:
          throw new Error(`Unsupported provider: ${connection.provider}`);
      }

      // Update last sync time
      await this.supabase
        .from('health_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connection.id);

      response.success = true;
      console.log(`✓ Synced ${connection.provider}: ${response.records_synced} records`);
    } catch (error: any) {
      console.error(`✗ Failed to sync ${connection.provider}:`, error);
      response.errors = [error.message];

      // Handle specific error types
      if (isRateLimitError(error)) {
        await this.queueRetry(connection, 'Rate limit exceeded', 60); // Retry in 60 minutes
      } else if (isAuthError(error)) {
        // Disable sync and notify user
        await this.supabase
          .from('health_connections')
          .update({ sync_enabled: false })
          .eq('id', connection.id);
        
        console.error(`Auth error for ${connection.provider}, sync disabled`);
      } else {
        await this.queueRetry(connection, error.message);
      }
    }

    return response;
  }

  /**
   * Sync Apple Health data
   */
  private async syncAppleHealth(
    connection: HealthConnection,
    startDate: Date,
    endDate: Date,
    response: SyncResponse
  ): Promise<void> {
    // Dynamically import Apple Health service to avoid build-time errors
    try {
      const { appleHealthService } = await import(/* webpackIgnore: true */ './apple-health');
      
      if (!appleHealthService.isHealthKitAvailable()) {
        throw new Error('Apple Health not available on this device');
      }

      // Sync daily stats for each day in range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const stats = await appleHealthService.getDailyStats(currentDate);
        
        if (stats && Object.keys(stats).length > 0) {
          await this.updateDailyStats(connection.user_id, currentDate, stats);
          response.records_synced++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Sync heart rate data
      const heartRateData = await appleHealthService.getHeartRate(startDate, endDate);
      for (const hr of heartRateData) {
        await this.supabase.from('heart_rate_data').insert({
          user_id: connection.user_id,
          recorded_at: hr.startDate,
          bpm: hr.value,
          source: 'apple_watch',
        });
        response.records_synced++;
      }

      response.data_types = ['steps', 'calories', 'heart_rate', 'distance'];
    } catch (error) {
      console.error('Failed to load Apple Health service:', error);
      throw new Error('Apple Health service not available');
    }
  }

  /**
   * Sync Google Fit data
   */
  private async syncGoogleFit(
    connection: HealthConnection,
    startDate: Date,
    endDate: Date,
    response: SyncResponse
  ): Promise<void> {
    if (!connection.access_token) {
      throw new Error('No access token for Google Fit');
    }

    const googleFit = createGoogleFitService(connection.access_token);

    // Sync daily stats for each day in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const stats = await googleFit.getDailyStats(currentDate);
      
      if (stats && Object.keys(stats).length > 0) {
        await this.updateDailyStats(connection.user_id, currentDate, stats);
        response.records_synced++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Sync heart rate data
    const heartRateData = await googleFit.getHeartRate(startDate, endDate);
    for (const hr of heartRateData) {
      const bpm = hr.value[0]?.intVal || hr.value[0]?.fpVal;
      if (bpm) {
        await this.supabase.from('heart_rate_data').insert({
          user_id: connection.user_id,
          recorded_at: new Date(parseInt(hr.startTimeNanos) / 1000000).toISOString(),
          bpm: Math.round(bpm),
          source: 'google_fit',
        });
        response.records_synced++;
      }
    }

    response.data_types = ['steps', 'calories', 'heart_rate', 'distance'];
  }

  /**
   * Sync Fitbit data
   */
  private async syncFitbit(
    connection: HealthConnection,
    startDate: Date,
    endDate: Date,
    response: SyncResponse
  ): Promise<void> {
    if (!connection.access_token) {
      throw new Error('No access token for Fitbit');
    }

    const fitbit = createFitbitService(connection.access_token);

    // Sync daily stats for each day in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const stats = await fitbit.getDailyStats(currentDate);
      
      if (stats && Object.keys(stats).length > 0) {
        await this.updateDailyStats(connection.user_id, currentDate, stats);
        response.records_synced++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    response.data_types = ['steps', 'calories', 'heart_rate', 'sleep', 'distance'];
  }

  /**
   * Sync Garmin data
   */
  private async syncGarmin(
    connection: HealthConnection,
    startDate: Date,
    endDate: Date,
    response: SyncResponse
  ): Promise<void> {
    if (!connection.access_token) {
      throw new Error('No access token for Garmin');
    }

    const garmin = createGarminService({
      consumerKey: process.env.GARMIN_CONSUMER_KEY!,
      consumerSecret: process.env.GARMIN_CONSUMER_SECRET!,
      accessToken: connection.access_token,
      accessTokenSecret: connection.metadata?.access_token_secret,
    });

    // Sync daily stats for each day in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const stats = await garmin.getDailyStats(currentDate);
      
      if (stats && Object.keys(stats).length > 0) {
        await this.updateDailyStats(connection.user_id, currentDate, stats);
        response.records_synced++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    response.data_types = ['steps', 'calories', 'heart_rate', 'distance'];
  }

  /**
   * Update daily stats in database
   */
  private async updateDailyStats(
    userId: string,
    date: Date,
    stats: Partial<DailyStats>
  ): Promise<void> {
    const dateStr = date.toISOString().split('T')[0];

    // Use RPC function for conflict resolution
    await this.supabase.rpc('update_daily_stats', {
      p_user_id: userId,
      p_date: dateStr,
      p_stats: stats,
    });

    // Log sync
    await this.supabase.from('health_data_sync').insert({
      user_id: userId,
      provider: stats.data_sources?.[0] || 'unknown',
      data_type: 'daily_stats',
      sync_date: dateStr,
      data: stats,
      records_synced: 1,
      sync_status: 'success',
    });
  }

  /**
   * Queue a failed sync for retry
   */
  private async queueRetry(
    connection: HealthConnection,
    errorMessage: string,
    retryDelayMinutes?: number
  ): Promise<void> {
    const nextRetryAt = new Date();
    nextRetryAt.setMinutes(nextRetryAt.getMinutes() + (retryDelayMinutes || 60));

    await this.supabase.from('health_sync_queue').insert({
      user_id: connection.user_id,
      connection_id: connection.id,
      provider: connection.provider,
      data_type: 'daily_stats',
      sync_date: new Date().toISOString().split('T')[0],
      last_error: errorMessage,
      next_retry_at: nextRetryAt.toISOString(),
      status: 'pending',
    });
  }

  /**
   * Process failed syncs from queue
   */
  private async processFailedSyncs(): Promise<void> {
    try {
      const { data: queueItems, error } = await this.supabase
        .from('health_sync_queue')
        .select('*, health_connections(*)')
        .eq('status', 'pending')
        .lte('next_retry_at', new Date().toISOString())
        .lt('retry_count', 3);

      if (error) throw error;

      if (!queueItems || queueItems.length === 0) return;

      console.log(`Processing ${queueItems.length} failed syncs...`);

      for (const item of queueItems) {
        const connection = item.health_connections as unknown as HealthConnection;
        
        // Update status to processing
        await this.supabase
          .from('health_sync_queue')
          .update({ status: 'processing' })
          .eq('id', item.id);

        try {
          await this.syncConnection(connection);

          // Mark as completed
          await this.supabase
            .from('health_sync_queue')
            .update({ status: 'completed' })
            .eq('id', item.id);
        } catch (error: any) {
          // Increment retry count
          const retryCount = item.retry_count + 1;
          const nextRetryAt = new Date();
          nextRetryAt.setMilliseconds(nextRetryAt.getMilliseconds() + getRetryDelay(retryCount));

          await this.supabase
            .from('health_sync_queue')
            .update({
              status: retryCount >= 3 ? 'failed' : 'pending',
              retry_count: retryCount,
              last_error: error.message,
              next_retry_at: nextRetryAt.toISOString(),
            })
            .eq('id', item.id);
        }
      }
    } catch (error) {
      console.error('Error processing failed syncs:', error);
    }
  }

  /**
   * Manual sync trigger for a specific user and provider
   */
  async manualSync(userId: string, provider?: HealthProvider): Promise<SyncResponse[]> {
    const query = this.supabase
      .from('health_connections')
      .select('*')
      .eq('user_id', userId);

    if (provider) {
      query.eq('provider', provider);
    }

    const { data: connections, error } = await query;

    if (error) throw error;

    if (!connections || connections.length === 0) {
      throw new Error('No health connections found');
    }

    const results: SyncResponse[] = [];

    for (const connection of connections) {
      const result = await this.syncConnection(connection as HealthConnection);
      results.push(result);
    }

    return results;
  }
}

// Singleton instance
export const healthSyncService = new HealthSyncService();
