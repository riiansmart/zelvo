// Returns current user/token, login/logout

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Simple re-export for cleaner imports in components
export const useAuth = () => useContext(AuthContext);