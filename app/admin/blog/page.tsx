"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

const mockPosts = [
  { id: 1, title: "10 Tips for Building Muscle Mass", author: "John Doe", date: "2024-01-15", status: "Published", views: 1234 },
  { id: 2, title: "The Science of Fat Loss", author: "Jane Smith", date: "2024-01-12", status: "Published", views: 2456 },
  { id: 3, title: "Nutrition Guide for Athletes", author: "Bob Johnson", date: "2024-01-10", status: "Draft", views: 0 },
  { id: 4, title: "Recovery Strategies for Optimal Performance", author: "Alice Williams", date: "2024-01-08", status: "Published", views: 987 },
];

export default function AdminBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/blog');
      const data = await response.json();
      setPosts(data.posts || mockPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(mockPosts);
    }
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    if (!hasPermission(user.role, Permission.MANAGE_CONTENT)) {
      router.push("/member/dashboard");
      return;
    }

    fetchPosts();
    setIsLoading(false);
  }, [router, fetchPosts]);

  const handleNewPost = () => {
    alert('Create new post - modal to be implemented');
  };

  const handleEdit = (postId: number) => {
    router.push(`/admin/blog/${postId}/edit`);
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={spacingClasses.gap.lg}>
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>Blog Posts</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Manage blog content and articles
          </Text>
        </div>
        <Button onClick={handleNewPost}>
          <Icon icon={Plus} size="sm" className="mr-2" aria-hidden={true} />
          New Post
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon icon={FileText} size="lg" className="text-primary" aria-hidden={true} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {post.author}</span>
                      <span className="flex items-center gap-1">
                        <Icon icon={Calendar} size="xs" aria-hidden={true} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon icon={Eye} size="xs" aria-hidden={true} />
                        {post.views} views
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={post.status === "Published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post.id)}>
                    <Icon icon={Edit} size="sm" className="mr-2" aria-hidden={true} />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)}>
                    <Icon icon={Trash2} size="sm" aria-label="Delete post" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
