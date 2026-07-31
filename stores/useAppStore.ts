import { create } from 'zustand';
import { Task, Hub, Project, Assignment, Habit, Goal, HealthRecord } from '@/types';
import { supabaseRepository } from '@/repositories/supabaseRepository';
import { taskRepository } from '@/repositories/taskRepository';
import { logger } from '@/lib/logger';

interface AppState {
  // Sidebar Collapsed State
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

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
  addHub: (hub: Omit<Hub, 'id' | 'createdAt' | 'projectCount' | 'taskCount' | 'goalCount'>) => void;
  updateHub: (id: string, hub: Partial<Hub>) => void;
  deleteHub: (id: string) => void;

  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'completedTasksCount'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'bestStreak' | 'completedToday' | 'history'>) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitToday: (id: string) => void;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'status'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  healthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'createdAt'>) => void;
  updateHealthRecord: (id: string, record: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;
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

      const [fetchedTasks, fetchedProjects, fetchedHubs] = await Promise.all([
        taskRepository.getAll(resolvedWorkspaceId),
        supabaseRepository.getProjects(resolvedWorkspaceId),
        supabaseRepository.getHubs(resolvedWorkspaceId),
      ]);

      set({
        currentWorkspaceId: resolvedWorkspaceId,
        tasks: fetchedTasks,
        projects: fetchedProjects.length > 0 ? fetchedProjects : initialProjects,
        hubs: fetchedHubs.length > 0 ? fetchedHubs : initialHubs,
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
  addHub: (hub) =>
    set((state) => ({
      hubs: [
        {
          ...hub,
          id: `h-${Date.now()}`,
          projectCount: 0,
          taskCount: 0,
          goalCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        },
        ...state.hubs,
      ],
    })),
  updateHub: (id, updatedFields) =>
    set((state) => ({
      hubs: state.hubs.map((h) => (h.id === id ? { ...h, ...updatedFields } : h)),
    })),
  deleteHub: (id) => set((state) => ({ hubs: state.hubs.filter((h) => h.id !== id) })),

  projects: initialProjects,
  addProject: (project) =>
    set((state) => ({
      projects: [
        {
          ...project,
          id: `p-${Date.now()}`,
          completedTasksCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        },
        ...state.projects,
      ],
    })),
  updateProject: (id, updatedFields) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    })),
  deleteProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),

  assignments: initialAssignments,
  addAssignment: (assignment) =>
    set((state) => ({
      assignments: [
        {
          ...assignment,
          id: `a-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        },
        ...state.assignments,
      ],
    })),
  updateAssignment: (id, updatedFields) =>
    set((state) => ({
      assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...updatedFields } : a)),
    })),
  deleteAssignment: (id) =>
    set((state) => ({ assignments: state.assignments.filter((a) => a.id !== id) })),

  habits: initialHabits,
  addHabit: (habit) =>
    set((state) => ({
      habits: [
        {
          ...habit,
          id: `hab-${Date.now()}`,
          streak: 1,
          bestStreak: 1,
          completedToday: false,
          history: [],
          createdAt: new Date().toISOString().split('T')[0],
        },
        ...state.habits,
      ],
    })),
  updateHabit: (id, updatedFields) =>
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...updatedFields } : h)),
    })),
  deleteHabit: (id) =>
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
  toggleHabitToday: (id) =>
    set((state) => ({
      habits: state.habits.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completedToday;
          const nextStreak = nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          return {
            ...h,
            completedToday: nextCompleted,
            streak: nextStreak,
            bestStreak: Math.max(h.bestStreak, nextStreak),
          };
        }
        return h;
      }),
    })),

  goals: initialGoals,
  addGoal: (goal) =>
    set((state) => ({
      goals: [
        {
          ...goal,
          id: `g-${Date.now()}`,
          status: 'in_progress',
          createdAt: new Date().toISOString().split('T')[0],
        },
        ...state.goals,
      ],
    })),
  updateGoal: (id, updatedFields) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updatedFields } : g)),
    })),
  deleteGoal: (id) =>
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

  healthRecords: initialHealthRecords,
  addHealthRecord: (record) =>
    set((state) => ({
      healthRecords: [
        {
          ...record,
          id: `hr-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        },
        ...state.healthRecords,
      ],
    })),
  updateHealthRecord: (id, updatedFields) =>
    set((state) => ({
      healthRecords: state.healthRecords.map((hr) =>
        hr.id === id ? { ...hr, ...updatedFields } : hr
      ),
    })),
  deleteHealthRecord: (id) =>
    set((state) => ({ healthRecords: state.healthRecords.filter((hr) => hr.id !== id) })),
}));
