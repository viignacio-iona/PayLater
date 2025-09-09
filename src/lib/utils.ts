import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts a value to a number and formats it to 2 decimal places
 * Handles both string and number inputs from Prisma decimal fields
 */
export function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return numValue.toFixed(2)
}
