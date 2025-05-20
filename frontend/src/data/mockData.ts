/**
 * mockData.ts
 * Mock data for development and testing purposes
 */

import { Task, TaskStatus, TaskPriority } from '../types/task.types'
import { Category } from '../types/category.types'

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Frontend',
    description: 'Frontend development tasks',
    color: '#3B82F6', // blue
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z',
    userId: 1
  },
  {
    id: 2,
    name: 'Backend',
    description: 'Backend development tasks',
    color: '#10B981', // green
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z',
    userId: 1
  },
  {
    id: 3,
    name: 'Design',
    description: 'UI/UX design tasks',
    color: '#8B5CF6', // purple
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z',
    userId: 1
  }
]

export const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    title: 'Setup Project Infrastructure',
    description: 'Initialize project with React, Vite, and TailwindCSS. Set up development environment and CI/CD pipeline.',
    status: TaskStatus.DONE,
    priority: TaskPriority.HIGH,
    dueDate: '2024-03-20',
    completed: true,
    userId: 1,
    categoryId: 1,
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-20T16:30:00.000Z'
  },
  {
    id: 'TASK-002',
    title: 'Design System Implementation',
    description: 'Create reusable components following VSCode design patterns. Implement dark theme support.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: '2024-03-25',
    completed: false,
    userId: 1,
    categoryId: 3,
    createdAt: '2024-03-18T09:15:00.000Z',
    updatedAt: '2024-03-21T14:20:00.000Z'
  },
  {
    id: 'TASK-003',
    title: 'Task Management API',
    description: 'Implement REST API endpoints for task CRUD operations with proper validation and error handling.',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: '2024-03-23',
    completed: false,
    userId: 1,
    categoryId: 2,
    createdAt: '2024-03-17T10:30:00.000Z',
    updatedAt: '2024-03-21T11:45:00.000Z'
  },
  {
    id: 'TASK-004',
    title: 'Timeline Component',
    description: 'Create interactive timeline view for task visualization with drag-and-drop support.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    dueDate: '2024-03-24',
    completed: false,
    userId: 1,
    categoryId: 1,
    createdAt: '2024-03-19T13:20:00.000Z',
    updatedAt: '2024-03-21T09:15:00.000Z'
  },
  {
    id: 'TASK-005',
    title: 'User Authentication',
    description: 'Implement user authentication and authorization using JWT tokens.',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    dueDate: '2024-03-27',
    completed: false,
    userId: 1,
    categoryId: 2,
    createdAt: '2024-03-20T11:00:00.000Z',
    updatedAt: '2024-03-21T11:00:00.000Z'
  }
]

// Mock user data
export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  }
] 