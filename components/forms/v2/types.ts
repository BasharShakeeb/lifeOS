import { ZodSchema } from 'zod';
import { ReactNode } from 'react';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multi-select'
  | 'datetime'
  | 'priority'
  | 'tags'
  | 'subtasks'
  | 'reminder'
  | 'repeat'
  | 'file'
  | 'number'
  | 'custom';

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
  icon?: ReactNode;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: any;
  options?: SelectOption[] | ((contextData: any) => SelectOption[]);
  rows?: number;
  gridColSpan?: 1 | 2; // 1 = half width, 2 = full width
  aiAssist?: boolean; // Shows AI Generate / Enhance button
  aiPromptPlaceholder?: string;
  pluginKey?: string; // Custom field plugin key
  hint?: string;
  required?: boolean;
}

export interface UniversalFormSchema {
  id: string;
  title: string;
  subtitle?: string;
  validationSchema: ZodSchema<any>;
  fields: FormFieldConfig[];
  advancedFields?: FormFieldConfig[];
}

export interface UndoPayload {
  actionName: string;
  undoFn: () => void;
  durationMs?: number;
}
