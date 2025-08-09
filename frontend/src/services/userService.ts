/**
 * Helper functions for interacting with the Zelvo `/users` endpoints (profile fetch/update).
 */

import api from './api';
import { User } from '../types/task.types';

// Match backend ApiResponse shape
interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

// Matches backend conditional response when email changes
export interface ProfileUpdateResponse {
  user: User;
  token?: string;
}

// Get profile data for the logged-in user
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/users/profile');
  return response.data.data;
};

// Update profile info (e.g., name/email)
export const updateProfile = async (
  data: Partial<User>
): Promise<{ user: User; token?: string }> => {
  const response = await api.put<ApiResponse<User | ProfileUpdateResponse>>('/users/profile', data);
  const payload = response.data.data as User | ProfileUpdateResponse;
  if (payload && typeof (payload as any).user === 'object') {
    const pr = payload as ProfileUpdateResponse;
    return { user: pr.user, token: pr.token };
  }
  return { user: payload as User };
};