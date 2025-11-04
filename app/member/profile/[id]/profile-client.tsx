'use client';

import { useState } from 'react';
import { MapPin, Link as LinkIcon, Calendar, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FollowButton } from '@/components/social/follow-button';
import { PostCard } from '@/components/social/post-card';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface ProfileClientProps {
  profile: any;
  stats: any;
  recentPosts: any[];
  badges: any[];
  currentUserId: string;
}

export function ProfileClient({
  profile,
  stats,
  recentPosts,
  badges,
  currentUserId,
}: ProfileClientProps) {
  const [isFollowing, setIsFollowing] = useState(profile.is_following);
  const isOwnProfile = profile.is_own_profile;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-32 w-32">
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            <AvatarFallback className="text-4xl">
              {profile.full_name?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                {profile.bio && (
                  <p className="text-muted-foreground mt-2">{profile.bio}</p>
                )}
              </div>

              {isOwnProfile ? (
                <Link href="/member/settings/profile">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <FollowButton
                  userId={profile.id}
                  initialIsFollowing={isFollowing}
                  onFollowChange={setIsFollowing}
                />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
              </div>
            </div>

            {/* Follow Stats */}
            <div className="flex gap-6">
              <Link href={`/member/profile/${profile.id}/followers`}>
                <button className="hover:underline">
                  <strong>{profile.follower_count}</strong>{' '}
                  <span className="text-muted-foreground">Followers</span>
                </button>
              </Link>
              <Link href={`/member/profile/${profile.id}/following`}>
                <button className="hover:underline">
                  <strong>{profile.following_count}</strong>{' '}
                  <span className="text-muted-foreground">Following</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Total Workouts
          </h3>
          <p className="text-3xl font-bold">{stats.total_workouts}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Total Distance
          </h3>
          <p className="text-3xl font-bold">
            {(stats.total_distance / 1000).toFixed(1)} km
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Total Time
          </h3>
          <p className="text-3xl font-bold">
            {Math.floor(stats.total_duration / 60)} hrs
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="badges">Badges ({badges.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6 space-y-4">
          {recentPosts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No activity yet</p>
            </Card>
          ) : (
            recentPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  user_full_name: profile.full_name,
                  user_avatar_url: profile.avatar_url,
                }}
                currentUserId={currentUserId}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          {badges.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No badges earned yet</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <Card key={badge.id} className="p-4 text-center">
                  <div className="text-4xl mb-2">{badge.badges.icon}</div>
                  <h3 className="font-semibold">{badge.badges.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {badge.badges.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(badge.earned_at), {
                      addSuffix: true,
                    })}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
