/**
 * NewTaskPage.tsx
 * Task creation interface with form validation and date-time selection.
 * Features a responsive form with Material-UI date picker integration.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../services/taskService';
import { useAuth } from '../hooks/useAuth';
import { Task, TaskPriority, TaskStatus } from '../types/task.types';
import { getCategories } from '../services/categoryService';
import { Category } from '../types/category.types.ts';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { TextField } from '@mui/material';

/**
 * NewTaskPage Component
 * Provides task creation interface with:
 * - Form validation
 * - Date-time selection
 * - Priority selection
 * - Category assignment
 * - Error handling
 * - Loading states
 * 
 * @returns {JSX.Element} The task creation page component
 */
const NewTaskPage = () => {
  // Authentication and navigation
  const { user } = useAuth();
  const navigate = useNavigate();

  // Component state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form state initialization
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    completed: false,
    userId: user?.id || 0,
  });

  // Local state for Material-UI date-time picker
  const [dueDateValue, setDueDateValue] = useState<Date | null>(
    task.dueDate ? new Date(task.dueDate) : null
  );

  /**
   * Load categories on component mount
   * Fetches available categories for task assignment
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  /**
   * Handles form field changes
   * Supports different input types:
   * - Text inputs
   * - Checkboxes
   * - Select dropdowns
   * 
   * @param {React.ChangeEvent} e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setTask({ ...task, [name]: checkbox.checked });
    }
    // Handle category select - parse id to number
    else if (name === 'categoryId') {
      setTask({ ...task, categoryId: Number(value) });
    }
    // Handle other inputs
    else {
      setTask({ ...task, [name]: value });
    }
  };

  /**
   * Handles form submission
   * - Validates required fields
   * - Formats date for backend
   * - Creates task
   * - Handles success/error states
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!task.title) {
      setError('Title is required');
      return;
    }
    
    if (!task.dueDate) {
      setError('Due date is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Format date for backend (YYYY-MM-DD)
      const formattedTask = {
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : undefined
      };
      
      // Create task with optional category
      await createTask(formattedTask);
      
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="new-task-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Create New Task</h1>
        <p className="page-description">Fill out the details below to create a new task</p>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Task Creation Form */}
      <div className="task-form-container">
        <form onSubmit={handleSubmit} className="task-form cyberpunk-form">
          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          {/* Due Date and Priority Row */}
          <div className="form-row">
            {/* Due Date Picker */}
            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">Due Date & Time</label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDateTimePicker
                  format="MM/dd/yyyy hh:mm a"
                  ampm={true}
                  value={dueDateValue}
                  enableAccessibleFieldDOMStructure={false}
                  onChange={(date) => {
                    setDueDateValue(date as Date);
                    setTask({ ...task, dueDate: (date as Date).toISOString() });
                  }}
                  slots={{
                    textField: TextField
                  }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      size: "small",
                      className: "form-input mui-datetime"
                    }
                  }}
                />
              </LocalizationProvider>
            </div>

            {/* Priority Select */}
            <div className="form-group">
              <label htmlFor="priority" className="form-label">Priority</label>
              <select
                id="priority"
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
              </select>
            </div>
          </div>

          {/* Category Select */}
          <div className="form-group">
            <label htmlFor="categoryId" className="form-label">Category (Optional)</label>
            <select
              id="categoryId"
              name="categoryId"
              value={task.categoryId || ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">None</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            {/* Cancel Button */}
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskPage; 