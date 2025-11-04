'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { PostCard } from './post-card';
import { Loader2 } from 'lucide-react';

interface ActivityFeedProps {
  filter?: 'all' | 'following' | 'workouts' | 'achievements';
  currentUserId: string;
}

export function ActivityFeed({ filter = 'all', currentUserId }: ActivityFeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { ref, inView } = useInView();

  const loadPosts = useCallback(async (reset = false) => {
    if (!hasMore && !reset) return;

    setLoading(true);
    try {
      const currentOffset = reset ? 0 : offset;
      const response = await fetch(
        `/api/social/feed?filter=${filter}&limit=20&offset=${currentOffset}`
      );

      if (response.ok) {
        const data = await response.json();
        if (reset) {
          setPosts(data.posts);
        } else {
          setPosts((prev) => [...prev, ...data.posts]);
        }
        setHasMore(data.posts.length === 20);
        setOffset(currentOffset + data.posts.length);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, offset, hasMore]);

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    loadPosts(true);
  }, [filter, loadPosts]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadPosts();
    }
  }, [inView, hasMore, loading, loadPosts]);

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handleKudos = () => {
    // Optionally refresh or update post
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No posts to show. {filter === 'following' && 'Follow some users to see their activity!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onDelete={handleDeletePost}
          onKudos={handleKudos}
        />
      ))}

      {hasMore && (
        <div ref={ref} className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-muted-foreground py-4">
          You&apos;ve reached the end!
        </p>
      )}
    </div>
  );
}
