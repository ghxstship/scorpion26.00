'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatePost } from '@/components/social/create-post';
import { ActivityFeed } from '@/components/social/activity-feed';

interface FeedClientProps {
  currentUserId: string;
  userProfile: {
    full_name: string;
    avatar_url: string;
  };
}

export function FeedClient({ currentUserId, userProfile }: FeedClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'workouts' | 'achievements'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Activity Feed</h1>

      {/* Create Post */}
      <CreatePost userProfile={userProfile} onPostCreated={handlePostCreated} />

      {/* Feed Filters */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Everyone</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ActivityFeed key={`all-${refreshKey}`} filter="all" currentUserId={currentUserId} />
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          <ActivityFeed key={`following-${refreshKey}`} filter="following" currentUserId={currentUserId} />
        </TabsContent>

        <TabsContent value="workouts" className="mt-6">
          <ActivityFeed key={`workouts-${refreshKey}`} filter="workouts" currentUserId={currentUserId} />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <ActivityFeed key={`achievements-${refreshKey}`} filter="achievements" currentUserId={currentUserId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
