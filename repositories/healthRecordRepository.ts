import { apiClient } from '@/services/apiClient';
import { logger } from '@/lib/logger';
import { HealthRecord } from '@/types';

export interface HealthRecordRepository {
  getAll(workspaceId?: string): Promise<HealthRecord[]>;
  create(record: Partial<HealthRecord>, workspaceId?: string): Promise<HealthRecord>;
  update(id: string, record: Partial<HealthRecord>): Promise<HealthRecord>;
  delete(id: string): Promise<boolean>;
}

const toBackendPayload = (record: Partial<HealthRecord>): Record<string, any> => {
  const payload: Record<string, any> = {};
  if (record.date !== undefined) payload.date = record.date;
  if (record.waterIntakeMl !== undefined) payload.waterIntakeMl = record.waterIntakeMl;
  if (record.sleepHours !== undefined) payload.sleepHours = record.sleepHours;
  if (record.exerciseMinutes !== undefined) payload.exerciseMinutes = record.exerciseMinutes;
  if (record.weightKg !== undefined) payload.weightKg = record.weightKg;
  if (record.bloodPressure !== undefined) payload.bloodPressure = record.bloodPressure;
  if (record.caloriesBurned !== undefined) payload.caloriesBurned = record.caloriesBurned;
  if (record.notes !== undefined) payload.notes = record.notes;
  return payload;
};

const fromBackend = (r: any): HealthRecord => ({
  id: r.id,
  date: r.date,
  waterIntakeMl: r.waterIntakeMl || 0,
  sleepHours: r.sleepHours || 0,
  exerciseMinutes: r.exerciseMinutes || 0,
  weightKg: r.weightKg,
  bloodPressure: r.bloodPressure,
  caloriesBurned: r.caloriesBurned,
  notes: r.notes,
  createdAt: r.createdAt,
});

export class HealthRecordRepositoryImpl implements HealthRecordRepository {
  async getAll(workspaceId?: string): Promise<HealthRecord[]> {
    logger.debug('HealthRecordRepository: Fetching health records from API');
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.get<HealthRecord[]>(`/api/health-records${query}`);
    return (res.data || []).map(fromBackend);
  }

  async create(record: Partial<HealthRecord>, workspaceId?: string): Promise<HealthRecord> {
    logger.info('HealthRecordRepository: Creating health record via API', { date: record.date });
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    const res = await apiClient.post<HealthRecord>(`/api/health-records${query}`, toBackendPayload(record));
    return fromBackend(res.data);
  }

  async update(id: string, record: Partial<HealthRecord>): Promise<HealthRecord> {
    logger.info(`HealthRecordRepository: Updating health record ${id} via API`);
    const res = await apiClient.patch<HealthRecord>(`/api/health-records/${id}`, toBackendPayload(record));
    return fromBackend(res.data);
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`HealthRecordRepository: Deleting health record ${id} via API`);
    await apiClient.delete<void>(`/api/health-records/${id}`);
    return true;
  }
}

export const healthRecordRepository = new HealthRecordRepositoryImpl();

