// Error State Components
// Reusable error displays for different contexts

import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

// Full page error
export function PageError({ 
  title = "Something went wrong",
  message = "We encountered an error while loading this page.",
  onRetry,
  onGoHome,
}: ErrorStateProps) {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} variant="default">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {onGoHome && (
              <Button onClick={onGoHome} variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Inline error alert
export function InlineError({ 
  title = "Error",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button onClick={onRetry} variant="ghost" size="sm">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Card error state
export function CardError({
  title = "Failed to load",
  message = "Unable to load this content.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="border-destructive">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Empty state (not an error, but related)
export function EmptyState({
  icon: Icon = AlertCircle,
  title = "No data",
  message = "There's nothing here yet.",
  action,
  actionLabel,
}: {
  icon?: any;
  title?: string;
  message?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{message}</p>
      {action && actionLabel && (
        <Button onClick={action} variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// 404 Not Found
export function NotFound({
  resource = "Page",
  onGoBack,
  onGoHome,
}: {
  resource?: string;
  onGoBack?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div>
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold mt-4">{resource} Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The {resource.toLowerCase()} you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          {onGoBack && (
            <Button onClick={onGoBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome} variant="default">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// 403 Forbidden
export function Forbidden({
  message = "You don't have permission to access this resource.",
  onGoBack,
  onGoHome,
}: {
  message?: string;
  onGoBack?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <div>
            <h2 className="text-2xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground mt-2">{message}</p>
          </div>
          <div className="flex gap-2 justify-center">
            {onGoBack && (
              <Button onClick={onGoBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
            {onGoHome && (
              <Button onClick={onGoHome} variant="default">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Network error
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Unable to connect to the server. Please check your internet connection.</span>
        {onRetry && (
          <Button onClick={onRetry} variant="ghost" size="sm">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
