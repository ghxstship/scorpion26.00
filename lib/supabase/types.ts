// Supabase Database Types
// Auto-generated type definitions for database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          phone: string | null
          status: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          status?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          status?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      roles: {
        Row: {
          id: number
          name: string
          description: string | null
          level: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          level: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          level?: number
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: number
          user_id: string
          role_id: number
          granted_by: string | null
          granted_at: string
          expires_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: number
          user_id: string
          role_id: number
          granted_by?: string | null
          granted_at?: string
          expires_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: number
          user_id?: string
          role_id?: number
          granted_by?: string | null
          granted_at?: string
          expires_at?: string | null
          is_active?: boolean
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: number | null
          status: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          trial_start: string | null
          trial_end: string | null
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id?: number | null
          status: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          trial_start?: string | null
          trial_end?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: number | null
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          trial_start?: string | null
          trial_end?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          duration: string | null
          difficulty: string | null
          category: string | null
          is_published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          duration?: string | null
          difficulty?: string | null
          category?: string | null
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          duration?: string | null
          difficulty?: string | null
          category?: string | null
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          program_id: string | null
          title: string
          description: string | null
          duration_minutes: number | null
          difficulty: string | null
          video_url: string | null
          equipment: Json | null
          exercises: Json | null
          is_published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          program_id?: string | null
          title: string
          description?: string | null
          duration_minutes?: number | null
          difficulty?: string | null
          video_url?: string | null
          equipment?: Json | null
          exercises?: Json | null
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          program_id?: string | null
          title?: string
          description?: string | null
          duration_minutes?: number | null
          difficulty?: string | null
          video_url?: string | null
          equipment?: Json | null
          exercises?: Json | null
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_logs: {
        Row: {
          id: string
          user_id: string
          workout_id: string
          started_at: string | null
          completed_at: string | null
          duration_minutes: number | null
          calories_burned: number | null
          difficulty_rating: number | null
          notes: string | null
          mood: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_id: string
          started_at?: string | null
          completed_at?: string | null
          duration_minutes?: number | null
          calories_burned?: number | null
          difficulty_rating?: number | null
          notes?: string | null
          mood?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string
          started_at?: string | null
          completed_at?: string | null
          duration_minutes?: number | null
          calories_burned?: number | null
          difficulty_rating?: number | null
          notes?: string | null
          mood?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          media_urls: string[] | null
          post_type: string
          visibility: string
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          media_urls?: string[] | null
          post_type?: string
          visibility?: string
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          media_urls?: string[] | null
          post_type?: string
          visibility?: string
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: number
          earned_at: string
          progress: number
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: number
          earned_at?: string
          progress?: number
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: number
          earned_at?: string
          progress?: number
        }
      }
      user_engagement_scores: {
        Row: {
          user_id: string
          last_login: string | null
          login_streak: number
          total_logins: number
          workouts_completed: number
          community_posts: number
          engagement_score: number | null
          risk_level: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          last_login?: string | null
          login_streak?: number
          total_logins?: number
          workouts_completed?: number
          community_posts?: number
          engagement_score?: number | null
          risk_level?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          last_login?: string | null
          login_streak?: number
          total_logins?: number
          workouts_completed?: number
          community_posts?: number
          engagement_score?: number | null
          risk_level?: string | null
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string | null
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string | null
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string | null
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: number
          user_id: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          changes: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_workout_count: {
        Args: { user_id_param: string }
        Returns: void
      }
      update_login_streak: {
        Args: { user_id_param: string }
        Returns: void
      }
      increment_post_likes: {
        Args: { post_id_param: string }
        Returns: void
      }
      decrement_post_likes: {
        Args: { post_id_param: string }
        Returns: void
      }
      get_user_stats: {
        Args: { user_id_param: string }
        Returns: {
          total_workouts: number
          total_programs: number
          current_streak: number
          total_achievements: number
          engagement_score: number
        }[]
      }
      search_programs: {
        Args: { search_query: string }
        Returns: {
          id: string
          title: string
          description: string
          difficulty: string
          category: string
          rank: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
