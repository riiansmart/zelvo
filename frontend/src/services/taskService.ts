// getTasks(), createTask(), updateTask(), deleteTask()

import api from './api';
import { Task } from '../types/task.types';

// Fetch all tasks for the current user
export const getTasks = async () => {
  const token = localStorage.getItem('token')

  const response = await api.get('/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  console.log('Raw tasks response:', response);

  /*
   * Response shapes we handle:
   * 1) Spring Page wrapped in our ApiResponse
   *    { status: 'success', data: { content: [...] } }
   * 2) Simple list wrapped in ApiResponse
   *    { status: 'success', data: [...] }
   * 3) Bare array (unlikely but fall-back)
   */

  const apiResponse = response.data;

  if (Array.isArray(apiResponse)) {
    return apiResponse; // Bare array case
  }

  if (apiResponse && Array.isArray(apiResponse.content)) {
    // Backend returned Page directly (no ApiResponse wrapper)
    return apiResponse.content;
  }

  if (apiResponse && apiResponse.data) {
    const inner = apiResponse.data;
    if (Array.isArray(inner)) {
      return inner; // ApiResponse with list data
    }
    if (inner && Array.isArray(inner.content)) {
      // ApiResponse with Page data
      return inner.content;
    }
  }

  // Fallback – return empty list to prevent runtime errors
  return [];
}

// Get a single task by ID
export const getTaskById = async (id: number): Promise<Task> => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Unwrap ApiResponse and map to front-end Task shape
  const dto = response.data.data;
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    // Only date part for date input
    dueDate: dto.dueDate ? dto.dueDate.split('T')[0] : '',
    status: dto.status,
    priority: dto.priority,
    completed: dto.completed,
    userId: dto.user ? dto.user.id : 0,
    categoryId: dto.category ? dto.category.id : undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
};

// Create a new task
export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const token = localStorage.getItem('token');
  const response = await api.post('/tasks', task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Unwrap ApiResponse to get the actual Task
  return response.data.data;
};

// Update an existing task
export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const token = localStorage.getItem('token');
  // Prepare payload matching TaskRequest DTO
  const payload = {
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    completed: task.completed,
    categoryId: task.categoryId ?? null,
  };
  const response = await api.put(`/tasks/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Unwrap ApiResponse to get the actual Task
  return response.data.data;
};

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token')
  await api.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
