export const SITE_CONFIG = {
  name: "LifeOS",
  description: "منصة إدارة الإنتاجية الشخصية الشاملة والمصممة للتركيز وتحقيق الأهداف.",
  url: "https://lifeos.app",
  version: "1.0.0",
  author: "LifeOS Team",
  themeColor: "#003331",
  links: {
    github: "https://github.com/lifeos/lifeos",
    docs: "https://lifeos.app/docs",
  },
} as const;

export const APP_ROUTES = {
  PUBLIC: {
    LANDING: "/",
    LOGIN: "/login",
  },
  PROTECTED: {
    DASHBOARD: "/dashboard",
    TASKS: "/dashboard/tasks",
    HUBS: "/dashboard/hubs",
    PROJECTS: "/dashboard/projects",
    ASSIGNMENTS: "/dashboard/assignments",
    HABITS: "/dashboard/habits",
    GOALS: "/dashboard/goals",
    HEALTH: "/dashboard/health",
    SETTINGS: "/dashboard/settings",
  },
} as const;

export const NAVIGATION_ITEMS = [
  { label: "لوحة التحكم", href: APP_ROUTES.PROTECTED.DASHBOARD, icon: "LayoutDashboard" },
  { label: "المهام", href: APP_ROUTES.PROTECTED.TASKS, icon: "CheckCircle2" },
  { label: "المحاور", href: APP_ROUTES.PROTECTED.HUBS, icon: "Layers" },
  { label: "المشاريع", href: APP_ROUTES.PROTECTED.PROJECTS, icon: "FolderKanban" },
  { label: "التكليفات", href: APP_ROUTES.PROTECTED.ASSIGNMENTS, icon: "BookOpen" },
  { label: "العادات", href: APP_ROUTES.PROTECTED.HABITS, icon: "Repeat" },
  { label: "الأهداف", href: APP_ROUTES.PROTECTED.GOALS, icon: "Target" },
  { label: "الصحة", href: APP_ROUTES.PROTECTED.HEALTH, icon: "Activity" },
  { label: "الإعدادات", href: APP_ROUTES.PROTECTED.SETTINGS, icon: "Settings" },
] as const;

export const API_ENDPOINTS = {
  TASKS: "/api/tasks",
  HUBS: "/api/hubs",
  PROJECTS: "/api/projects",
  ASSIGNMENTS: "/api/assignments",
  HABITS: "/api/habits",
  GOALS: "/api/goals",
  HEALTH: "/api/health",
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "lifeos_auth_token",
  USER_PROFILE: "lifeos_user_profile",
  THEME_PREFERENCE: "lifeos_theme_mode",
  APP_STATE: "lifeos_state_v1",
} as const;
