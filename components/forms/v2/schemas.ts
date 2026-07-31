import { z } from 'zod';
import { UniversalFormSchema } from './types';

// ─── 1. Task ───────────────────────────────────────────────────────────────
export const taskValidationSchema = z.object({
  title: z.string().min(1, 'عنوان المهمة مطلوب'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'تاريخ الاستحقاق مطلوب'),
  dueTime: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['not_started', 'in_progress', 'completed', 'paused', 'overdue']),
  projectId: z.string().optional(),
  hubId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  subtasks: z.array(z.object({ title: z.string(), isCompleted: z.boolean(), sortOrder: z.number() })).default([]),
  reminder: z.string().default('none'),
  repeat: z.string().default('none'),
  attachments: z.array(z.any()).default([]),
});

export const taskFormSchema: UniversalFormSchema = {
  id: 'task-schema',
  title: 'إضافة مهمة جديدة',
  subtitle: 'نظّم مهامك وحدد أولوياتك ومواعيدك بدقة عالية',
  validationSchema: taskValidationSchema,
  fields: [
    { name: 'title', label: 'عنوان المهمة *', type: 'text', placeholder: 'أدخل عنوان المهمة...', required: true, gridColSpan: 2, aiAssist: true },
    { name: 'description', label: 'الوصف والملاحظات', type: 'textarea', placeholder: 'أضف وصفاً تفصيلياً...', rows: 2, gridColSpan: 2, aiAssist: true },
    { name: 'projectId', label: 'المشروع', type: 'select', gridColSpan: 1, options: (ctx) => [{ value: '', label: 'بدون مشروع' }, ...(ctx?.projects || []).map((p: any) => ({ value: p.id, label: p.name }))] },
    { name: 'hubId', label: 'المركز', type: 'select', gridColSpan: 1, options: (ctx) => [{ value: '', label: 'بدون مركز' }, ...(ctx?.hubs || []).map((h: any) => ({ value: h.id, label: h.name }))] },
    { name: 'dueDate', label: 'تاريخ ووقت الاستحقاق', type: 'datetime', gridColSpan: 2 },
    { name: 'priority', label: 'الأولوية', type: 'priority', defaultValue: 'medium', gridColSpan: 2 },
    { name: 'status', label: 'حالة المهمة', type: 'select', defaultValue: 'not_started', gridColSpan: 2, options: [{ value: 'not_started', label: 'قيد الانتظار' }, { value: 'in_progress', label: 'قيد التنفيذ' }, { value: 'completed', label: 'مكتملة' }] },
    { name: 'tags', label: 'الوسوم', type: 'tags', gridColSpan: 2 },
    { name: 'subtasks', label: 'المهام الفرعية', type: 'subtasks', gridColSpan: 2 },
  ],
  advancedFields: [
    { name: 'reminder', label: 'التذكير', type: 'reminder', gridColSpan: 2 },
    { name: 'repeat', label: 'التكرار', type: 'repeat', gridColSpan: 2 },
    { name: 'attachments', label: 'المرفقات', type: 'file', gridColSpan: 2 },
  ],
};

// ─── 2. Hub ────────────────────────────────────────────────────────────────
export const hubValidationSchema = z.object({
  name: z.string().min(1, 'اسم المركز مطلوب'),
  description: z.string().optional(),
  color: z.string().default('#10B981'),
});

export const hubFormSchema: UniversalFormSchema = {
  id: 'hub-schema',
  title: 'إضافة مركز جديد',
  subtitle: 'أنشئ فئة رئيسية جديدة لربط مشاريعك وأهدافك بها',
  validationSchema: hubValidationSchema,
  fields: [
    { name: 'name', label: 'اسم المركز *', type: 'text', placeholder: 'مثال: هندسة البرمجيات، الصحة...', required: true, gridColSpan: 2, aiAssist: true },
    { name: 'description', label: 'الوصف', type: 'textarea', placeholder: 'أدخل وصفاً عاماً لأهداف هذا المركز...', rows: 2, gridColSpan: 2 },
  ],
};

// ─── 3. Project ────────────────────────────────────────────────────────────
export const projectValidationSchema = z.object({
  name: z.string().min(1, 'اسم المشروع مطلوب'),
  description: z.string().optional(),
  hubId: z.string().optional(),
  startDate: z.string().default(() => new Date().toISOString().split('T')[0]),
  endDate: z.string().optional(),
  status: z.enum(['planning', 'in_progress', 'completed', 'on_hold']).default('in_progress'),
});

export const projectFormSchema: UniversalFormSchema = {
  id: 'project-schema',
  title: 'إضافة مشروع جديد',
  subtitle: 'حدد هدف المشروع وجدوله الزمني ومجال عمله',
  validationSchema: projectValidationSchema,
  fields: [
    { name: 'name', label: 'اسم المشروع *', type: 'text', placeholder: 'أدخل اسم المشروع...', required: true, gridColSpan: 2, aiAssist: true },
    { name: 'description', label: 'وصف المشروع', type: 'textarea', placeholder: 'تفاصيل وأهداف المشروع...', rows: 2, gridColSpan: 2 },
    { name: 'hubId', label: 'المركز التابع له', type: 'select', gridColSpan: 2, options: (ctx) => [{ value: '', label: 'بدون مركز' }, ...(ctx?.hubs || []).map((h: any) => ({ value: h.id, label: h.name }))] },
    { name: 'endDate', label: 'تاريخ انتهاء المشروع', type: 'datetime', gridColSpan: 2 },
  ],
};

// ─── 4. Assignment ────────────────────────────────────────────────────────
export const assignmentValidationSchema = z.object({
  title: z.string().min(1, 'عنوان التكليف مطلوب'),
  subject: z.string().min(1, 'اسم المادة مطلوب'),
  dueDate: z.string().min(1, 'تاريخ التسليم مطلوب'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['pending', 'in_progress', 'submitted', 'graded']).default('pending'),
  notes: z.string().optional(),
});

export const assignmentFormSchema: UniversalFormSchema = {
  id: 'assignment-schema',
  title: 'إضافة تكليف جديد',
  subtitle: 'سجّل تكليفاتك الدراسية ومواعيد تسليمها وأولوياتها',
  validationSchema: assignmentValidationSchema,
  fields: [
    { name: 'title', label: 'عنوان التكليف *', type: 'text', placeholder: 'مثال: تقرير الفصل الدراسي الثاني...', required: true, gridColSpan: 2, aiAssist: true },
    { name: 'subject', label: 'المادة الدراسية *', type: 'text', placeholder: 'مثال: علم الحاسوب، رياضيات...', required: true, gridColSpan: 1 },
    { name: 'dueDate', label: 'موعد التسليم', type: 'datetime', gridColSpan: 1 },
    { name: 'priority', label: 'الأولوية', type: 'priority', defaultValue: 'medium', gridColSpan: 2 },
    { name: 'status', label: 'الحالة', type: 'select', defaultValue: 'pending', gridColSpan: 2, options: [{ value: 'pending', label: 'معلّق' }, { value: 'in_progress', label: 'قيد التنفيذ' }, { value: 'submitted', label: 'تم التسليم' }, { value: 'graded', label: 'تم التصحيح' }] },
    { name: 'notes', label: 'ملاحظات', type: 'textarea', placeholder: 'أي ملاحظات إضافية...', rows: 2, gridColSpan: 2 },
  ],
};

// ─── 5. Habit ─────────────────────────────────────────────────────────────
export const habitValidationSchema = z.object({
  title: z.string().min(1, 'عنوان العادة مطلوب'),
  category: z.string().min(1, 'التصنيف مطلوب'),
  frequency: z.enum(['daily', 'weekly', 'custom']).default('daily'),
});

export const habitFormSchema: UniversalFormSchema = {
  id: 'habit-schema',
  title: 'إضافة عادة جديدة',
  subtitle: 'ابنِ عادات يومية إيجابية تعزز إنتاجيتك وصحتك',
  validationSchema: habitValidationSchema,
  fields: [
    { name: 'title', label: 'اسم العادة *', type: 'text', placeholder: 'مثال: القراءة، التمرين، شرب الماء...', required: true, gridColSpan: 2, aiAssist: true },
    { name: 'category', label: 'التصنيف *', type: 'select', required: true, gridColSpan: 1, options: [{ value: 'الصحة', label: '🏃 الصحة' }, { value: 'الإنتاجية', label: '⚡ الإنتاجية' }, { value: 'التعلم', label: '📚 التعلم' }, { value: 'التدفق اليومي', label: '🌊 التدفق اليومي' }, { value: 'اللياقة البدنية', label: '💪 اللياقة البدنية' }, { value: 'التغذية', label: '🥗 التغذية' }, { value: 'أخرى', label: '✨ أخرى' }] },
    { name: 'frequency', label: 'التكرار', type: 'select', defaultValue: 'daily', gridColSpan: 1, options: [{ value: 'daily', label: '📅 يومي' }, { value: 'weekly', label: '📆 أسبوعي' }, { value: 'custom', label: '⚙️ مخصص' }] },
  ],
};

// ─── 6. Goal ──────────────────────────────────────────────────────────────
export const goalValidationSchema = z.object({
  title: z.string().min(1, 'عنوان الهدف مطلوب'),
  category: z.string().min(1, 'التصنيف مطلوب'),
  targetDate: z.string().min(1, 'تاريخ الهدف مطلوب'),
  hubId: z.string().optional(),
});

export const goalFormSchema: UniversalFormSchema = {
  id: 'goal-schema',
  title: 'إضافة هدف جديد',
  subtitle: 'حدد أهدافك الكبرى وتتبع تقدمك نحو إنجازها',
  validationSchema: goalValidationSchema,
  fields: [
    { name: 'title', label: 'عنوان الهدف *', type: 'text', placeholder: 'مثال: إتقان لغة برمجة جديدة، نشر تطبيق...', required: true, gridColSpan: 2, aiAssist: true },
    { name: 'category', label: 'التصنيف *', type: 'select', required: true, gridColSpan: 1, options: [{ value: 'مهني', label: '💼 مهني' }, { value: 'شخصي', label: '🌟 شخصي' }, { value: 'صحي', label: '🏃 صحي' }, { value: 'مالي', label: '💰 مالي' }, { value: 'تعليمي', label: '📚 تعليمي' }, { value: 'عام', label: '🎯 عام' }] },
    { name: 'targetDate', label: 'الموعد المستهدف', type: 'datetime', gridColSpan: 1 },
    { name: 'hubId', label: 'المركز التابع له', type: 'select', gridColSpan: 2, options: (ctx) => [{ value: '', label: 'بدون مركز' }, ...(ctx?.hubs || []).map((h: any) => ({ value: h.id, label: h.name }))] },
  ],
};

// ─── 7. Health Record ─────────────────────────────────────────────────────
export const healthValidationSchema = z.object({
  date: z.string().min(1, 'التاريخ مطلوب'),
  waterIntakeMl: z.coerce.number().min(0).default(2000),
  sleepHours: z.coerce.number().min(0).max(24).default(7.5),
  exerciseMinutes: z.coerce.number().min(0).default(0),
  weightKg: z.coerce.number().optional(),
  caloriesBurned: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export const healthFormSchema: UniversalFormSchema = {
  id: 'health-schema',
  title: 'تسجيل مؤشر صحي',
  subtitle: 'تتبع مؤشراتك الصحية اليومية لحياة أفضل وأكثر توازناً',
  validationSchema: healthValidationSchema,
  fields: [
    { name: 'date', label: 'التاريخ *', type: 'datetime', required: true, gridColSpan: 2 },
    { name: 'waterIntakeMl', label: 'شرب الماء (مل)', type: 'text', placeholder: '2000', gridColSpan: 1 },
    { name: 'sleepHours', label: 'ساعات النوم', type: 'text', placeholder: '7.5', gridColSpan: 1 },
    { name: 'exerciseMinutes', label: 'دقائق التمرين', type: 'text', placeholder: '45', gridColSpan: 1 },
    { name: 'weightKg', label: 'الوزن (كجم)', type: 'text', placeholder: '70', gridColSpan: 1 },
    { name: 'caloriesBurned', label: 'سعرات محروقة', type: 'text', placeholder: '400', gridColSpan: 1 },
    { name: 'notes', label: 'ملاحظات', type: 'textarea', placeholder: 'كيف كان يومك الصحي؟...', rows: 2, gridColSpan: 2 },
  ],
};

// ─── Schema Router ─────────────────────────────────────────────────────────
export function getFormSchemaForType(type: string | null): UniversalFormSchema {
  switch (type) {
    case 'hub':        return hubFormSchema;
    case 'project':    return projectFormSchema;
    case 'assignment': return assignmentFormSchema;
    case 'habit':      return habitFormSchema;
    case 'goal':       return goalFormSchema;
    case 'health':     return healthFormSchema;
    case 'task':
    default:           return taskFormSchema;
  }
}
