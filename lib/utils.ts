import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ar-SA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getStatusBadgeColor(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
    case "active":
    case "done":
    case "مكتمل":
    case "نشط":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "in progress":
    case "ongoing":
    case "قيد التنفيذ":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "pending":
    case "not started":
    case "لم يبدأ":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "paused":
    case "warning":
    case "متوقف":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "overdue":
    case "urgent":
    case "high":
    case "عاجل":
    case "مهم":
      return "bg-red-50 text-red-800 border-red-200";
    default:
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
}
