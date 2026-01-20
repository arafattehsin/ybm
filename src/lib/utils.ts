import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for conditional class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Slugify string
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

