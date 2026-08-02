import { apiClient } from '@/services/apiClient';
import { logger } from '@/lib/logger';
import { Hub } from '@/types';

export interface HubRepository {
  getAll(workspaceId?: string): Promise<Hub[]>;
  create(hub: Partial<Hub>, workspaceId?: string): Promise<Hub>;
  update(id: string, hub: Partial<Hub>): Promise<Hub>;
  delete(id: string): Promise<boolean>;
}

const toBackendPayload = (hub: Partial<Hub>): Record<string, any> => {
  const payload: Record<string, any> = {};
  if (hub.name !== undefined) payload.name = hub.name;
  if (hub.description !== undefined) payload.description = hub.description;
  if ((hub as any).color !== undefined) payload.color = (hub as any).color;
  if ((hub as any).icon !== undefined) payload.icon = (hub as any).icon;
  return payload;
};

const fromBackend = (hub: any): Hub => ({
  id: hub.id,
  name: hub.name,
  description: hub.description || '',
  icon: hub.icon || 'grid_view',
  color: hub.color || '#006c49',
  projectCount: 0,
  taskCount: 0,
  goalCount: 0,
  createdAt: hub.createdAt,
});

export class HubRepositoryImpl implements HubRepository {
  async getAll(workspaceId?: string): Promise<Hub[]> {
    logger.debug('HubRepository: Fetching hubs from API');
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.get<Hub[]>(`/api/hubs${query}`);
    return (res.data || []).map(fromBackend);
  }

  async create(hub: Partial<Hub>, workspaceId?: string): Promise<Hub> {
    logger.info('HubRepository: Creating hub via API', { name: hub.name });
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.post<Hub>(`/api/hubs${query}`, toBackendPayload(hub));
    return fromBackend(res.data);
  }

  async update(id: string, hub: Partial<Hub>): Promise<Hub> {
    logger.info(`HubRepository: Updating hub ${id} via API`);
    const res = await apiClient.patch<Hub>(`/api/hubs/${id}`, toBackendPayload(hub));
    return fromBackend(res.data);
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`HubRepository: Deleting hub ${id} via API`);
    await apiClient.delete<void>(`/api/hubs/${id}`);
    return true;
  }
}

export const hubRepository = new HubRepositoryImpl();

