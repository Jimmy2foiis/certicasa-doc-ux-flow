
/**
 * Utility functions for date handling
 */

/**
 * Formats a date to YYYY-MM-DD string
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
