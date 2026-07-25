export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StatusEnum = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
export type PriorityEnum = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type RepeatEnum = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';
export type GoalTypeEnum = 'NUMBER' | 'BOOLEAN' | 'PERCENTAGE' | 'TIME' | 'MONEY';
export type WorkspaceVisibilityEnum = 'PRIVATE' | 'TEAM' | 'PUBLIC';
export type NotificationTypeEnum = 'EMAIL' | 'PUSH' | 'IN_APP';
export type EntityTypeEnum = 'TASK' | 'PROJECT' | 'GOAL' | 'HABIT' | 'ASSIGNMENT' | 'HUB' | 'WORKSPACE';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          auth_user_id: string;
          full_name: string;
          username: string | null;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          bio: string | null;
          timezone: string;
          language: string;
          theme: string;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          full_name: string;
          username?: string | null;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          timezone?: string;
          language?: string;
          theme?: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      workspaces: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          color: string;
          visibility: WorkspaceVisibilityEnum;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          color?: string;
          visibility?: WorkspaceVisibilityEnum;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['workspaces']['Insert']>;
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          default_workspace_id: string | null;
          email_notifications: boolean;
          push_notifications: boolean;
          daily_digest: boolean;
          compact_mode: boolean;
          custom_settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          default_workspace_id?: string | null;
          email_notifications?: boolean;
          push_notifications?: boolean;
          daily_digest?: boolean;
          compact_mode?: boolean;
          custom_settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_settings']['Insert']>;
      };
      hubs: {
        Row: {
          id: string;
          workspace_id: string;
          title: string;
          description: string | null;
          color: string;
          icon: string;
          cover_image: string | null;
          sort_order: number;
          is_archived: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          title: string;
          description?: string | null;
          color?: string;
          icon?: string;
          cover_image?: string | null;
          sort_order?: number;
          is_archived?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['hubs']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          workspace_id: string;
          title: string;
          description: string | null;
          color: string;
          icon: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          title: string;
          description?: string | null;
          color?: string;
          icon?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          hub_id: string | null;
          owner_id: string;
          title: string;
          description: string | null;
          status: StatusEnum;
          priority: PriorityEnum;
          progress: number;
          color: string;
          icon: string;
          start_date: string | null;
          due_date: string | null;
          is_favorite: boolean;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          hub_id?: string | null;
          owner_id: string;
          title: string;
          description?: string | null;
          status?: StatusEnum;
          priority?: PriorityEnum;
          progress?: number;
          color?: string;
          icon?: string;
          start_date?: string | null;
          due_date?: string | null;
          is_favorite?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      tasks: {
        Row: {
          id: string;
          workspace_id: string;
          hub_id: string | null;
          project_id: string | null;
          category_id: string | null;
          parent_task_id: string | null;
          created_by: string;
          assigned_to: string | null;
          title: string;
          description: string | null;
          status: StatusEnum;
          priority: PriorityEnum;
          progress: number;
          start_date: string | null;
          due_date: string | null;
          completed_at: string | null;
          estimated_hours: number;
          actual_hours: number;
          repeat_type: RepeatEnum;
          reminder_at: string | null;
          color: string | null;
          icon: string;
          is_favorite: boolean;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          hub_id?: string | null;
          project_id?: string | null;
          category_id?: string | null;
          parent_task_id?: string | null;
          created_by: string;
          assigned_to?: string | null;
          title: string;
          description?: string | null;
          status?: StatusEnum;
          priority?: PriorityEnum;
          progress?: number;
          start_date?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
          estimated_hours?: number;
          actual_hours?: number;
          repeat_type?: RepeatEnum;
          reminder_at?: string | null;
          color?: string | null;
          icon?: string;
          is_favorite?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
      assignments: {
        Row: {
          id: string;
          workspace_id: string;
          hub_id: string | null;
          project_id: string | null;
          course: string | null;
          subject: string | null;
          teacher: string | null;
          title: string;
          description: string | null;
          status: StatusEnum;
          priority: PriorityEnum;
          progress: number;
          submission_url: string | null;
          grade: string | null;
          semester: string | null;
          start_date: string | null;
          due_date: string | null;
          created_by: string;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          hub_id?: string | null;
          project_id?: string | null;
          course?: string | null;
          subject?: string | null;
          teacher?: string | null;
          title: string;
          description?: string | null;
          status?: StatusEnum;
          priority?: PriorityEnum;
          progress?: number;
          submission_url?: string | null;
          grade?: string | null;
          semester?: string | null;
          start_date?: string | null;
          due_date?: string | null;
          created_by: string;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['assignments']['Insert']>;
      };
      goals: {
        Row: {
          id: string;
          workspace_id: string;
          hub_id: string | null;
          project_id: string | null;
          title: string;
          description: string | null;
          goal_type: GoalTypeEnum;
          target_value: number;
          current_value: number;
          measurement_unit: string;
          status: StatusEnum;
          priority: PriorityEnum;
          progress: number;
          start_date: string | null;
          due_date: string | null;
          created_by: string;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          hub_id?: string | null;
          project_id?: string | null;
          title: string;
          description?: string | null;
          goal_type?: GoalTypeEnum;
          target_value?: number;
          current_value?: number;
          measurement_unit?: string;
          status?: StatusEnum;
          priority?: PriorityEnum;
          progress?: number;
          start_date?: string | null;
          due_date?: string | null;
          created_by: string;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['goals']['Insert']>;
      };
      habits: {
        Row: {
          id: string;
          workspace_id: string;
          hub_id: string | null;
          title: string;
          description: string | null;
          frequency: RepeatEnum;
          target_per_day: number;
          target_per_week: number;
          current_streak: number;
          best_streak: number;
          last_completed: string | null;
          status: StatusEnum;
          color: string;
          icon: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          hub_id?: string | null;
          title: string;
          description?: string | null;
          frequency?: RepeatEnum;
          target_per_day?: number;
          target_per_week?: number;
          current_streak?: number;
          best_streak?: number;
          last_completed?: string | null;
          status?: StatusEnum;
          color?: string;
          icon?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['habits']['Insert']>;
      };
      health_records: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          record_type: string;
          value: number;
          unit: string;
          record_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          record_type: string;
          value: number;
          unit: string;
          record_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['health_records']['Insert']>;
      };
      checklists: {
        Row: {
          id: string;
          task_id: string;
          title: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          title: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['checklists']['Insert']>;
      };
      checklist_items: {
        Row: {
          id: string;
          checklist_id: string;
          title: string;
          is_completed: boolean;
          sort_order: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          checklist_id: string;
          title: string;
          is_completed?: boolean;
          sort_order?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['checklist_items']['Insert']>;
      };
    };
  };
}
