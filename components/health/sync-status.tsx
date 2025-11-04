import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { HealthConnection } from '@/types/health';
import { shouldSync } from '@/lib/health/health-utils';

interface SyncStatusProps {
  connections: HealthConnection[];
}

export function SyncStatus({ connections }: SyncStatusProps) {
  if (connections.length === 0) {
    return (
      <Badge variant="secondary" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        No Connections
      </Badge>
    );
  }

  const enabledConnections = connections.filter(c => c.sync_enabled);
  
  if (enabledConnections.length === 0) {
    return (
      <Badge variant="secondary" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        Sync Disabled
      </Badge>
    );
  }

  // Check if any connection needs sync
  const needsSync = enabledConnections.some(c => 
    shouldSync(c.last_sync_at, c.sync_frequency_hours)
  );

  // Find most recent sync
  const lastSync = enabledConnections
    .filter(c => c.last_sync_at)
    .sort((a, b) => new Date(b.last_sync_at!).getTime() - new Date(a.last_sync_at!).getTime())[0];

  if (needsSync) {
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="h-3 w-3" />
        Sync Pending
      </Badge>
    );
  }

  if (lastSync) {
    const timeSinceSync = Date.now() - new Date(lastSync.last_sync_at!).getTime();
    const minutesAgo = Math.floor(timeSinceSync / (1000 * 60));
    const hoursAgo = Math.floor(minutesAgo / 60);

    let timeText = '';
    if (hoursAgo > 0) {
      timeText = `${hoursAgo}h ago`;
    } else if (minutesAgo > 0) {
      timeText = `${minutesAgo}m ago`;
    } else {
      timeText = 'Just now';
    }

    return (
      <Badge variant="default" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Synced {timeText}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <AlertCircle className="h-3 w-3" />
      Never Synced
    </Badge>
  );
}
