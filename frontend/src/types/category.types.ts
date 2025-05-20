/**
 * Type definitions for task categories
 */

export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

export type CategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>; 