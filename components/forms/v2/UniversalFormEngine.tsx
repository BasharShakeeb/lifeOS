'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  PlusCircle,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

import { UniversalFormSchema, FormFieldConfig } from './types';
import { useFormDraft } from './useFormDraft';
import { useUndoAction } from './useUndoAction';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/providers/ToastProvider';

import { FormInput } from '../ui/FormInput';
import { FormTextarea } from '../ui/FormTextarea';
import { FormSelect } from '../ui/FormSelect';
import { FormPrioritySelector } from '../ui/FormPrioritySelector';
import { FormDateTimePicker } from '../ui/FormDateTimePicker';
import { FormTagsInput } from '../ui/FormTagsInput';
import { FormSubtasksManager } from '../ui/FormSubtasksManager';
import { FormReminderPicker } from '../ui/FormReminderPicker';
import { FormRepeatSettings } from '../ui/FormRepeatSettings';
import { FormFileUpload } from '../ui/FormFileUpload';

interface UniversalFormEngineProps {
  schema: UniversalFormSchema;
  initialData?: any;
  onClose: () => void;
}

export const UniversalFormEngine: React.FC<UniversalFormEngineProps> = ({
  schema,
  initialData,
  onClose,
}) => {
  const {
    projects, hubs,
    addTask, updateTask,
    addHub, updateHub, addProject, updateProject,
    addAssignment, addHabit, addGoal, addHealthRecord,
    updateAssignment, updateHabit, updateGoal, updateHealthRecord,
  } = useAppStore();
  const { toast } = useToast();
  const { triggerUndoableAction } = useUndoAction();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiGeneratingField, setAiGeneratingField] = useState<string | null>(null);

  // Initialize React Hook Form with Zod validation resolver
  const defaultValues = {
    title: initialData?.title || initialData?.name || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || new Date().toISOString().split('T')[0],
    dueTime: '09:00',
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'not_started',
    projectId: initialData?.projectId || '',
    hubId: initialData?.hubId || '',
    tags: initialData?.tags || [],
    subtasks: initialData?.subtasks || [],
    reminder: 'none',
    repeat: 'none',
    attachments: [],
    color: initialData?.color || '#10B981',
    name: initialData?.name || '',
    // Assignment fields
    subject: initialData?.subject || '',
    notes: initialData?.notes || '',
    // Habit fields
    category: initialData?.category || '',
    frequency: initialData?.frequency || 'daily',
    // Goal fields
    targetDate: initialData?.targetDate || new Date().toISOString().split('T')[0],
    // Health fields
    date: initialData?.date || new Date().toISOString().split('T')[0],
    waterIntakeMl: initialData?.waterIntakeMl ?? 2000,
    sleepHours: initialData?.sleepHours ?? 7.5,
    exerciseMinutes: initialData?.exerciseMinutes ?? 0,
    weightKg: initialData?.weightKg ?? undefined,
    caloriesBurned: initialData?.caloriesBurned ?? undefined,
    endDate: initialData?.endDate || '',
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema.validationSchema as any),
    defaultValues,
  });

  const formValues = watch();

  // Auto-Save Draft Hook
  const { hasDraft, restoreDraft, clearDraft } = useFormDraft(
    schema.id,
    formValues,
    (draftValues) => reset({ ...defaultValues, ...draftValues })
  );

  // AI Generation Simulator
  const handleAiAssist = (fieldName: string) => {
    setAiGeneratingField(fieldName);
    setTimeout(() => {
      if (fieldName === 'title' || fieldName === 'name') {
        const currentTitle = formValues.title || formValues.name || '';
        setValue(
          fieldName as any,
          currentTitle ? `✨ ${currentTitle} (مُحسن بالذكاء الاصطناعي)` : '🚀 إنجاز تقرير الربع الأخير وتنسيق المخرجات'
        );
      } else if (fieldName === 'description') {
        setValue(
          'description',
          '• مراجعة البيانات الأساسية والمؤشرات.\n• كتابة ملخص النتائج.\n• مشاركة المسودة الأولى مع أعضاء الفريق.'
        );
      }
      setAiGeneratingField(null);
      toast('تم توليد وتصحيح النص بواسطة الذكاء الاصطناعي ✨', 'info');
    }, 800);
  };

  // Submit Handler
  const onSubmit = async (data: any, createAnother = false) => {
    try {
      const isEdit = Boolean(initialData?.id);

      if (schema.id === 'task-schema') {
        const taskPayload = {
          title: data.title,
          description: data.description || '',
          dueDate: data.dueTime ? `${data.dueDate}T${data.dueTime}` : data.dueDate,
          priority: data.priority,
          status: data.status,
          projectId: data.projectId || undefined,
          hubId: data.hubId || undefined,
          tags: data.tags || [],
          subtasks: (data.subtasks || []).map((s: any, idx: number) => ({
            id: `sub-${Date.now()}-${idx}`,
            title: s.title,
            completed: Boolean(s.isCompleted),
          })),
        };

        if (isEdit && initialData.id) {
          await updateTask(initialData.id, taskPayload);
          triggerUndoableAction({
            successMessage: 'تم تحديث المهمة بنجاح',
            onUndo: () => updateTask(initialData.id, initialData),
          });
        } else {
          await addTask(taskPayload);
          triggerUndoableAction({
            successMessage: 'تمت إضافة المهمة بنجاح',
            onUndo: () => console.log('Undo task addition'),
          });
        }
      } else if (schema.id === 'hub-schema') {
        const hubPayload = {
          name: data.name || data.title,
          description: data.description || '',
          icon: 'layers',
          color: data.color || '#10B981',
        };
        if (isEdit && initialData.id) {
          updateHub(initialData.id, hubPayload);
          toast('تم تحديث المركز بنجاح', 'success');
        } else {
          addHub(hubPayload);
          toast('تم إضافة المركز بنجاح', 'success');
        }
      } else if (schema.id === 'project-schema') {
        if (isEdit && initialData.id) {
          updateProject(initialData.id, {
            name: data.name || data.title,
            description: data.description || '',
            hubId: data.hubId || initialData.hubId || 'h-1',
            endDate: data.endDate || initialData.endDate,
          });
          toast('تم تحديث المشروع بنجاح', 'success');
        } else {
          addProject({
            name: data.name || data.title,
            description: data.description || '',
            hubId: data.hubId || 'h-1',
            hubName: 'عام',
            status: 'in_progress',
            progress: 10,
            startDate: new Date().toISOString().split('T')[0],
            endDate: data.endDate || '2026-12-31',
            tasksCount: 1,
          });
          toast('تم إضافة المشروع بنجاح', 'success');
        }
      } else if (schema.id === 'assignment-schema') {
        const assignmentPayload = {
          title: data.title,
          subject: data.subject,
          dueDate: data.dueDate,
          priority: data.priority || 'medium',
          status: data.status || 'pending',
          notes: data.notes || '',
        };
        if (isEdit && initialData.id) {
          updateAssignment(initialData.id, assignmentPayload);
          toast('تم تحديث التكليف بنجاح', 'success');
        } else {
          addAssignment(assignmentPayload);
          toast('تم إضافة التكليف بنجاح', 'success');
        }
      } else if (schema.id === 'habit-schema') {
        const habitPayload = {
          title: data.title,
          category: data.category,
          frequency: data.frequency || 'daily',
        };
        if (isEdit && initialData.id) {
          updateHabit(initialData.id, habitPayload);
          toast('تم تحديث العادة بنجاح', 'success');
        } else {
          addHabit(habitPayload);
          toast('تم إضافة العادة بنجاح', 'success');
        }
      } else if (schema.id === 'goal-schema') {
        const goalPayload = {
          title: data.title,
          category: data.category,
          targetDate: data.targetDate,
          hubId: data.hubId || undefined,
          progress: 0,
          milestones: [],
        };
        if (isEdit && initialData.id) {
          const { progress, milestones, ...goalUpdate } = goalPayload;
          updateGoal(initialData.id, goalUpdate);
          toast('تم تحديث الهدف بنجاح', 'success');
        } else {
          addGoal(goalPayload);
          toast('تم إضافة الهدف بنجاح', 'success');
        }
      } else if (schema.id === 'health-schema') {
        const healthPayload = {
          date: data.date,
          waterIntakeMl: Number(data.waterIntakeMl) || 0,
          sleepHours: Number(data.sleepHours) || 0,
          exerciseMinutes: Number(data.exerciseMinutes) || 0,
          weightKg: data.weightKg ? Number(data.weightKg) : undefined,
          caloriesBurned: data.caloriesBurned ? Number(data.caloriesBurned) : undefined,
          notes: data.notes || '',
        };
        if (isEdit && initialData.id) {
          updateHealthRecord(initialData.id, healthPayload);
          toast('تم تحديث المؤشر الصحي بنجاح', 'success');
        } else {
          addHealthRecord(healthPayload);
          toast('تم تسجيل المؤشر الصحي بنجاح', 'success');
        }
      }

      clearDraft();

      if (createAnother) {
        reset(defaultValues);
      } else {
        onClose();
      }
    } catch (error) {
      toast('حدث خطأ أثناء حفظ البيانات', 'error');
    }
  };

  // Render Form Field Component dynamically according to FieldConfig
  const renderField = (field: FormFieldConfig) => {
    const errorMsg = (errors as any)[field.name]?.message;
    const context = { projects, hubs };
    const options =
      typeof field.options === 'function' ? field.options(context) : field.options || [];

    return (
      <div
        key={field.name}
        className={field.gridColSpan === 2 ? 'col-span-1 sm:col-span-2' : 'col-span-1'}
      >
        <Controller
          name={field.name as any}
          control={control}
          render={({ field: controllerField }) => {
            // Must always return a ReactElement (never null) per Controller contract
            switch (field.type) {
              case 'text':
                return (
                  <div className="relative">
                    <FormInput
                      label={field.label}
                      placeholder={field.placeholder}
                      error={errorMsg}
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                    />
                    {field.aiAssist && (
                      <button
                        type="button"
                        onClick={() => handleAiAssist(field.name)}
                        disabled={aiGeneratingField === field.name}
                        className="absolute left-2 top-8 px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 border border-purple-400/30"
                      >
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span>{aiGeneratingField === field.name ? 'جاري التوليد...' : '✨ ذكاء اصطناعي'}</span>
                      </button>
                    )}
                  </div>
                );

              case 'textarea':
                return (
                  <div className="relative">
                    <FormTextarea
                      label={field.label}
                      placeholder={field.placeholder}
                      rows={field.rows || 2}
                      error={errorMsg}
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                    />
                    {field.aiAssist && (
                      <button
                        type="button"
                        onClick={() => handleAiAssist(field.name)}
                        disabled={aiGeneratingField === field.name}
                        className="absolute left-2 top-8 px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 border border-purple-400/30"
                      >
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span>{aiGeneratingField === field.name ? 'جاري التوليد...' : '✨ تحسين بالذكاء الاصطناعي'}</span>
                      </button>
                    )}
                  </div>
                );

              case 'select':
                return (
                  <FormSelect
                    label={field.label}
                    options={options}
                    value={controllerField.value || ''}
                    onChange={controllerField.onChange}
                    error={errorMsg}
                  />
                );

              case 'priority':
                return (
                  <FormPrioritySelector
                    label={field.label}
                    value={controllerField.value || 'medium'}
                    onChange={controllerField.onChange}
                  />
                );

              case 'datetime':
                return (
                  <FormDateTimePicker
                    label={field.label}
                    dueDate={controllerField.value || new Date().toISOString().split('T')[0]}
                    dueTime={watch('dueTime')}
                    onDateChange={controllerField.onChange}
                    onTimeChange={(time) => setValue('dueTime', time)}
                  />
                );

              case 'tags':
                return (
                  <FormTagsInput
                    label={field.label}
                    tags={controllerField.value || []}
                    onChange={controllerField.onChange}
                  />
                );

              case 'subtasks':
                return (
                  <FormSubtasksManager
                    label={field.label}
                    items={controllerField.value || []}
                    onChange={controllerField.onChange}
                  />
                );

              case 'reminder':
                return (
                  <FormReminderPicker
                    label={field.label}
                    value={controllerField.value || 'none'}
                    onChange={controllerField.onChange}
                  />
                );

              case 'repeat':
                return (
                  <FormRepeatSettings
                    label={field.label}
                    value={controllerField.value || 'none'}
                    onChange={controllerField.onChange}
                  />
                );

              case 'file':
                return (
                  <FormFileUpload
                    label={field.label}
                    attachments={controllerField.value || []}
                    onChange={controllerField.onChange}
                  />
                );

              default:
                return <span />;
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-5 text-right font-sans">
      {/* Restore Auto-Saved Draft Alert Banner */}
      {hasDraft && (
        <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-800 dark:text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-600" />
            <span>توجد مسودة غير محفوظة من الجلسة السابقة.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={restoreDraft}
              className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors"
            >
              استعادة المسودة
            </button>
            <button
              type="button"
              onClick={clearDraft}
              className="px-2 py-1 text-on-surface-variant hover:text-error transition-colors"
            >
              تجاهل
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Fields Grid */}
      <form onSubmit={handleSubmit((d) => onSubmit(d, false))} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {schema.fields.map(renderField)}
        </div>

        {/* Advanced Section Accordion */}
        {schema.advancedFields && schema.advancedFields.length > 0 && (
          <div className="border-t border-outline-variant/40 pt-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-xs font-bold text-on-surface-variant hover:text-primary transition-colors py-1"
            >
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                <span>خيارات إضافية مخصصة</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showAdvanced ? 'rotate-180 text-primary' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-4 pt-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {schema.advancedFields.map(renderField)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 border-t border-outline-variant/40 pt-4 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface-variant hover:bg-surface-container text-xs font-semibold transition-all"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleSubmit((d) => onSubmit(d, true))}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-all border border-outline-variant/50 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4 text-primary" />
            <span>حفظ وإضافة عنصر آخر</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-subtle flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{initialData?.id ? 'تحديث البيانات' : 'حفظ'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
