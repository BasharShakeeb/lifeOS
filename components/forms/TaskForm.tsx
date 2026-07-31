'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  PlusCircle,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/providers/ToastProvider';
import { Task, Priority, TaskStatus } from '@/types';
import { FormInput } from './ui/FormInput';
import { FormTextarea } from './ui/FormTextarea';
import { FormSelect } from './ui/FormSelect';
import { FormPrioritySelector } from './ui/FormPrioritySelector';
import { FormDateTimePicker } from './ui/FormDateTimePicker';
import { FormTagsInput } from './ui/FormTagsInput';
import { FormSubtasksManager, SubtaskItem } from './ui/FormSubtasksManager';
import { FormReminderPicker, ReminderOption } from './ui/FormReminderPicker';
import { FormRepeatSettings, RepeatInterval } from './ui/FormRepeatSettings';
import { FormFileUpload, FormAttachment } from './ui/FormFileUpload';

interface TaskFormProps {
  initialData?: Partial<Task>;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onClose }) => {
  const { projects, hubs, addTask, updateTask } = useAppStore();
  const { toast } = useToast();

  const isEditMode = Boolean(initialData?.id);

  // Core Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate || new Date().toISOString().split('T')[0]
  );
  const [dueTime, setDueTime] = useState('09:00');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'not_started');

  // Relational Fields
  const [projectId, setProjectId] = useState(initialData?.projectId || '');
  const [hubId, setHubId] = useState(initialData?.hubId || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  // Advanced Features
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>(
    initialData?.subtasks?.map((s, idx) => ({
      title: s.title,
      isCompleted: s.completed,
      sortOrder: idx + 1,
    })) || []
  );

  const [reminder, setReminder] = useState<ReminderOption>('none');
  const [repeat, setRepeat] = useState<RepeatInterval>('none');
  const [attachments, setAttachments] = useState<FormAttachment[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Validation Error State
  const [titleError, setTitleError] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setDueTime('09:00');
    setPriority('medium');
    setStatus('not_started');
    setProjectId('');
    setHubId('');
    setTags([]);
    setSubtasks([]);
    setReminder('none');
    setRepeat('none');
    setAttachments([]);
    setTitleError('');
  };

  const validate = (): boolean => {
    if (!title.trim()) {
      setTitleError('عنوان المهمة مطلوب ولا يمكن أن يكون فارغاً');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleSaveTask = (createAnother = false) => {
    if (!validate()) return;

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueTime ? `${dueDate}T${dueTime}` : dueDate,
      priority,
      status,
      projectId: projectId || undefined,
      hubId: hubId || undefined,
      tags,
      subtasks: subtasks.map((s, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title: s.title,
        completed: s.isCompleted,
      })),
    };

    if (isEditMode && initialData?.id) {
      updateTask(initialData.id, taskPayload);
      toast('تم تحديث المهمة بنجاح', 'success');
      onClose();
    } else {
      addTask(taskPayload);
      toast('تمت إضافة المهمة بنجاح!', 'success');

      if (createAnother) {
        resetForm();
      } else {
        onClose();
      }
    }
  };

  // Select options mapping
  const projectOptions = [
    { value: '', label: 'بدون مشروع (عام)' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  const hubOptions = [
    { value: '', label: 'بدون مركز (عام)' },
    ...hubs.map((h) => ({ value: h.id, label: h.name })),
  ];

  const statusOptions = [
    { value: 'not_started', label: 'قيد الانتظار (To Do)' },
    { value: 'in_progress', label: 'قيد التنفيذ (In Progress)' },
    { value: 'completed', label: 'مكتملة (Completed)' },
  ];

  return (
    <div className="space-y-5 text-right font-sans">
      {/* Title Field */}
      <FormInput
        label="عنوان المهمة *"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (e.target.value.trim()) setTitleError('');
        }}
        placeholder="أدخل عنوان المهمة (مثال: إعداد تقرير المشروع الأسبوعي)..."
        error={titleError}
        autoFocus
      />

      {/* Description Field */}
      <FormTextarea
        label="الوصف والملاحظات"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="أضف تفاصيل سريعة عن المهمة أو خطوات التنفيذ..."
        rows={2}
      />

      {/* Relational Pickers (Project & Hub) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormSelect
          label="المشروع (Project)"
          options={projectOptions}
          value={projectId}
          onChange={setProjectId}
        />
        <FormSelect
          label="المركز (Hub)"
          options={hubOptions}
          value={hubId}
          onChange={setHubId}
        />
      </div>

      {/* Date & Time Picker */}
      <FormDateTimePicker
        dueDate={dueDate}
        dueTime={dueTime}
        onDateChange={setDueDate}
        onTimeChange={setDueTime}
      />

      {/* Priority Selector */}
      <FormPrioritySelector value={priority} onChange={setPriority} />

      {/* Status Selector */}
      <FormSelect
        label="حالة المهمة"
        options={statusOptions}
        value={status}
        onChange={(val) => setStatus(val as TaskStatus)}
      />

      {/* Tags Input */}
      <FormTagsInput tags={tags} onChange={setTags} />

      {/* Subtasks Checklist Manager */}
      <FormSubtasksManager items={subtasks} onChange={setSubtasks} />

      {/* Advanced Toggle Accordion */}
      <div className="border-t border-outline-variant/40 pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-bold text-on-surface-variant hover:text-primary transition-colors py-1"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>خيارات إضافية (تذكير، تكرار، مرفقات)</span>
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
              <FormReminderPicker value={reminder} onChange={setReminder} />
              <FormRepeatSettings value={repeat} onChange={setRepeat} />
              <FormFileUpload attachments={attachments} onChange={setAttachments} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 border-t border-outline-variant/40 pt-4 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface-variant hover:bg-surface-container text-xs font-semibold transition-all"
        >
          إلغاء
        </button>

        {!isEditMode && (
          <button
            type="button"
            onClick={() => handleSaveTask(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-all border border-outline-variant/50 flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-primary" />
            <span>حفظ وإنشاء مهمة أخرى</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => handleSaveTask(false)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-subtle flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <Save className="w-4 h-4" />
          <span>{isEditMode ? 'تحديث المهمة' : 'حفظ المهمة'}</span>
        </button>
      </div>
    </div>
  );
};
