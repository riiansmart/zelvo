/**
 * Service layer for CRUD operations on tasks against the Zelvo REST API.
 */

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
  
  // Format date to match backend LocalDate format (yyyy-MM-dd)
  let formattedDueDate = task.dueDate;
  if (task.dueDate) {
    // Extract just the date part (yyyy-MM-dd) from datetime string
    formattedDueDate = task.dueDate.split('T')[0];
  }
  
  const payload = {
    ...task,
    dueDate: formattedDueDate
  };
  
  const response = await api.post('/tasks', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Unwrap ApiResponse to get the actual Task
  return response.data.data;
};

// Update an existing task
export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const token = localStorage.getItem('token');
  
  // Format date to match backend LocalDate format (yyyy-MM-dd)
  let formattedDueDate = task.dueDate;
  if (task.dueDate) {
    // Extract just the date part (yyyy-MM-dd) from datetime string
    formattedDueDate = task.dueDate.split('T')[0];
  }
  
  // Prepare payload matching TaskRequest DTO
  const payload = {
    title: task.title,
    description: task.description,
    dueDate: formattedDueDate,
    priority: task.priority,
    status: task.status,
    completed: task.completed,
    categoryId: task.categoryId ?? null,
  };
  
  console.log(`Sending PUT request to /tasks/${id} with payload:`, JSON.stringify(payload, null, 2));
  
  try {
    const response = await api.put(`/tasks/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Update task ${id} response:`, response.data);
    // Unwrap ApiResponse to get the actual Task
    return response.data.data;
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token')
  await api.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
