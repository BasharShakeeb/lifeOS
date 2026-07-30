'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useToast } from '@/providers/ToastProvider';

/* Centered Creation Dialog */
interface CreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CreateDialog: React.FC<CreateDialogProps> = ({ isOpen, onClose, title, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        /* direction:ltr isolates this overlay from the page's RTL context
           so flexbox centering works correctly regardless of body direction */
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px',
            direction: 'ltr',
          }}
        >
          {/* Backdrop — does NOT close dialog on click */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.50)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Dialog Card */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              maxHeight: 'calc(100vh - 64px)',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 24px 60px -12px rgba(0,0,0,0.22)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              direction: 'rtl',
            }}
          >
            {/* Top green accent bar */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #006c49, #10b981, transparent)', flexShrink: 0 }} />

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px 16px',
              borderBottom: '1px solid rgba(0,0,0,0.07)',
              flexShrink: 0,
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0b1c30', lineHeight: 1.3 }}>{title}</h2>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280' }}>أدخل البيانات المطلوبة أدناه</p>
              </div>
              <button
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px',
                  borderRadius: '10px', border: 'none',
                  backgroundColor: 'transparent', cursor: 'pointer',
                  color: '#6b7280', flexShrink: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const GlobalModalManager: React.FC = () => {
  const { activeDrawer, closeDrawer, activeModal, closeModal, addTask, addHub, addProject, addAssignment, addHabit, addGoal, addHealthRecord } = useAppStore();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');

  const resetForm = () => { setTitle(''); setDescription(''); setPriority('medium'); setDueDate(''); setCategory(''); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast('العنوان مطلوب', 'error'); return; }
    switch (activeDrawer.type) {
      case 'task': addTask({ title, description, dueDate: dueDate || new Date().toISOString().split('T')[0], priority, status: 'in_progress', tags: ['عام'] }); toast('تم إضافة المهمة بنجاح', 'success'); break;
      case 'hub': addHub({ name: title, description: description || 'فئة إنتاجية جديدة', icon: 'layers', color: '#10B981' }); toast('تم إضافة المحور بنجاح', 'success'); break;
      case 'project': addProject({ name: title, description, hubId: 'h-1', hubName: 'هندسة البرمجيات', status: 'in_progress', progress: 10, startDate: new Date().toISOString().split('T')[0], endDate: dueDate || '2026-12-31', tasksCount: 1 }); toast('تم إضافة المشروع بنجاح', 'success'); break;
      case 'assignment': addAssignment({ title, subject: category || 'المواد الدراسية', dueDate: dueDate || new Date().toISOString().split('T')[0], priority, status: 'in_progress', notes: description }); toast('تم إضافة التكليف بنجاح', 'success'); break;
      case 'habit': addHabit({ title, category: category || 'التدفق اليومي', frequency: 'daily' }); toast('تم إضافة العادة بنجاح', 'success'); break;
      case 'goal': addGoal({ title, category: category || 'عام', targetDate: dueDate || '2026-12-31', progress: 0, milestones: [{ id: 'm-new', title: 'الهدف المرحلي الأول', completed: false }] }); toast('تم إضافة الهدف بنجاح', 'success'); break;
      case 'health': addHealthRecord({ date: new Date().toISOString().split('T')[0], waterIntakeMl: Number(title) || 2000, sleepHours: Number(description) || 7.5, exerciseMinutes: 45, notes: 'تمت إضافته عبر المسجل الصحي' }); toast('تم تسجيل المؤشر الصحي', 'success'); break;
    }
    resetForm(); closeDrawer();
  };

  const getTitle = () => {
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

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1px solid rgba(0,0,0,0.12)', borderRadius: '12px',
    padding: '10px 14px', fontSize: '14px', color: '#0b1c30',
    backgroundColor: '#f9fafb', outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s', fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '6px',
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#006c49';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,108,73,0.08)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <>
      <CreateDialog isOpen={activeDrawer.isOpen} onClose={() => { resetForm(); closeDrawer(); }} title={getTitle()}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={labelStyle}>العنوان / الاسم <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="مثال: إكمال الهيكلية الهندسية للمشروع" style={inputStyle} required onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>الوصف / ملاحظات</label>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="أدخل التفاصيل..." style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 } as React.CSSProperties} onFocus={onFocus} onBlur={onBlur} />
          </div>
          {(activeDrawer.type === 'task' || activeDrawer.type === 'assignment') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>الأولوية</label>
                <select value={priority} onChange={e => setPriority(e.target.value as any)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                  <option value="urgent">عاجلة</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>تاريخ الاستحقاق</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.07)', marginTop: '4px' }}>
            <button type="button" onClick={() => { resetForm(); closeDrawer(); }}
              style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer', color: '#6b7280', backgroundColor: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              إلغاء
            </button>
            <button type="submit"
              style={{ padding: '9px 22px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', backgroundColor: '#006c49', color: '#ffffff', boxShadow: '0 2px 8px rgba(0,108,73,0.25)' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              حفظ وإنشاء
            </button>
          </div>
        </form>
      </CreateDialog>

      <Modal isOpen={activeModal.isOpen} onClose={closeModal} title={activeModal.data?.title || activeModal.data?.name || 'تفاصيل العنصر'} subtitle={activeModal.data?.subject || activeModal.data?.category || 'نظرة عامة مفصلة'}>
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
              <div><ProgressBar value={activeModal.data.progress} showPercentage /></div>
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
