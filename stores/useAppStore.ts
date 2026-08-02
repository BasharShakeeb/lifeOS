import { create } from 'zustand';
import { Task, Hub, Project, Assignment, Habit, Goal, HealthRecord } from '@/types';
import { taskRepository } from '@/repositories/taskRepository';
import { projectRepository } from '@/repositories/projectRepository';
import { hubRepository } from '@/repositories/hubRepository';
import { assignmentRepository } from '@/repositories/assignmentRepository';
import { goalRepository } from '@/repositories/goalRepository';
import { habitRepository } from '@/repositories/habitRepository';
import { healthRecordRepository } from '@/repositories/healthRecordRepository';
import { logger } from '@/lib/logger';

interface AppState {
  // Sidebar Collapsed State (Desktop)
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Mobile Sidebar Drawer State
  isMobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;

  // Navigation & Search State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;

  // Drawer (Create / Edit) State
  activeDrawer: {
    isOpen: boolean;
    type: 'task' | 'hub' | 'project' | 'assignment' | 'habit' | 'goal' | 'health' | null;
    mode: 'create' | 'edit';
    initialData?: any;
  };
  openDrawer: (type: 'task' | 'hub' | 'project' | 'assignment' | 'habit' | 'goal' | 'health', mode?: 'create' | 'edit', data?: any) => void;
  closeDrawer: () => void;

  // Modal (Details / View) State
  activeModal: {
    isOpen: boolean;
    type: 'task' | 'hub' | 'project' | 'assignment' | 'habit' | 'goal' | 'health' | null;
    data?: any;
  };
  openModal: (type: 'task' | 'hub' | 'project' | 'assignment' | 'habit' | 'goal' | 'health', data: any) => void;
  closeModal: () => void;

  // Sync state with backend
  currentWorkspaceId: string | null;
  fetchInitialData: (workspaceId?: string) => Promise<void>;

  // Datasets & CRUD operations
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;

  hubs: Hub[];
  addHub: (hub: Omit<Hub, 'id' | 'createdAt' | 'projectCount' | 'taskCount' | 'goalCount'>) => Promise<void>;
  updateHub: (id: string, hub: Partial<Hub>) => Promise<void>;
  deleteHub: (id: string) => Promise<void>;

  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'completedTasksCount'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => Promise<void>;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;

  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'bestStreak' | 'completedToday' | 'history'>) => Promise<void>;
  updateHabit: (id: string, habit: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitToday: (id: string) => Promise<void>;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  healthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'createdAt'>) => Promise<void>;
  updateHealthRecord: (id: string, record: Partial<HealthRecord>) => Promise<void>;
  deleteHealthRecord: (id: string) => Promise<void>;
}

// Data collections start empty and are ready for backend integration.
// No mock data, fake statistics, or demo datasets are seeded here.
const initialTasks: Task[] = [];

const initialHubs: Hub[] = [];

const initialProjects: Project[] = [];

const initialAssignments: Assignment[] = [];

const initialHabits: Habit[] = [];

const initialGoals: Goal[] = [];

const initialHealthRecords: HealthRecord[] = [];

export const useAppStore = create<AppState>((set, get) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  isMobileSidebarOpen: false,
  openMobileSidebar: () => set({ isMobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  selectedFilter: 'all',
  setSelectedFilter: (filter: string) => set({ selectedFilter: filter }),

  activeDrawer: { isOpen: false, type: null, mode: 'create' },
  openDrawer: (type, mode = 'create', data) =>
    set({ activeDrawer: { isOpen: true, type, mode, initialData: data } }),
  closeDrawer: () => set((state) => ({ activeDrawer: { ...state.activeDrawer, isOpen: false } })),

  activeModal: { isOpen: false, type: null },
  openModal: (type, data) => set({ activeModal: { isOpen: true, type, data } }),
  closeModal: () => set((state) => ({ activeModal: { ...state.activeModal, isOpen: false } })),

  currentWorkspaceId: null,

  fetchInitialData: async (workspaceId) => {
    try {
      // Resolve the real workspace id from the backend when not provided.
      let resolvedWorkspaceId = workspaceId ?? get().currentWorkspaceId;
      if (!resolvedWorkspaceId) {
        const me = await taskRepository.getMe();
        resolvedWorkspaceId = me.defaultWorkspaceId;
      }
      if (!resolvedWorkspaceId) {
        logger.warn('No workspace found for current user; skipping initial load.');
        return;
      }

      const [fetchedTasks, fetchedProjects, fetchedHubs, fetchedAssignments, fetchedGoals, fetchedHabits, fetchedHealthRecords] = await Promise.all([
        taskRepository.getAll(resolvedWorkspaceId),
        projectRepository.getAll(resolvedWorkspaceId),
        hubRepository.getAll(resolvedWorkspaceId),
        assignmentRepository.getAll(resolvedWorkspaceId),
        goalRepository.getAll(resolvedWorkspaceId),
        habitRepository.getAll(resolvedWorkspaceId),
        healthRecordRepository.getAll(resolvedWorkspaceId),
      ]);

      set({
        currentWorkspaceId: resolvedWorkspaceId,
        tasks: fetchedTasks,
        projects: fetchedProjects.length > 0 ? fetchedProjects : initialProjects,
        hubs: fetchedHubs.length > 0 ? fetchedHubs : initialHubs,
        assignments: fetchedAssignments.length > 0 ? fetchedAssignments : initialAssignments,
        goals: fetchedGoals.length > 0 ? fetchedGoals : initialGoals,
        habits: fetchedHabits.length > 0 ? fetchedHabits : initialHabits,
        healthRecords: fetchedHealthRecords.length > 0 ? fetchedHealthRecords : initialHealthRecords,
      });
    } catch (error) {
      logger.error('fetchInitialData failed:', error);
    }
  },

  tasks: initialTasks,
  addTask: async (task) => {
    const created = await taskRepository.create(task, get().currentWorkspaceId ?? undefined);
    set((state) => ({ tasks: [created, ...state.tasks] }));
  },
  updateTask: async (id, updatedFields) => {
    const updated = await taskRepository.update(id, updatedFields);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },
  deleteTask: async (id) => {
    await taskRepository.delete(id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },
  toggleTaskCompletion: async (id) => {
    const updated = await taskRepository.toggle(id);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },

  hubs: initialHubs,
  addHub: async (hub) => {
    const created = await hubRepository.create(hub, get().currentWorkspaceId ?? undefined);
    set((state) => ({ hubs: [created, ...state.hubs] }));
  },
  updateHub: async (id, updatedFields) => {
    const updated = await hubRepository.update(id, updatedFields);
    set((state) => ({
      hubs: state.hubs.map((h) => (h.id === id ? updated : h)),
    }));
  },
  deleteHub: async (id) => {
    await hubRepository.delete(id);
    set((state) => ({ hubs: state.hubs.filter((h) => h.id !== id) }));
  },

  projects: initialProjects,
  addProject: async (project) => {
    const created = await projectRepository.create(project, get().currentWorkspaceId ?? undefined);
    set((state) => ({ projects: [created, ...state.projects] }));
  },
  updateProject: async (id, updatedFields) => {
    const updated = await projectRepository.update(id, updatedFields);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
    }));
  },
  deleteProject: async (id) => {
    await projectRepository.delete(id);
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
  },

  assignments: initialAssignments,
  addAssignment: async (assignment) => {
    const created = await assignmentRepository.create(assignment, get().currentWorkspaceId ?? undefined);
    set((state) => ({ assignments: [created, ...state.assignments] }));
  },
  updateAssignment: async (id, updatedFields) => {
    const updated = await assignmentRepository.update(id, updatedFields);
    set((state) => ({
      assignments: state.assignments.map((a) => (a.id === id ? updated : a)),
    }));
  },
  deleteAssignment: async (id) => {
    await assignmentRepository.delete(id);
    set((state) => ({ assignments: state.assignments.filter((a) => a.id !== id) }));
  },

  habits: initialHabits,
  addHabit: async (habit) => {
    const created = await habitRepository.create(habit, get().currentWorkspaceId ?? undefined);
    set((state) => ({ habits: [created, ...state.habits] }));
  },
  updateHabit: async (id, updatedFields) => {
    const updated = await habitRepository.update(id, updatedFields);
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? updated : h)),
    }));
  },
  deleteHabit: async (id) => {
    await habitRepository.delete(id);
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
  },
  toggleHabitToday: async (id) => {
    const current = get().habits.find((h) => h.id === id);
    if (!current) return;
    const nextCompleted = !current.completedToday;
    const nextStreak = nextCompleted ? current.streak + 1 : Math.max(0, current.streak - 1);
    const updated = await habitRepository.update(id, {
      streak: nextStreak,
      bestStreak: Math.max(current.bestStreak, nextStreak),
      completedToday: nextCompleted,
      lastCompleted: nextCompleted ? new Date().toISOString().split('T')[0] : current.lastCompleted,
    });
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? updated : h)),
    }));
  },

  goals: initialGoals,
  addGoal: async (goal) => {
    const created = await goalRepository.create(goal, get().currentWorkspaceId ?? undefined);
    set((state) => ({ goals: [created, ...state.goals] }));
  },
  updateGoal: async (id, updatedFields) => {
    const updated = await goalRepository.update(id, updatedFields);
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? updated : g)),
    }));
  },
  deleteGoal: async (id) => {
    await goalRepository.delete(id);
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
  },

  healthRecords: initialHealthRecords,
  addHealthRecord: async (record) => {
    const created = await healthRecordRepository.create(record, get().currentWorkspaceId ?? undefined);
    set((state) => ({ healthRecords: [created, ...state.healthRecords] }));
  },
  updateHealthRecord: async (id, updatedFields) => {
    const updated = await healthRecordRepository.update(id, updatedFields);
    set((state) => ({
      healthRecords: state.healthRecords.map((hr) => (hr.id === id ? updated : hr)),
    }));
  },
  deleteHealthRecord: async (id) => {
    await healthRecordRepository.delete(id);
    set((state) => ({ healthRecords: state.healthRecords.filter((hr) => hr.id !== id) }));
  },
}));
