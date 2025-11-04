'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreatePostProps {
  userProfile: {
    full_name: string;
    avatar_url: string;
  };
  onPostCreated?: () => void;
}

export function CreatePost({ userProfile, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'status' | 'photo'>('status');
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_type: postType,
          content: content.trim(),
          media_urls: mediaUrls,
          visibility,
        }),
      });

      if (response.ok) {
        setContent('');
        setMediaUrls([]);
        setPostType('status');
        setVisibility('public');
        onPostCreated?.();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, upload to storage and get URLs
    // For now, just create object URLs for preview
    const newUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setMediaUrls([...mediaUrls, ...newUrls].slice(0, 4)); // Max 4 images
  };

  const removeImage = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
            <AvatarFallback>{userProfile.full_name?.[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-25 resize-none"
            />

            {/* Media Preview */}
            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="relative h-32">
                    <Image
                      src={url}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={mediaUrls.length >= 4}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={mediaUrls.length >= 4}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Photo
                </Button>

                <Select value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">🌍 Public</SelectItem>
                    <SelectItem value="followers">👥 Followers</SelectItem>
                    <SelectItem value="private">🔒 Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={submitting || (!content.trim() && mediaUrls.length === 0)}>
                {submitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
