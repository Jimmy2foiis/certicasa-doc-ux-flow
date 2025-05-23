import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to specified format
export function formatDate(date: Date, format: string = "yyyy-MM-dd"): string {
  try {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "-";
    }
    
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    
    switch (format) {
      case "dd/MM/yyyy":
        return `${day}/${month}/${year}`;
      case "MM/dd/yyyy":
        return `${month}/${day}/${year}`;
      case "yyyy-MM-dd":
      default:
        return `${year}-${month}-${day}`;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}
