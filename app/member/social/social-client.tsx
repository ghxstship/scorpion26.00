'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Users, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { UserCard } from '@/components/social/user-card';
import { Card } from '@/components/ui/card';

interface SocialClientProps {
  currentUserId: string;
}

export function SocialClient({ currentUserId }: SocialClientProps) {
  const [activeTab, setActiveTab] = useState('suggested');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSuggestedUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/social/users/suggested?limit=20');
      if (response.ok) {
        const data = await response.json();
        setSuggestedUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading suggested users:', error);
    }
  }, []);

  const loadFollowers = useCallback(async () => {
    try {
      const response = await fetch(`/api/social/users/${currentUserId}/followers`);
      if (response.ok) {
        const data = await response.json();
        setFollowers(data.followers);
      }
    } catch (error) {
      console.error('Error loading followers:', error);
    }
  }, [currentUserId]);

  const loadFollowing = useCallback(async () => {
    try {
      const response = await fetch(`/api/social/users/${currentUserId}/following`);
      if (response.ok) {
        const data = await response.json();
        setFollowing(data.following);
      }
    } catch (error) {
      console.error('Error loading following:', error);
    }
  }, [currentUserId]);

  useEffect(() => {
    loadSuggestedUsers();
    loadFollowers();
    loadFollowing();
  }, [loadSuggestedUsers, loadFollowers, loadFollowing]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/social/users/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowChange = () => {
    loadSuggestedUsers();
    loadFollowers();
    loadFollowing();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Find Friends</h1>
        <p className="text-muted-foreground">
          Connect with other fitness enthusiasts
        </p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-10"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Search Results</h3>
            {searchResults.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowChange={handleFollowChange}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggested">
            <UserPlus className="h-4 w-4 mr-2" />
            Suggested
          </TabsTrigger>
          <TabsTrigger value="followers">
            <Users className="h-4 w-4 mr-2" />
            Followers ({followers.length})
          </TabsTrigger>
          <TabsTrigger value="following">
            <Users className="h-4 w-4 mr-2" />
            Following ({following.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggested" className="mt-6 space-y-3">
          {suggestedUsers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No suggestions available</p>
            </Card>
          ) : (
            suggestedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowChange={handleFollowChange}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="followers" className="mt-6 space-y-3">
          {followers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No followers yet</p>
            </Card>
          ) : (
            followers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowChange={handleFollowChange}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="following" className="mt-6 space-y-3">
          {following.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Not following anyone yet. Start by finding some friends!
              </p>
            </Card>
          ) : (
            following.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowChange={handleFollowChange}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
