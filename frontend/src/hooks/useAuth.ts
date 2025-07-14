/**
 * React hook that exposes Zelvo authentication context values (user, token, login, logout).
 * Simplifies consumption of `AuthContext` across the component tree.
 *
 * @example
 * const { user, login, logout } = useAuth();
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Simple re-export for cleaner imports in components
export const useAuth = () => useContext(AuthContext);