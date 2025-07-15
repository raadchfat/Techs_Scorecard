/**
 * Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format count values
 */
export function formatCount(count: number): string {
  return `${count} ${count === 1 ? 'job' : 'jobs'}`;
}

/**
 * Parse currency string to number
 */
export function parseCurrency(currencyString: string): number {
  // Remove $ and commas, then parse
  const cleaned = currencyString.replace(/[$,]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Parse percentage string to number
 */
export function parsePercentage(percentageString: string): number {
  // Remove % and spaces, then parse
  const cleaned = percentageString.replace(/[%\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Parse time string to minutes
 */
export function parseTimeToMinutes(timeString: string): number {
  // Parse format like "4h 48m (288 mins)" or "0h 0m (0 mins)"
  const match = timeString.match(/\((\d+)\s*mins\)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Get color class based on KPI performance
 */
export function getKPIColorClass(value: number, thresholds: { good: number; warning: number }): string {
  if (value >= thresholds.good) return 'text-success-600';
  if (value >= thresholds.warning) return 'text-warning-600';
  return 'text-danger-600';
}

/**
 * Get background color class based on KPI performance
 */
export function getKPIBgColorClass(value: number, thresholds: { good: number; warning: number }): string {
  if (value >= thresholds.good) return 'bg-success-50';
  if (value >= thresholds.warning) return 'bg-warning-50';
  return 'bg-danger-50';
}

/**
 * Normalize technician names for consistent matching
 */
export function normalizeTechnicianName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Check if line item matches service category
 */
export function matchesServiceCategory(lineItem: string, keywords: readonly string[]): boolean {
  const normalizedLineItem = lineItem.toLowerCase();
  return keywords.some(keyword => normalizedLineItem.includes(keyword.toLowerCase()));
} 