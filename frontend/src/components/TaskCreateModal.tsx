import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TaskPriority, TaskStatus } from '../types/task.types';
import { Category } from '../types/category.types';
import { createTask } from '../services/taskService';
import { getCategories } from '../services/categoryService';
import { Task } from '../types/task.types';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskSaved: () => void; // callback for both create & update
  existingTask?: Task | null;
}

const TaskCreateModal: React.FC<TaskCreateModalProps> = ({ isOpen, onClose, onTaskSaved, existingTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();

      if (existingTask) {
        // Prefill form fields
        setTitle(existingTask.title);
        setDescription(existingTask.description ?? '');
        setDueDate(existingTask.dueDate?.split('T')[0] ?? '');
        setPriority(existingTask.priority as TaskPriority);
        setCategoryId(existingTask.categoryId);
      } else {
        // Reset form for create mode
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority(TaskPriority.MEDIUM);
        setCategoryId(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, existingTask]);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (existingTask) {
        // EDIT MODE
        const { updateTask } = await import('../services/taskService');
        const payload = {
          title: title.trim(),
          description: description.trim() || undefined,
          dueDate,
          priority,
          completed: existingTask.completed || false,
          categoryId: categoryId || undefined,
          status: existingTask.status, // Preserve the existing status
        };
        await updateTask(parseInt(existingTask.id as unknown as string), payload);
      } else {
        // CREATE MODE
        const newTask = {
          title: title.trim(),
          description: description.trim() || undefined,
          dueDate,
          priority,
          status: TaskStatus.TODO,
          completed: false,
          categoryId: categoryId || undefined,
        };

        await createTask(newTask);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority(TaskPriority.MEDIUM);
      setCategoryId(undefined);
      
      onTaskSaved();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-create-modal-overlay" onClick={handleOverlayClick}>
      <div className="task-create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-create-modal-header">
          <h2 className="task-create-modal-title">{existingTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button 
            className="task-create-modal-close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-create-modal-form">
          {error && (
            <div className="task-create-modal-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Task Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">
              Due Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="form-select"
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
              className="form-select"
            >
              <option value="">Select category (optional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="task-create-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (existingTask ? 'Updating...' : 'Creating...') : existingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateModal; 