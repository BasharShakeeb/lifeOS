'use client';

import React, { useRef } from 'react';
import { Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';

export interface FormAttachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

interface FormFileUploadProps {
  attachments: FormAttachment[];
  onChange: (attachments: FormAttachment[]) => void;
  label?: string;
}

export const FormFileUpload: React.FC<FormFileUploadProps> = ({
  attachments,
  onChange,
  label = 'المرفقات (Attachments)',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newAttachments: FormAttachment[] = Array.from(files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
        type: f.type,
        url: URL.createObjectURL(f),
      }));
      onChange([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    onChange(attachments.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2 text-right w-full">
      {label && (
        <label className="block text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5 text-primary" />
          <span>{label}</span>
        </label>
      )}

      {/* Attachment List */}
      {attachments.length > 0 && (
        <div className="space-y-1.5">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 p-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl"
            >
              <div className="flex items-center gap-2 min-w-0">
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4 text-purple-500 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                )}
                <div className="min-w-0 text-right">
                  <p className="text-xs font-medium text-on-surface truncate">{file.name}</p>
                  <p className="text-[10px] text-on-surface-variant/70">{file.size}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveAttachment(idx)}
                className="p-1 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelected}
        className="hidden"
        accept="image/*,application/pdf,.doc,.docx,.txt"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-2.5 px-3 border border-dashed border-outline-variant/60 hover:border-primary rounded-xl text-xs font-semibold text-on-surface-variant hover:text-primary bg-surface-container-lowest hover:bg-surface-container transition-all flex items-center justify-center gap-2"
      >
        <Paperclip className="w-3.5 h-3.5" />
        <span>إضافة مرفقات (صور، PDF، مستندات)</span>
      </button>
    </div>
  );
};
