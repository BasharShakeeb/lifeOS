import { apiClient } from '@/services/apiClient';
import { logger } from '@/lib/logger';
import { Assignment } from '@/types';

export interface AssignmentRepository {
  getAll(workspaceId?: string): Promise<Assignment[]>;
  create(assignment: Partial<Assignment>, workspaceId?: string): Promise<Assignment>;
  update(id: string, assignment: Partial<Assignment>): Promise<Assignment>;
  delete(id: string): Promise<boolean>;
}

const toBackendPayload = (assignment: Partial<Assignment>): Record<string, any> => {
  const payload: Record<string, any> = {};
  if (assignment.title !== undefined) payload.title = assignment.title;
  if (assignment.subject !== undefined) payload.subject = assignment.subject;
  if (assignment.notes !== undefined) payload.description = assignment.notes;
  if (assignment.priority !== undefined) payload.priority = assignment.priority;
  if (assignment.status !== undefined) payload.status = assignment.status;
  if (assignment.dueDate !== undefined) payload.dueDate = assignment.dueDate;
  if (assignment.grade !== undefined) payload.grade = assignment.grade;
  return payload;
};

const fromBackend = (a: any): Assignment => ({
  id: a.id,
  title: a.title,
  subject: a.subject || '',
  dueDate: a.dueDate || '',
  priority: a.priority || 'medium',
  status: a.status || 'pending',
  grade: a.grade,
  notes: a.description || '',
  createdAt: a.createdAt,
});

export class AssignmentRepositoryImpl implements AssignmentRepository {
  async getAll(workspaceId?: string): Promise<Assignment[]> {
    logger.debug('AssignmentRepository: Fetching assignments from API');
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.get<Assignment[]>(`/api/assignments${query}`);
    return (res.data || []).map(fromBackend);
  }

  async create(assignment: Partial<Assignment>, workspaceId?: string): Promise<Assignment> {
    logger.info('AssignmentRepository: Creating assignment via API', { title: assignment.title });
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.post<Assignment>(`/api/assignments${query}`, toBackendPayload(assignment));
    return fromBackend(res.data);
  }

  async update(id: string, assignment: Partial<Assignment>): Promise<Assignment> {
    logger.info(`AssignmentRepository: Updating assignment ${id} via API`);
    const res = await apiClient.patch<Assignment>(`/api/assignments/${id}`, toBackendPayload(assignment));
    return fromBackend(res.data);
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`AssignmentRepository: Deleting assignment ${id} via API`);
    await apiClient.delete<void>(`/api/assignments/${id}`);
    return true;
  }
}

export const assignmentRepository = new AssignmentRepositoryImpl();

