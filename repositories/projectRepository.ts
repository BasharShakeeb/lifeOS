import { apiClient } from '@/services/apiClient';
import { logger } from '@/lib/logger';
import { Project } from '@/types';

export interface ProjectRepository {
  getAll(workspaceId?: string): Promise<Project[]>;
  create(project: Partial<Project>, workspaceId?: string): Promise<Project>;
  update(id: string, project: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<boolean>;
}

const toBackendPayload = (project: Partial<Project>): Record<string, any> => {
  const payload: Record<string, any> = {
    name: project.name,
    description: project.description ?? '',
    hubId: project.hubId || undefined,
    priority: (project as any).priority ?? 'medium',
    status: (project as any).status ?? 'in_progress',
    progress: typeof project.progress === 'number' ? project.progress : 0,
    color: (project as any).color ?? '#10b981',
    icon: (project as any).icon ?? 'rocket',
    startDate: (project as any).startDate ?? undefined,
    dueDate: (project as any).dueDate ?? project.endDate ?? undefined,
    isFavorite: Boolean((project as any).isFavorite),
    isArchived: Boolean((project as any).isArchived),
  };

  if (!payload.name) {
    delete payload.name;
  }

  return payload;
};

export class ProjectRepositoryImpl implements ProjectRepository {
  async getAll(workspaceId?: string): Promise<Project[]> {
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.get<Project[]>(`/api/projects${query}`);
    return res.data;
  }

  async create(project: Partial<Project>, workspaceId?: string): Promise<Project> {
    logger.info('ProjectRepository: Creating project via API', { title: project.name });
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.post<Project>(`/api/projects${query}`, toBackendPayload(project));
    return res.data;
  }

  async update(id: string, project: Partial<Project>): Promise<Project> {
    logger.info(`ProjectRepository: Updating project ${id} via API`);
    const res = await apiClient.patch<Project>(`/api/projects/${id}`, toBackendPayload(project));
    return res.data;
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`ProjectRepository: Deleting project ${id} via API`);
    await apiClient.delete<void>(`/api/projects/${id}`);
    return true;
  }
}

export const projectRepository = new ProjectRepositoryImpl();
