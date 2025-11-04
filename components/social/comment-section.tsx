'use client';

import { useState, useEffect, useCallback } from 'react';
import { Send, Trash2, Edit2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_comment_id: string | null;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [postId, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/social/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          parent_comment_id: replyTo,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        setNewComment('');
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/social/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(
          comments.map((c) => (c.id === commentId ? data.comment : c))
        );
        setEditingId(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const response = await fetch(`/api/social/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const topLevelComments = comments.filter((c) => !c.parent_comment_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_comment_id === parentId);

  if (loading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Comment List */}
      <div className="space-y-4">
        {topLevelComments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <CommentItem
              comment={comment}
              onReply={() => setReplyTo(comment.id)}
              onEdit={() => {
                setEditingId(comment.id);
                setEditContent(comment.content);
              }}
              onDelete={handleDelete}
              isEditing={editingId === comment.id}
              editContent={editContent}
              setEditContent={setEditContent}
              onSaveEdit={() => handleEdit(comment.id)}
              onCancelEdit={() => {
                setEditingId(null);
                setEditContent('');
              }}
            />

            {/* Replies */}
            {getReplies(comment.id).map((reply) => (
              <div key={reply.id} className="ml-12">
                <CommentItem
                  comment={reply}
                  onReply={() => setReplyTo(comment.id)}
                  onEdit={() => {
                    setEditingId(reply.id);
                    setEditContent(reply.content);
                  }}
                  onDelete={handleDelete}
                  isEditing={editingId === reply.id}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  onSaveEdit={() => handleEdit(reply.id)}
                  onCancelEdit={() => {
                    setEditingId(null);
                    setEditContent('');
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? 'Write a reply...' : 'Write a comment...'}
          className="min-h-20"
        />
        <div className="flex flex-col gap-2">
          <Button type="submit" size="icon" disabled={submitting}>
            <Send className="h-4 w-4" />
          </Button>
          {replyTo && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReplyTo(null)}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  onReply: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  editContent: string;
  setEditContent: (content: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  isEditing,
  editContent,
  setEditContent,
  onSaveEdit,
  onCancelEdit,
}: CommentItemProps) {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.profiles.avatar_url} />
        <AvatarFallback>{comment.profiles.full_name?.[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">
              {comment.profiles.full_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-15"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={onSaveEdit}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm">{comment.content}</p>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-4 mt-1 ml-3">
            <button
              onClick={onReply}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reply
            </button>
            <button
              onClick={onEdit}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
