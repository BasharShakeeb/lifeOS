import { supabase } from '@/lib/supabase/client';
import { Task, Project, Hub } from '@/types';
import { logger } from '@/lib/logger';

/**
 * Supabase Integration Repository
 * Provides production-ready Async CRUD methods directly against Supabase PostgreSQL database
 * while adhering to Row Level Security (RLS) policies.
 */
export class SupabaseRepository {
  // TASKS API
  async getTasks(workspaceId: string): Promise<Task[]> {
    const { data, error } = await (supabase.from('tasks') as any)
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Supabase getTasks error:', error);
      return [];
    }

    return (data || []).map((t: any): Task => ({
      id: t.id,
      title: t.title,
      description: t.description || '',
      status: t.status === 'COMPLETED' ? 'completed' : 'in_progress',
      priority: t.priority.toLowerCase() as any,
      dueDate: t.due_date ? t.due_date.split('T')[0] : '',
      tags: [],
      projectId: t.project_id || undefined,
      hubId: t.hub_id || undefined,
      createdAt: t.created_at,
    }));
  }

  async createTask(workspaceId: string, profileId: string, task: Partial<Task>): Promise<Task | null> {
    const { data, error } = await (supabase.from('tasks') as any)
      .insert({
        workspace_id: workspaceId,
        created_by: profileId,
        title: task.title || 'مهمة جديدة',
        description: task.description || null,
        status: (task.status?.toUpperCase() || 'TODO') as any,
        priority: (task.priority?.toUpperCase() || 'MEDIUM') as any,
        due_date: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      })
      .select()
      .single();

    if (error || !data) {
      logger.error('Supabase createTask error:', error);
      return null;
    }

    const t: any = data;
    return {
      id: t.id,
      title: t.title,
      description: t.description || '',
      status: t.status === 'COMPLETED' ? 'completed' : 'in_progress',
      priority: t.priority.toLowerCase() as any,
      dueDate: t.due_date ? t.due_date.split('T')[0] : '',
      tags: [],
      createdAt: t.created_at,
    };
  }

  async toggleTaskStatus(taskId: string, currentStatus: string): Promise<boolean> {
    const nextStatus = currentStatus === 'completed' ? 'TODO' : 'COMPLETED';
    const { error } = await (supabase.from('tasks') as any)
      .update({
        status: nextStatus as any,
        completed_at: nextStatus === 'COMPLETED' ? new Date().toISOString() : null,
      })
      .eq('id', taskId);

    if (error) {
      logger.error('Supabase toggleTaskStatus error:', error);
      return false;
    }
    return true;
  }

  // PROJECTS API
  async getProjects(workspaceId: string): Promise<Project[]> {
    const { data, error } = await (supabase.from('projects') as any)
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Supabase getProjects error:', error);
      return [];
    }

    return (data || []).map((p: any): Project => ({
      id: p.id,
      name: p.title,
      description: p.description || '',
      hubId: p.hub_id || '',
      hubName: 'المحور الرئيسي',
      status: p.status === 'COMPLETED' ? 'completed' : 'in_progress',
      progress: p.progress,
      startDate: p.start_date ? p.start_date.split('T')[0] : '',
      endDate: p.due_date ? p.due_date.split('T')[0] : '',
      tasksCount: 0,
      completedTasksCount: 0,
      createdAt: p.created_at,
    }));
  }

  // HUBS API
  async getHubs(workspaceId: string): Promise<Hub[]> {
    const { data, error } = await (supabase.from('hubs') as any)
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('sort_order', { ascending: true });

    if (error) {
      logger.error('Supabase getHubs error:', error);
      return [];
    }

    return (data || []).map((h: any): Hub => ({
      id: h.id,
      name: h.title,
      description: h.description || '',
      color: h.color,
      icon: h.icon,
      projectCount: 0,
      taskCount: 0,
      goalCount: 0,
      createdAt: h.created_at,
    }));
  }

  // ============================================================================
  // CHECKLIST SYSTEM CRUD METHODS (v1.1)
  // ============================================================================

  /** Fetch all checklists and their items for a specific task */
  async getChecklists(taskId: string) {
    const { data, error } = await (supabase.from('checklists') as any)
      .select('*, checklist_items(*)')
      .eq('task_id', taskId)
      .order('sort_order', { ascending: true });

    if (error) {
      logger.error('Supabase getChecklists error:', error);
      return [];
    }

    return data || [];
  }

  /** Create a new checklist for a task */
  async createChecklist(taskId: string, title: string, sortOrder: number = 0) {
    const { data, error } = await (supabase.from('checklists') as any)
      .insert({
        task_id: taskId,
        title,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (error) {
      logger.error('Supabase createChecklist error:', error);
      return null;
    }

    return data;
  }

  /** Update checklist title */
  async updateChecklist(checklistId: string, title: string) {
    const { data, error } = await (supabase.from('checklists') as any)
      .update({ title })
      .eq('id', checklistId)
      .select()
      .single();

    if (error) {
      logger.error('Supabase updateChecklist error:', error);
      return null;
    }

    return data;
  }

  /** Delete a checklist */
  async deleteChecklist(checklistId: string): Promise<boolean> {
    const { error } = await (supabase.from('checklists') as any)
      .delete()
      .eq('id', checklistId);

    if (error) {
      logger.error('Supabase deleteChecklist error:', error);
      return false;
    }

    return true;
  }

  /** Create a checklist item inside a checklist */
  async createChecklistItem(checklistId: string, title: string, sortOrder: number = 0) {
    const { data, error } = await (supabase.from('checklist_items') as any)
      .insert({
        checklist_id: checklistId,
        title,
        sort_order: sortOrder,
        is_completed: false,
      })
      .select()
      .single();

    if (error) {
      logger.error('Supabase createChecklistItem error:', error);
      return null;
    }

    return data;
  }

  /** Toggle completion status of a checklist item */
  async toggleChecklistItem(itemId: string, isCompleted: boolean) {
    const { data, error } = await (supabase.from('checklist_items') as any)
      .update({ is_completed: isCompleted })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      logger.error('Supabase toggleChecklistItem error:', error);
      return null;
    }

    return data;
  }

  /** Delete a checklist item */
  async deleteChecklistItem(itemId: string): Promise<boolean> {
    const { error } = await (supabase.from('checklist_items') as any)
      .delete()
      .eq('id', itemId);

    if (error) {
      logger.error('Supabase deleteChecklistItem error:', error);
      return false;
    }

    return true;
  }
}

export const supabaseRepository = new SupabaseRepository();

