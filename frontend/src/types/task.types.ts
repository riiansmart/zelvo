/**
 * task.types.ts
 * Type definitions for tasks and related enums.
 */

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  status: TaskStatus
  priority: TaskPriority
  completed: boolean
  userId: number
  categoryId?: number
  createdAt?: string
  updatedAt?: string
  storyPoints?: number
  assignee?: string
  labels?: string[]
  dependencies?: string[]
  acceptanceCriteria?: string[]
  activity?: ActivityLog[]
}

export interface Category {
  id: number
  name: string
  description?: string
  color?: string
  createdAt?: string
  updatedAt?: string
  userId?: number
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export interface ActivityLog {
  user: string;
  date: string;
  comment: string;
}
