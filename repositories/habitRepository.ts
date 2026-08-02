import { apiClient } from '@/services/apiClient';
import { logger } from '@/lib/logger';
import { Habit } from '@/types';

export interface HabitRepository {
  getAll(workspaceId?: string): Promise<Habit[]>;
  create(habit: Partial<Habit>, workspaceId?: string): Promise<Habit>;
  update(id: string, habit: Partial<Habit>): Promise<Habit>;
  delete(id: string): Promise<boolean>;
}

const toBackendPayload = (habit: Partial<Habit>): Record<string, any> => {
  const payload: Record<string, any> = {};
  if (habit.title !== undefined) payload.title = habit.title;
  if (habit.category !== undefined) payload.description = habit.category;
  if (habit.frequency !== undefined) payload.frequency = habit.frequency;
  if (habit.streak !== undefined) payload.currentStreak = habit.streak;
  if (habit.bestStreak !== undefined) payload.bestStreak = habit.bestStreak;
  if (habit.lastCompleted !== undefined) payload.lastCompleted = habit.lastCompleted;
  return payload;
};

const fromBackend = (h: any): Habit => {
  const lastCompleted = h.lastCompleted ? h.lastCompleted.split('T')[0] : '';
  const today = new Date().toISOString().split('T')[0];
  return {
    id: h.id,
    title: h.title,
    category: h.description || '',
    frequency: h.frequency || 'daily',
    streak: h.currentStreak || 0,
    bestStreak: h.bestStreak || 0,
    completedToday: lastCompleted === today,
    history: [],
    lastCompleted,
    createdAt: h.createdAt,
  };
};

export class HabitRepositoryImpl implements HabitRepository {
  async getAll(workspaceId?: string): Promise<Habit[]> {
    logger.debug('HabitRepository: Fetching habits from API');
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.get<Habit[]>(`/api/habits${query}`);
    return (res.data || []).map(fromBackend);
  }

  async create(habit: Partial<Habit>, workspaceId?: string): Promise<Habit> {
    logger.info('HabitRepository: Creating habit via API', { title: habit.title });
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.post<Habit>(`/api/habits${query}`, toBackendPayload(habit));
    return fromBackend(res.data);
  }

  async update(id: string, habit: Partial<Habit>): Promise<Habit> {
    logger.info(`HabitRepository: Updating habit ${id} via API`);
    const res = await apiClient.patch<Habit>(`/api/habits/${id}`, toBackendPayload(habit));
    return fromBackend(res.data);
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`HabitRepository: Deleting habit ${id} via API`);
    await apiClient.delete<void>(`/api/habits/${id}`);
    return true;
  }
}

export const habitRepository = new HabitRepositoryImpl();

