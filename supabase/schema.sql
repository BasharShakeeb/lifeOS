-- ============================================================================
-- LifeOS Backend Architecture SQL Schema (v1.0)
-- Target Database: PostgreSQL (Optimized for Supabase & RLS)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

CREATE TYPE status_enum AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'REVIEW',
    'COMPLETED',
    'CANCELLED',
    'ARCHIVED'
);

CREATE TYPE priority_enum AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);

CREATE TYPE repeat_enum AS ENUM (
    'NONE',
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'YEARLY',
    'CUSTOM'
);

CREATE TYPE goal_type_enum AS ENUM (
    'NUMBER',
    'BOOLEAN',
    'PERCENTAGE',
    'TIME',
    'MONEY'
);

CREATE TYPE workspace_visibility_enum AS ENUM (
    'PRIVATE',
    'TEAM',
    'PUBLIC'
);

CREATE TYPE notification_type_enum AS ENUM (
    'EMAIL',
    'PUSH',
    'IN_APP'
);

CREATE TYPE entity_type_enum AS ENUM (
    'TASK',
    'PROJECT',
    'GOAL',
    'HABIT',
    'ASSIGNMENT',
    'HUB',
    'WORKSPACE'
);

-- ============================================================================
-- 2. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Automatically update completed_at for checklist items
CREATE OR REPLACE FUNCTION update_checklist_item_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        NEW.completed_at = NOW();
    ELSIF NEW.is_completed = FALSE AND OLD.is_completed = TRUE THEN
        NEW.completed_at = NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. CORE TABLES
-- ============================================================================

-- PROFILES (Synced with Supabase Auth users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'ar',
    theme TEXT DEFAULT 'system',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- WORKSPACES
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    color TEXT DEFAULT '#006c49',
    visibility workspace_visibility_enum NOT NULL DEFAULT 'PRIVATE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- USER SETTINGS
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    default_workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    daily_digest BOOLEAN DEFAULT TRUE,
    compact_mode BOOLEAN DEFAULT FALSE,
    custom_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HUBS
CREATE TABLE public.hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#006c49',
    icon TEXT DEFAULT 'grid_view',
    cover_image TEXT,
    sort_order INT DEFAULT 0,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    icon TEXT DEFAULT 'folder',
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. PRODUCTIVITY TABLES
-- ============================================================================

-- PROJECTS
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES public.hubs(id) ON DELETE SET NULL,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status status_enum NOT NULL DEFAULT 'IN_PROGRESS',
    priority priority_enum NOT NULL DEFAULT 'MEDIUM',
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    color TEXT DEFAULT '#10b981',
    icon TEXT DEFAULT 'rocket',
    start_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TASKS
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES public.hubs(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status status_enum NOT NULL DEFAULT 'TODO',
    priority priority_enum NOT NULL DEFAULT 'MEDIUM',
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    estimated_hours NUMERIC(6,2) DEFAULT 0.0,
    actual_hours NUMERIC(6,2) DEFAULT 0.0,
    repeat_type repeat_enum NOT NULL DEFAULT 'NONE',
    reminder_at TIMESTAMPTZ,
    color TEXT,
    icon TEXT DEFAULT 'task_alt',
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ASSIGNMENTS
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES public.hubs(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    course TEXT,
    subject TEXT,
    teacher TEXT,
    title TEXT NOT NULL,
    description TEXT,
    status status_enum NOT NULL DEFAULT 'TODO',
    priority priority_enum NOT NULL DEFAULT 'MEDIUM',
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    submission_url TEXT,
    grade TEXT,
    semester TEXT,
    start_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GOALS
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES public.hubs(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    goal_type goal_type_enum NOT NULL DEFAULT 'PERCENTAGE',
    target_value NUMERIC(12,2) NOT NULL DEFAULT 100.00,
    current_value NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    measurement_unit TEXT DEFAULT '%',
    status status_enum NOT NULL DEFAULT 'IN_PROGRESS',
    priority priority_enum NOT NULL DEFAULT 'MEDIUM',
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HABITS
CREATE TABLE public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES public.hubs(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    frequency repeat_enum NOT NULL DEFAULT 'DAILY',
    target_per_day INT NOT NULL DEFAULT 1,
    target_per_week INT NOT NULL DEFAULT 7,
    current_streak INT NOT NULL DEFAULT 0,
    best_streak INT NOT NULL DEFAULT 0,
    last_completed TIMESTAMPTZ,
    status status_enum NOT NULL DEFAULT 'IN_PROGRESS',
    color TEXT DEFAULT '#10b981',
    icon TEXT DEFAULT 'flame',
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HEALTH RECORDS
CREATE TABLE public.health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL,
    value NUMERIC(10,2) NOT NULL,
    unit TEXT NOT NULL,
    record_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. SHARED TABLES
-- ============================================================================

-- TAGS
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#6b7280',
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_workspace_tag UNIQUE(workspace_id, name)
);

-- ENTITY TAGS (Polymorphic tag association)
CREATE TABLE public.entity_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type entity_type_enum NOT NULL,
    entity_id UUID NOT NULL,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    CONSTRAINT uq_entity_tag UNIQUE(entity_type, entity_id, tag_id)
);

-- COMMENTS
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type entity_type_enum NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ATTACHMENTS
CREATE TABLE public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type entity_type_enum NOT NULL,
    entity_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type TEXT,
    file_size BIGINT,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- REMINDERS
CREATE TABLE public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type entity_type_enum NOT NULL,
    entity_id UUID NOT NULL,
    remind_at TIMESTAMPTZ NOT NULL,
    notification_type notification_type_enum NOT NULL DEFAULT 'IN_APP',
    is_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type_enum NOT NULL DEFAULT 'IN_APP',
    entity_type entity_type_enum,
    entity_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ACTIVITY LOGS
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type entity_type_enum NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SYSTEM AUDIT LOGS
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_profiles_auth_user ON public.profiles(auth_user_id);
CREATE INDEX idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX idx_hubs_workspace ON public.hubs(workspace_id);
CREATE INDEX idx_categories_workspace ON public.categories(workspace_id);
CREATE INDEX idx_projects_workspace ON public.projects(workspace_id);
CREATE INDEX idx_projects_hub ON public.projects(hub_id);
CREATE INDEX idx_tasks_workspace ON public.tasks(workspace_id);
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_hub ON public.tasks(hub_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_assignments_workspace ON public.assignments(workspace_id);
CREATE INDEX idx_goals_workspace ON public.goals(workspace_id);
CREATE INDEX idx_habits_workspace ON public.habits(workspace_id);
CREATE INDEX idx_health_records_user ON public.health_records(user_id, record_date);
CREATE INDEX idx_entity_tags_lookup ON public.entity_tags(entity_type, entity_id);
CREATE INDEX idx_comments_lookup ON public.comments(entity_type, entity_id);
CREATE INDEX idx_attachments_lookup ON public.attachments(entity_type, entity_id);
CREATE INDEX idx_reminders_pending ON public.reminders(remind_at) WHERE is_sent = FALSE;
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);

-- ============================================================================
-- 7. TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_workspaces_updated_at BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_hubs_updated_at BEFORE UPDATE ON public.hubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER (ON AUTH SIGNUP)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_profile_id UUID;
    new_workspace_id UUID;
BEGIN
    -- 1. Create Profile for new User
    INSERT INTO public.profiles (auth_user_id, full_name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url'
    )
    RETURNING id INTO new_profile_id;

    -- 2. Create Default Workspace for Profile
    INSERT INTO public.workspaces (owner_id, name, description)
    VALUES (new_profile_id, 'مساحة العمل الشخصية', 'المساحة الرئيسية لإدارة المهام والأهداف')
    RETURNING id INTO new_workspace_id;

    -- 3. Create User Settings
    INSERT INTO public.user_settings (user_id, default_workspace_id)
    VALUES (new_profile_id, new_workspace_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current profile ID
CREATE OR REPLACE FUNCTION current_profile_id()
RETURNS UUID AS $$
    SELECT id FROM public.profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- PROFILES Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth_user_id = auth.uid());

-- WORKSPACES Policies
CREATE POLICY "Owners can access their workspaces" ON public.workspaces
    FOR ALL USING (owner_id = current_profile_id());

-- USER SETTINGS Policies
CREATE POLICY "Users access own settings" ON public.user_settings
    FOR ALL USING (user_id = current_profile_id());

-- HUBS Policies
CREATE POLICY "Workspace users access hubs" ON public.hubs
    FOR ALL USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = current_profile_id()));

-- CATEGORIES Policies
CREATE POLICY "Workspace users access categories" ON public.categories
    FOR ALL USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = current_profile_id()));

-- PROJECTS Policies
CREATE POLICY "Workspace users access projects" ON public.projects
    FOR ALL USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = current_profile_id()));

-- TASKS Policies
CREATE POLICY "Workspace users access tasks" ON public.tasks
    FOR ALL USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = current_profile_id()));

-- ASSIGNMENTS Policies
CREATE POLICY "Workspace users access assignments" ON public.assignments
    FOR ALL USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = current_profile_id()));

-- GOALS Policies
CREATE POLICY "Workspace users access goals" ON public.goals
    FOR ALL USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = current_profile_id()));

-- HABITS Policies
CREATE POLICY "Workspace users access habits" ON public.habits
    FOR ALL USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = current_profile_id()));

-- HEALTH RECORDS Policies
CREATE POLICY "Users access health records" ON public.health_records
    FOR ALL USING (user_id = current_profile_id());

-- TAGS Policies
CREATE POLICY "Workspace users access tags" ON public.tags
    FOR ALL USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = current_profile_id()));

-- NOTIFICATIONS Policies
CREATE POLICY "Users access own notifications" ON public.notifications
    FOR ALL USING (user_id = current_profile_id());

-- ============================================================================
-- 10. ENHANCEMENT (v1.1): CHECKLIST SYSTEM & ADDITIONAL CONSTRAINTS
-- ============================================================================

-- CHECKLISTS TABLE
CREATE TABLE public.checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sort_order INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CHECKLIST ITEMS TABLE
CREATE TABLE public.checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TRIGGERS FOR CHECKLISTS UPDATED_AT
CREATE TRIGGER trg_checklists_updated_at BEFORE UPDATE ON public.checklists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_checklist_items_updated_at BEFORE UPDATE ON public.checklist_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_checklist_items_completed_at
BEFORE UPDATE ON public.checklist_items
FOR EACH ROW
EXECUTE FUNCTION update_checklist_item_completed_at();


-- ADDITIONAL DATA INTEGRITY CHECK CONSTRAINTS
ALTER TABLE public.tasks ADD CONSTRAINT chk_tasks_estimated_hours CHECK (estimated_hours >= 0);
ALTER TABLE public.tasks ADD CONSTRAINT chk_tasks_actual_hours CHECK (actual_hours >= 0);
ALTER TABLE public.goals ADD CONSTRAINT chk_goals_target_value CHECK (target_value >= 0);
ALTER TABLE public.goals ADD CONSTRAINT chk_goals_current_value CHECK (current_value >= 0);
ALTER TABLE public.habits ADD CONSTRAINT chk_habits_target_per_day CHECK (target_per_day >= 0);
ALTER TABLE public.habits ADD CONSTRAINT chk_habits_target_per_week CHECK (target_per_week >= 0);
ALTER TABLE public.habits ADD CONSTRAINT chk_habits_current_streak CHECK (current_streak >= 0);
ALTER TABLE public.habits ADD CONSTRAINT chk_habits_best_streak CHECK (best_streak >= 0);
ALTER TABLE public.health_records ADD CONSTRAINT chk_health_records_value CHECK (value >= 0);

-- INDEXES FOR CHECKLIST SYSTEM
CREATE INDEX idx_checklists_task_id ON public.checklists(task_id);
CREATE INDEX idx_checklist_items_checklist_id ON public.checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_completed ON public.checklist_items(is_completed);

-- RLS FOR CHECKLIST TABLES
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace users access checklists" ON public.checklists
    FOR ALL USING (task_id IN (
        SELECT id FROM public.tasks WHERE workspace_id IN (
            SELECT id FROM public.workspaces WHERE owner_id = current_profile_id()
        )
    ));

CREATE POLICY "Workspace users access checklist_items" ON public.checklist_items
    FOR ALL USING (checklist_id IN (
        SELECT id FROM public.checklists WHERE task_id IN (
            SELECT id FROM public.tasks WHERE workspace_id IN (
                SELECT id FROM public.workspaces WHERE owner_id = current_profile_id()
            )
        )
    ));

