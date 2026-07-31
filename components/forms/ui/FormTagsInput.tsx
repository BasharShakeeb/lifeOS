'use client';

import React, { useState } from 'react';
import { Tag as TagIcon, X, Plus } from 'lucide-react';

interface FormTagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
}

export const FormTagsInput: React.FC<FormTagsInputProps> = ({
  tags,
  onChange,
  label = 'الوسوم (Tags)',
  placeholder = 'أضف وسماً واضغط Enter...',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmed = inputValue.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-1.5 text-right w-full">
      {label && <label className="block text-xs font-semibold text-on-surface-variant">{label}</label>}

      {/* Render Active Tag Chips */}
      <div className="flex flex-wrap items-center gap-1.5 min-h-[38px] p-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 animate-in fade-in zoom-in-95 duration-100"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="flex-1 flex items-center min-w-[120px]">
          <TagIcon className="w-3.5 h-3.5 text-outline mr-2 ml-1" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag}
            placeholder={tags.length === 0 ? placeholder : 'وسم آخر...'}
            className="w-full bg-transparent text-xs text-on-surface outline-none placeholder:text-outline-variant/60"
          />
        </div>
      </div>
    </div>
  );
};
