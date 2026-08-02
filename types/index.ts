export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'overdue';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  hubId?: string;
  projectId?: string;
  tags: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  createdAt: string;
}

export interface Hub {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  projectCount: number;
  taskCount: number;
  goalCount: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  hubId: string;
  hubName: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  progress: number;
  startDate: string;
  endDate: string;
  tasksCount: number;
  completedTasksCount: number;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  status: 'pending' | 'in_progress' | 'submitted' | 'graded';
  grade?: string;
  notes?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'custom';
  streak: number;
  bestStreak: number;
  completedToday: boolean;
  history: { date: string; completed: boolean }[];
  lastCompleted?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  targetDate: string;
  progress: number; // 0 to 100
  hubId?: string;
  milestones: { id: string; title: string; completed: boolean }[];
  status: 'not_started' | 'in_progress' | 'achieved';
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  waterIntakeMl: number; // e.g. 2500
  sleepHours: number; // e.g. 7.5
  exerciseMinutes: number; // e.g. 45
  weightKg?: number;
  bloodPressure?: string;
  caloriesBurned?: number;
  notes?: string;
  createdAt: string;
}

export interface StatCardData {
  id: string;
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconName: string;
  subtitle?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  theme: 'dark' | 'light';
}
