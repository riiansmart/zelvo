// getTasks(), createTask(), updateTask(), deleteTask()

import api from './api';
import { Task } from '../types/task.types';

// Fetch all tasks for the current user
export const getTasks = async () => {
  const token = localStorage.getItem('token')

  const response = await api.get('/v1/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  console.log('Raw tasks response:', response);
  
  // Handle paginated response with content array
  if (response.data && response.data.content) {
    return response.data.content;
  }
  
  // Fallback for other response formats
  return response.data && response.data.data ? response.data.data : response.data;
}

// Get a single task by ID
export const getTaskById = async (id: number): Promise<Task> => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/v1/tasks/${id}`, {
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
  const response = await api.post('/v1/tasks', task, {
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
  const response = await api.put(`/v1/tasks/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Unwrap ApiResponse to get the actual Task
  return response.data.data;
};

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token')
  await api.delete(`/v1/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
