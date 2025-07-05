import { User } from "./task.types";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  refreshToken: string;
  user: User; // Assuming User type is imported or available
} 