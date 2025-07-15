/**
 * Get the start of the week (Monday) for a given date
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getEndOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get the current week range (Monday to Sunday)
 */
export function getCurrentWeekRange(): { start: Date; end: Date } {
  const today = new Date();
  return {
    start: getStartOfWeek(today),
    end: getEndOfWeek(today)
  };
}

/**
 * Check if a date falls within a week range
 */
export function isDateInWeekRange(date: Date, weekRange: { start: Date; end: Date }): boolean {
  const dateToCheck = new Date(date);
  return dateToCheck >= weekRange.start && dateToCheck <= weekRange.end;
}

/**
 * Parse date string in MM/DD/YYYY format
 */
export function parseDate(dateString: string): Date {
  const [month, day, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Parse date string in MM/DD/YYYY HH:MM AM/PM format
 */
export function parseDateTime(dateTimeString: string): Date {
  return new Date(dateTimeString);
}

/**
 * Format date as MM/DD/YYYY
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format date range for display
 */
export function formatDateRange(start: Date, end: Date): string {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

/**
 * Get week number for a date
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
} 