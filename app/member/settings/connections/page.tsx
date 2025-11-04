'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Trash2, 
  Settings,
  AlertCircle
} from 'lucide-react';
import { HealthConnection, HealthProvider } from '@/types/health';
import { HEALTH_PROVIDERS } from '@/lib/health/health-utils';
import { ConnectionCard } from '@/components/health/connection-card';

export default function ConnectionsPage() {
  const searchParams = useSearchParams();
  const [connections, setConnections] = useState<HealthConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<HealthProvider | null>(null);

  const successMessage = searchParams.get('success');
  const errorMessage = searchParams.get('error');

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/health/connections');
      
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections);
      }
    } catch (error) {
      console.error('Failed to load connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: HealthProvider) => {
    setConnecting(provider);

    try {
      switch (provider) {
        case 'apple_health':
          // Apple Health requires native iOS app
          alert('Apple Health integration requires the native iOS app. Please download the app from the App Store.');
          break;

        case 'google_fit':
          // Redirect to Google OAuth
          const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
          googleAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_GOOGLE_FIT_CLIENT_ID || '');
          googleAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/api/auth/google-fit/callback`);
          googleAuthUrl.searchParams.set('response_type', 'code');
          googleAuthUrl.searchParams.set('scope', [
            'https://www.googleapis.com/auth/fitness.activity.read',
            'https://www.googleapis.com/auth/fitness.activity.write',
            'https://www.googleapis.com/auth/fitness.body.read',
            'https://www.googleapis.com/auth/fitness.location.read',
            'https://www.googleapis.com/auth/fitness.heart_rate.read',
          ].join(' '));
          googleAuthUrl.searchParams.set('access_type', 'offline');
          googleAuthUrl.searchParams.set('prompt', 'consent');
          
          window.location.href = googleAuthUrl.toString();
          break;

        case 'fitbit':
          // Redirect to Fitbit OAuth
          const fitbitAuthUrl = new URL('https://www.fitbit.com/oauth2/authorize');
          fitbitAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID || '');
          fitbitAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/api/auth/fitbit/callback`);
          fitbitAuthUrl.searchParams.set('response_type', 'code');
          fitbitAuthUrl.searchParams.set('scope', [
            'activity',
            'heartrate',
            'sleep',
            'weight',
            'profile',
          ].join(' '));
          
          window.location.href = fitbitAuthUrl.toString();
          break;

        case 'garmin':
          alert('Garmin integration requires a partnership agreement. Please contact support for more information.');
          break;

        case 'whoop':
          alert('WHOOP integration coming soon!');
          break;
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect this device? Your historical data will be preserved.')) {
      return;
    }

    try {
      const response = await fetch(`/api/health/connections/${connectionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadConnections();
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const handleToggleSync = async (connectionId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/health/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sync_enabled: enabled }),
      });

      if (response.ok) {
        await loadConnections();
      }
    } catch (error) {
      console.error('Failed to toggle sync:', error);
    }
  };

  const getConnection = (provider: HealthProvider) => {
    return connections.find(c => c.provider === provider);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Health Connections</h1>
        <p className="text-muted-foreground">
          Connect your fitness devices and apps to sync your health data
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            {successMessage === 'google_fit_connected' && 'Google Fit connected successfully!'}
            {successMessage === 'fitbit_connected' && 'Fitbit connected successfully!'}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to connect: {errorMessage.replace(/_/g, ' ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Available Providers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Integrations</h2>
        
        {Object.values(HEALTH_PROVIDERS).map((provider) => {
          const connection = getConnection(provider.name as HealthProvider);
          const isConnected = !!connection;

          return (
            <ConnectionCard
              key={provider.name}
              provider={provider}
              connection={connection}
              isConnected={isConnected}
              isConnecting={connecting === provider.name}
              onConnect={() => handleConnect(provider.name as HealthProvider)}
              onDisconnect={() => connection && handleDisconnect(connection.id)}
              onToggleSync={(enabled: boolean) => connection && handleToggleSync(connection.id, enabled)}
            />
          );
        })}
      </div>

      {/* Sync Settings */}
      {connections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sync Settings</CardTitle>
            <CardDescription>
              Configure how often your health data syncs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automatic Sync</p>
                  <p className="text-sm text-muted-foreground">
                    Sync data every 4 hours in the background
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Conflict Resolution</p>
                  <p className="text-sm text-muted-foreground">
                    When multiple sources report different values
                  </p>
                </div>
                <select className="border rounded-md px-3 py-2 text-sm">
                  <option value="newest">Use Newest</option>
                  <option value="highest">Use Highest</option>
                  <option value="manual">Ask Me</option>
                </select>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bidirectional Sync</p>
                  <p className="text-sm text-muted-foreground">
                    Write workouts back to connected apps
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Data Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • Your health data is encrypted and stored securely
          </p>
          <p>
            • We never share your health data with third parties
          </p>
          <p>
            • You can disconnect devices and delete your data at any time
          </p>
          <p>
            • Access tokens are encrypted and stored securely
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
