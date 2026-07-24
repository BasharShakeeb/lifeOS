import { Task } from "@/types";
import { useAppStore } from "@/stores/useAppStore";
import { logger } from "@/lib/logger";

export interface ITaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | undefined>;
  create(task: Omit<Task, "id" | "createdAt">): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<boolean>;
}

export class TaskRepository implements ITaskRepository {
  async getAll(): Promise<Task[]> {
    logger.debug("TaskRepository: Fetching all tasks");
    return useAppStore.getState().tasks;
  }

  async getById(id: string): Promise<Task | undefined> {
    return useAppStore.getState().tasks.find((t: Task) => t.id === id);
  }

  async create(taskData: Omit<Task, "id" | "createdAt">): Promise<Task> {
    logger.info("TaskRepository: Creating new task", { title: taskData.title });
    const store = useAppStore.getState();
    store.addTask(taskData);
    return store.tasks[0];
  }

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    logger.info(`TaskRepository: Updating task ${id}`);
    const store = useAppStore.getState();
    store.updateTask(id, taskData);
    return store.tasks.find((t: Task) => t.id === id)!;
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`TaskRepository: Deleting task ${id}`);
    useAppStore.getState().deleteTask(id);
    return true;
  }
}

export const taskRepository = new TaskRepository();
