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
import { UniversalFormEngine } from '@/components/forms/v2/UniversalFormEngine';
import { getFormSchemaForType } from '@/components/forms/v2/schemas';

/* ─── Centered Creation Dialog ─── */
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
          {/* Backdrop */}
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
              maxWidth: '580px',
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
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0b1c30', margin: 0, lineHeight: 1.3 }}>{title}</h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                  backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#6b7280', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#111827'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
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

/* ─── Global Modal Manager ─── */
export const GlobalModalManager: React.FC = () => {
  const { activeDrawer, closeDrawer, activeModal, closeModal } = useAppStore();

  const getTitle = () => {
    const isEdit = Boolean(activeDrawer.initialData?.id);
    switch (activeDrawer.type) {
      case 'task':       return isEdit ? 'تعديل المهمة' : 'إضافة مهمة جديدة';
      case 'hub':        return isEdit ? 'تعديل المركز' : 'إضافة مركز جديد';
      case 'project':    return isEdit ? 'تعديل المشروع' : 'إضافة مشروع جديد';
      case 'assignment': return isEdit ? 'تعديل التكليف' : 'إضافة تكليف جديد';
      case 'habit':      return isEdit ? 'تعديل العادة' : 'إضافة عادة جديدة';
      case 'goal':       return isEdit ? 'تعديل الهدف' : 'إضافة هدف جديد';
      case 'health':     return isEdit ? 'تعديل المؤشر الصحي' : 'تسجيل مؤشر صحي';
      default:           return isEdit ? 'تعديل العنصر' : 'إضافة عنصر جديد';
    }
  };

  return (
    <>
      {/* ─── Universal Creation / Edit Dialog ─── */}
      <CreateDialog
        isOpen={activeDrawer.isOpen}
        onClose={closeDrawer}
        title={getTitle()}
      >
        <UniversalFormEngine
          schema={getFormSchemaForType(activeDrawer.type)}
          initialData={activeDrawer.initialData}
          onClose={closeDrawer}
        />
      </CreateDialog>

      {/* ─── Detail View Modal ─── */}
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
