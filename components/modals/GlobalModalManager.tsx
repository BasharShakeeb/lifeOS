'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useToast } from '@/providers/ToastProvider';

export const GlobalModalManager: React.FC = () => {
  const { activeDrawer, closeDrawer, activeModal, closeModal, addTask, addHub, addProject, addAssignment, addHabit, addGoal, addHealthRecord } = useAppStore();
  const { toast } = useToast();

  // Form Local State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setCategory('');
  };

  const handleDrawerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast('العنوان مطلوب', 'error');
      return;
    }

    switch (activeDrawer.type) {
      case 'task':
        addTask({
          title,
          description,
          dueDate: dueDate || new Date().toISOString().split('T')[0],
          priority,
          status: 'in_progress',
          tags: ['عام'],
        });
        toast('تم إضافة المهمة بنجاح', 'success');
        break;
      case 'hub':
        addHub({
          name: title,
          description: description || 'فئة إنتاجية جديدة',
          icon: 'layers',
          color: '#10B981',
        });
        toast('تم إضافة المحور بنجاح', 'success');
        break;
      case 'project':
        addProject({
          name: title,
          description,
          hubId: 'h-1',
          hubName: 'هندسة البرمجيات',
          status: 'in_progress',
          progress: 10,
          startDate: new Date().toISOString().split('T')[0],
          endDate: dueDate || '2026-12-31',
          tasksCount: 1,
        });
        toast('تم إضافة المشروع بنجاح', 'success');
        break;
      case 'assignment':
        addAssignment({
          title,
          subject: category || 'المواد الدراسية',
          dueDate: dueDate || new Date().toISOString().split('T')[0],
          priority,
          status: 'in_progress',
          notes: description,
        });
        toast('تم إضافة التكليف بنجاح', 'success');
        break;
      case 'habit':
        addHabit({
          title,
          category: category || 'التدفق اليومي',
          frequency: 'daily',
        });
        toast('تم إضافة العادة بنجاح', 'success');
        break;
      case 'goal':
        addGoal({
          title,
          category: category || 'عام',
          targetDate: dueDate || '2026-12-31',
          progress: 0,
          milestones: [{ id: 'm-new', title: 'الهدف المرحلي الأول', completed: false }],
        });
        toast('تم إضافة الهدف بنجاح', 'success');
        break;
      case 'health':
        addHealthRecord({
          date: new Date().toISOString().split('T')[0],
          waterIntakeMl: Number(title) || 2000,
          sleepHours: Number(description) || 7.5,
          exerciseMinutes: 45,
          notes: 'تمت إضافته عبر المسجل الصحي',
        });
        toast('تم تسجيل المؤشر الصحي', 'success');
        break;
    }

    resetForm();
    closeDrawer();
  };

  const getDrawerTitle = () => {
    switch (activeDrawer.type) {
      case 'task': return 'إضافة مهمة جديدة';
      case 'hub': return 'إضافة محور جديد';
      case 'project': return 'إضافة مشروع جديد';
      case 'assignment': return 'إضافة تكليف جديد';
      case 'habit': return 'إضافة عادة جديدة';
      case 'goal': return 'إضافة هدف جديد';
      case 'health': return 'تسجيل مؤشر صحي';
      default: return 'إضافة عنصر جديد';
    }
  };

  return (
    <>
      {/* Global Slide Drawer for Creating/Editing */}
      <Drawer
        isOpen={activeDrawer.isOpen}
        onClose={closeDrawer}
        title={getDrawerTitle()}
        subtitle="أدخل البيانات المطلوبة أدناه"
      >
        <form onSubmit={handleDrawerSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase font-semibold">العنوان / الاسم *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: إكمال الهيكلية الهندسية للمشروع"
              className="w-full bg-surface-input border border-border-subtle rounded-input px-4 py-2.5 text-sm text-on-surface focus:border-primary outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase font-semibold">الوصف / ملاحظات</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل التفاصيل..."
              className="w-full bg-surface-input border border-border-subtle rounded-input px-4 py-2.5 text-sm text-on-surface focus:border-primary outline-none transition-colors"
            />
          </div>

          {(activeDrawer.type === 'task' || activeDrawer.type === 'assignment') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase font-semibold">الأولوية</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-surface-input border border-border-subtle rounded-input px-3 py-2.5 text-sm text-on-surface focus:border-primary outline-none cursor-pointer"
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                  <option value="urgent">عاجلة</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase font-semibold">تاريخ الاستحقاق</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-surface-input border border-border-subtle rounded-input px-3 py-2.5 text-sm text-on-surface focus:border-primary outline-none"
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={closeDrawer}
              className="px-4 py-2 rounded-button text-sm text-text-muted hover:text-on-surface hover:bg-surface-input transition-colors font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-button text-sm font-bold bg-primary text-on-primary hover:bg-primary-hover shadow-subtle transition-colors"
            >
              حفظ وإنشاء
            </button>
          </div>
        </form>
      </Drawer>

      {/* Global Centered Modal for Viewing Details */}
      <Modal
        isOpen={activeModal.isOpen}
        onClose={closeModal}
        title={activeModal.data?.title || activeModal.data?.name || 'تفاصيل العنصر'}
        subtitle={activeModal.data?.subject || activeModal.data?.category || 'نظرة عامة مفصلة'}
      >
        {activeModal.data && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {activeModal.data.status && <Badge status={activeModal.data.status}>{activeModal.data.status}</Badge>}
              {activeModal.data.priority && <Badge status={activeModal.data.priority}>{activeModal.data.priority}</Badge>}
            </div>

            {activeModal.data.description && (
              <div>
                <h4 className="text-xs font-mono text-text-muted uppercase mb-1 font-semibold">الوصف</h4>
                <p className="text-sm text-on-surface leading-relaxed">{activeModal.data.description}</p>
              </div>
            )}

            {activeModal.data.progress !== undefined && (
              <div>
                <ProgressBar value={activeModal.data.progress} showPercentage />
              </div>
            )}

            <div className="pt-4 border-t border-border-subtle text-xs font-mono text-text-muted flex justify-between">
              <span>المعرف: {activeModal.data.id}</span>
              <span>تاريخ الإنشاء: {activeModal.data.createdAt || 'مؤخراً'}</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
