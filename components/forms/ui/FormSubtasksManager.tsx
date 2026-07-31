'use client';

import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo } from 'lucide-react';

export interface SubtaskItem {
  title: string;
  isCompleted: boolean;
  sortOrder: number;
}

interface FormSubtasksManagerProps {
  items: SubtaskItem[];
  onChange: (items: SubtaskItem[]) => void;
  label?: string;
}

export const FormSubtasksManager: React.FC<FormSubtasksManagerProps> = ({
  items,
  onChange,
  label = 'المهام الفرعية (Subtasks)',
}) => {
  const [newItemTitle, setNewItemTitle] = useState('');

  const handleAddItem = () => {
    if (newItemTitle.trim()) {
      onChange([
        ...items,
        {
          title: newItemTitle.trim(),
          isCompleted: false,
          sortOrder: items.length + 1,
        },
      ]);
      setNewItemTitle('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleToggleItem = (index: number) => {
    const updated = items.map((item, idx) =>
      idx === index ? { ...item, isCompleted: !item.isCompleted } : item
    );
    onChange(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const completedCount = items.filter((i) => i.isCompleted).length;

  return (
    <div className="space-y-2 text-right w-full">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
          <ListTodo className="w-3.5 h-3.5 text-primary" />
          <span>{label}</span>
        </label>

        {items.length > 0 && (
          <span className="text-[11px] font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
            {completedCount} / {items.length} مكتملة
          </span>
        )}
      </div>

      {/* Subtasks List */}
      {items.length > 0 && (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 p-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl transition-all hover:border-outline-variant group"
            >
              <button
                type="button"
                onClick={() => handleToggleItem(idx)}
                className="flex items-center gap-2 text-right flex-1 min-w-0"
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-outline shrink-0" />
                )}
                <span
                  className={`text-xs truncate ${
                    item.isCompleted
                      ? 'line-through text-on-surface-variant/60'
                      : 'text-on-surface'
                  }`}
                >
                  {item.title}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="p-1 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors opacity-80 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Subtask Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="إضافة مهمة فرعية جديدة..."
          className="flex-1 px-3.5 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-xs text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60"
        />
        <button
          type="button"
          onClick={handleAddItem}
          disabled={!newItemTitle.trim()}
          className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary disabled:opacity-40 font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة</span>
        </button>
      </div>
    </div>
  );
};
