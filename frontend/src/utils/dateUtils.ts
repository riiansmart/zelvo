/**
 * dateUtils.ts
 * Utility functions for date formatting and validation.
 */

/**
 * Format a date to a readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Check if a date is overdue (before current date)
 * @param date - Date to check
 * @returns True if date is overdue
 */
export function isOverdue(date: Date | string): boolean {
  const d = new Date(date)
  const now = new Date()
  return d < now
}

/**
 * Convert a date to ISO string format (YYYY-MM-DD)
 * @param date - Date to format
 * @returns ISO formatted date string
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Parse a date string to Date object
 * @param dateStr - Date string to parse
 * @returns Parsed Date object or null if invalid
 */
export function parseDate(dateStr: string): Date | null {
  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? null : parsed
} 