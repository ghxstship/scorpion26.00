'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { FollowButton } from './follow-button';

interface UserCardProps {
  user: {
    id: string;
    full_name: string;
    avatar_url: string;
    bio?: string;
    follower_count: number;
    following_count: number;
    is_following?: boolean;
    mutual_followers?: number;
  };
  showFollowButton?: boolean;
  onFollowChange?: () => void;
}

export function UserCard({ user, showFollowButton = true, onFollowChange }: UserCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Link href={`/member/profile/${user.id}`}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url} alt={user.full_name} />
            <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/member/profile/${user.id}`}>
            <h3 className="font-semibold hover:underline truncate">
              {user.full_name}
            </h3>
          </Link>

          {user.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {user.bio}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>
              <strong>{user.follower_count}</strong> followers
            </span>
            <span>
              <strong>{user.following_count}</strong> following
            </span>
          </div>

          {user.mutual_followers !== undefined && user.mutual_followers > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {user.mutual_followers} mutual follower{user.mutual_followers !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {showFollowButton && user.is_following !== undefined && (
          <FollowButton
            userId={user.id}
            initialIsFollowing={user.is_following}
            onFollowChange={onFollowChange}
          />
        )}
      </div>
    </Card>
  );
}
