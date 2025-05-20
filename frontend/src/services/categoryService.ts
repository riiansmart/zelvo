// getCategories()

import api from './api';
import { Category } from '../types/category.types';

// Fetch all available task categories
export const getCategories = async (): Promise<Category[]> => {
  const token = localStorage.getItem('token');
  const response = await api.get('/v1/categories', {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Unwrap ApiResponse to get the actual list of categories
  return response.data.data;
};