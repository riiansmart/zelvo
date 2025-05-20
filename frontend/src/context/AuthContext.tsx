// React context for login state

import { createContext, useContext } from 'react';
import { User } from '../types/task.types';

// AuthContext shape
type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

// Default empty context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

// Custom hook for easy access to context
export const useAuth = () => useContext(AuthContext);