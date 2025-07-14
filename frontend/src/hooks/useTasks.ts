/**
 * Fetches the current user’s tasks from the Zelvo API and tracks loading / error state.
 * Re-validates automatically when the auth token changes.
 */

import { useEffect, useState } from 'react';
import { Task } from '../types/task.types';
import { getTasks } from '../services/taskService';
import { useAuth } from './useAuth';

// Hook to fetch and manage tasks for authenticated user
export const useTasks = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getTasks()
      .then((data) => setTasks(data))
      .catch(() => setError('Failed to fetch tasks'))
      .finally(() => setLoading(false));
  }, [token]);

  return { tasks, loading, error };
};