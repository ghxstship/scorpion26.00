// Feed Widget Component
// Displays activity feed with various event types

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Trophy, 
  MessageCircle, 
  Heart, 
  UserPlus,
  TrendingUp,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";

export type FeedEventType = 
  | "workout_completed"
  | "achievement_earned"
  | "comment_posted"
  | "like_received"
  | "friend_joined"
  | "milestone_reached"
  | "challenge_joined"
  | "other";

export interface FeedEvent {
  id: string;
  type: FeedEventType;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  title: string;
  description?: string;
  timestamp: string;
  link?: string;
  metadata?: Record<string, any>;
}

export interface FeedWidgetProps {
  title: string;
  events: FeedEvent[];
  maxItems?: number;
  showViewAll?: boolean;
  viewAllPath?: string;
}

export default function FeedWidget({
  title,
  events,
  maxItems = 10,
  showViewAll = false,
  viewAllPath,
}: FeedWidgetProps) {
  const displayEvents = events.slice(0, maxItems);

  const getEventIcon = (type: FeedEventType) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "workout_completed":
        return <Dumbbell className={iconClass} />;
      case "achievement_earned":
        return <Trophy className={iconClass} />;
      case "comment_posted":
        return <MessageCircle className={iconClass} />;
      case "like_received":
        return <Heart className={iconClass} />;
      case "friend_joined":
        return <UserPlus className={iconClass} />;
      case "milestone_reached":
        return <TrendingUp className={iconClass} />;
      case "challenge_joined":
        return <Calendar className={iconClass} />;
      default:
        return <MoreHorizontal className={iconClass} />;
    }
  };

  const getEventColor = (type: FeedEventType) => {
    switch (type) {
      case "workout_completed":
        return "bg-blue-500/10 text-blue-500";
      case "achievement_earned":
        return "bg-yellow-500/10 text-yellow-500";
      case "comment_posted":
        return "bg-purple-500/10 text-purple-500";
      case "like_received":
        return "bg-red-500/10 text-red-500";
      case "friend_joined":
        return "bg-green-500/10 text-green-500";
      case "milestone_reached":
        return "bg-orange-500/10 text-orange-500";
      case "challenge_joined":
        return "bg-indigo-500/10 text-indigo-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {showViewAll && viewAllPath && (
          <Link 
            href={viewAllPath}
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {displayEvents.length > 0 ? (
          <div className="space-y-4">
            {displayEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
              >
                {/* User Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarImage src={event.user.avatar} alt={event.user.name} />
                  <AvatarFallback>{getUserInitials(event.user.name)}</AvatarFallback>
                </Avatar>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none mb-1">
                        {event.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Event Icon Badge */}
                    <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatTimestamp(event.timestamp)}
                  </p>

                  {/* Metadata badges */}
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(event.metadata).slice(0, 3).map(([key, value]) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {String(value)}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Link */}
                  {event.link && (
                    <Link
                      href={event.link}
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
