import { apiClient } from '@/services/apiClient';
import { logger } from '@/lib/logger';
import { Goal } from '@/types';

export interface GoalRepository {
  getAll(workspaceId?: string): Promise<Goal[]>;
  create(goal: Partial<Goal>, workspaceId?: string): Promise<Goal>;
  update(id: string, goal: Partial<Goal>): Promise<Goal>;
  delete(id: string): Promise<boolean>;
}

const toBackendPayload = (goal: Partial<Goal>): Record<string, any> => {
  const payload: Record<string, any> = {};
  if (goal.title !== undefined) payload.title = goal.title;
  if (goal.category !== undefined) payload.description = goal.category;
  if (goal.hubId !== undefined) payload.hubId = goal.hubId;
  if (goal.status !== undefined) payload.status = goal.status;
  if (goal.progress !== undefined) payload.progress = goal.progress;
  if (goal.targetDate !== undefined) payload.dueDate = goal.targetDate;
  return payload;
};

const fromBackend = (g: any): Goal => ({
  id: g.id,
  title: g.title,
  category: g.description || '',
  targetDate: g.dueDate || '',
  progress: g.progress || 0,
  hubId: g.hubId,
  milestones: [],
  status: g.status || 'in_progress',
  createdAt: g.createdAt,
});

export class GoalRepositoryImpl implements GoalRepository {
  async getAll(workspaceId?: string): Promise<Goal[]> {
    logger.debug('GoalRepository: Fetching goals from API');
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.get<Goal[]>(`/api/goals${query}`);
    return (res.data || []).map(fromBackend);
  }

  async create(goal: Partial<Goal>, workspaceId?: string): Promise<Goal> {
    logger.info('GoalRepository: Creating goal via API', { title: goal.title });
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.post<Goal>(`/api/goals${query}`, toBackendPayload(goal));
    return fromBackend(res.data);
  }

  async update(id: string, goal: Partial<Goal>): Promise<Goal> {
    logger.info(`GoalRepository: Updating goal ${id} via API`);
    const res = await apiClient.patch<Goal>(`/api/goals/${id}`, toBackendPayload(goal));
    return fromBackend(res.data);
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`GoalRepository: Deleting goal ${id} via API`);
    await apiClient.delete<void>(`/api/goals/${id}`);
    return true;
  }
}

export const goalRepository = new GoalRepositoryImpl();

