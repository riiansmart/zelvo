/**
 * Collection of authentication helpers that wrap Zelvo back-end `/auth` endpoints.
 * Provides login, registration, and basic user retrieval.
 */

import api from './api';
import { LoginRequest, RegisterRequest, JwtResponse } from '../types/Auth';
import { User } from '../types/task.types';

// Define ApiResponse structure if not already globally available
// This should match your backend's ApiResponse DTO
interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
  // metadata?: any; // Add if your ApiResponse has metadata
}

// Send login credentials, receive token + user
export const loginUser = async (data: LoginRequest): Promise<ApiResponse<JwtResponse>> => {
  const response = await api.post<ApiResponse<JwtResponse>>('/auth/login', data);
  return response.data; // response.data is now correctly typed as ApiResponse<JwtResponse>
};

// Register a new user account
export const registerUser = async (data: RegisterRequest): Promise<void> => {
  await api.post('/auth/register', data);
};

// Get user information using token
export const getUserInfo = async (token: string): Promise<User> => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const response = await api.get('/auth/user');
  return response.data;
};