'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { CommentSection } from './comment-section';
import { ShareMenu } from './share-menu';

interface PostCardProps {
  post: {
    id: string;
    user_id: string;
    post_type: string;
    content: string;
    media_urls: string[];
    kudos_count: number;
    comment_count: number;
    created_at: string;
    user_full_name: string;
    user_avatar_url: string;
    has_kudos: boolean;
  };
  currentUserId: string;
  onDelete?: (postId: string) => void;
  onKudos?: (postId: string) => void;
}

export function PostCard({ post, currentUserId, onDelete, onKudos }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [kudosCount, setKudosCount] = useState(post.kudos_count);
  const [hasKudos, setHasKudos] = useState(post.has_kudos);
  const [isKudosAnimating, setIsKudosAnimating] = useState(false);

  const isOwnPost = post.user_id === currentUserId;

  const handleKudos = async () => {
    try {
      setIsKudosAnimating(true);
      
      const response = await fetch(`/api/social/posts/${post.id}/kudos`, {
        method: hasKudos ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        setHasKudos(!hasKudos);
        setKudosCount(prev => hasKudos ? prev - 1 : prev + 1);
        onKudos?.(post.id);
      }
    } catch (error) {
      console.error('Error toggling kudos:', error);
    } finally {
      setTimeout(() => setIsKudosAnimating(false), 300);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/social/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete?.(post.id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getPostTypeLabel = () => {
    switch (post.post_type) {
      case 'workout':
        return '💪 Workout';
      case 'achievement':
        return '🏆 Achievement';
      case 'photo':
        return '📸 Photo';
      default:
        return '';
    }
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.user_avatar_url} alt={post.user_full_name} />
            <AvatarFallback>{post.user_full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{post.user_full_name}</h3>
              {post.post_type !== 'status' && (
                <span className="text-sm text-muted-foreground">
                  {getPostTypeLabel()}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        {isOwnPost && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
      )}

      {/* Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className={`grid gap-2 mb-4 ${
          post.media_urls.length === 1 ? 'grid-cols-1' :
          post.media_urls.length === 2 ? 'grid-cols-2' :
          'grid-cols-2'
        }`}>
          {post.media_urls.map((url, index) => (
            <div key={index} className="relative w-full h-96">
              <Image
                src={url}
                alt={`Post media ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleKudos}
          className={`gap-2 ${hasKudos ? 'text-red-500' : ''}`}
        >
          <Heart
            className={`h-5 w-5 ${isKudosAnimating ? 'animate-bounce' : ''} ${
              hasKudos ? 'fill-current' : ''
            }`}
          />
          <span>{kudosCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="gap-2"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{post.comment_count}</span>
        </Button>

        <ShareMenu postId={post.id} />
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 pt-4 border-t">
          <CommentSection postId={post.id} />
        </div>
      )}
    </Card>
  );
}
