// View/edit single task by ID

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Task } from '../types/task.types';
import { getTaskById } from '../services/taskService';
import { useAuth } from '../hooks/useAuth';

const TaskDetailsPage = () => {
  const { id } = useParams<{ id: string }>(); // Get task ID from URL
  const { token } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch task details on mount
  useEffect(() => {
    if (!token || !id) return;
    getTaskById(Number(id))
      .then(setTask)
      .catch(() => setError('Failed to load task'));
  }, [id, token]);

  if (error) return <p>{error}</p>;
  if (!task) return <p>Loading task...</p>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Due: {task.dueDate}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
    </div>
  );
};

export default TaskDetailsPage;