/**
 * Client-side guard that redirects unauthenticated users to the landing page.
 * Attach inside protected route components to enforce Zelvo session presence.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

// Redirects to login page if user is not authenticated
export const useProtectedRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/', { replace: true });
  }, [user, navigate]);
};