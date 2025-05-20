// getProfile(), updateProfile()

import api from './api';
import { User } from '../types/task.types';

// Get profile data for the logged-in user
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Update profile info (e.g., name/email)
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put('/users/profile', data);
  return response.data;
};