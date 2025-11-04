import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, RefreshCw, Trash2 } from 'lucide-react';
import { HealthConnection, HealthProviderConfig } from '@/types/health';

interface ConnectionCardProps {
  provider: HealthProviderConfig;
  connection: HealthConnection | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleSync: (enabled: boolean) => void;
}

export function ConnectionCard({
  provider,
  connection,
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect,
  onToggleSync,
}: ConnectionCardProps) {
  const lastSyncText = connection?.last_sync_at
    ? new Date(connection.last_sync_at).toLocaleString()
    : 'Never';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{provider.icon}</div>
            <div>
              <CardTitle>{provider.displayName}</CardTitle>
              <CardDescription>{provider.description}</CardDescription>
            </div>
          </div>
          {isConnected ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              Not Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Features */}
        <div>
          <p className="text-sm font-medium mb-2">Features:</p>
          <div className="flex flex-wrap gap-2">
            {provider.features.map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div>
          <p className="text-sm font-medium mb-2">Platforms:</p>
          <div className="flex gap-2">
            {provider.platforms.map((platform) => (
              <Badge key={platform} variant="secondary" className="text-xs capitalize">
                {platform}
              </Badge>
            ))}
          </div>
        </div>

        {isConnected && connection && (
          <>
            <Separator />
            
            {/* Connection Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Sync:</span>
                <span className="font-medium">{lastSyncText}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Auto Sync:</span>
                <Switch
                  checked={connection.sync_enabled}
                  onCheckedChange={onToggleSync}
                />
              </div>
              {connection.sync_enabled && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sync Frequency:</span>
                  <span className="font-medium">Every {connection.sync_frequency_hours}h</span>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          {isConnected ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnect}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              onClick={onConnect}
              disabled={isConnecting}
              className="flex-1"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>Connect {provider.displayName}</>
              )}
            </Button>
          )}
        </div>

        {provider.requiresNativeApp && (
          <p className="text-xs text-muted-foreground">
            * Requires native mobile app
          </p>
        )}
      </CardContent>
    </Card>
  );
}
