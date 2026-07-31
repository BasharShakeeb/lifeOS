import { Task } from "@/types";
import { apiClient } from "@/services/apiClient";
import { logger } from "@/lib/logger";

export interface MeResponse {
  profileId: string;
  fullName: string | null;
  email: string | null;
  defaultWorkspaceId: string | null;
}

export interface ITaskRepository {
  getMe(): Promise<MeResponse>;
  getAll(workspaceId?: string): Promise<Task[]>;
  create(task: Partial<Task>, workspaceId?: string): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<Task>;
  toggle(id: string): Promise<Task>;
  delete(id: string): Promise<boolean>;
}

/**
 * Task repository backed by the FastAPI backend.
 * The backend already returns tasks in the frontend `Task` shape
 * (camelCase fields, lowercase enums), so no client-side mapping is needed.
 */
export class TaskRepository implements ITaskRepository {
  async getMe(): Promise<MeResponse> {
    const res = await apiClient.get<MeResponse>("/api/me");
    return res.data;
  }

  async getAll(workspaceId?: string): Promise<Task[]> {
    logger.debug("TaskRepository: Fetching tasks from API");
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : "";
    const res = await apiClient.get<Task[]>(`/api/tasks${query}`);
    return res.data;
  }

  async create(task: Partial<Task>, workspaceId?: string): Promise<Task> {
    logger.info("TaskRepository: Creating task via API", { title: task.title });
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : "";
    const res = await apiClient.post<Task>(`/api/tasks${query}`, task);
    return res.data;
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    logger.info(`TaskRepository: Updating task ${id} via API`);
    const res = await apiClient.patch<Task>(`/api/tasks/${id}`, task);
    return res.data;
  }

  async toggle(id: string): Promise<Task> {
    logger.info(`TaskRepository: Toggling task ${id} via API`);
    const res = await apiClient.patch<Task>(`/api/tasks/${id}/toggle`);
    return res.data;
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`TaskRepository: Deleting task ${id} via API`);
    await apiClient.delete<void>(`/api/tasks/${id}`);
    return true;
  }
}

export const taskRepository = new TaskRepository();
