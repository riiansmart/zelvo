import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, updateTask } from '../services/taskService';
import { getCategories } from '../services/categoryService';
import { useAuth } from '../hooks/useAuth';
import { Task, TaskPriority } from '../types/task.types';
import { Category } from '../types/category.types';

const EditTaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM' as TaskPriority,
    completed: false,
    userId: user?.id || 0,
    categoryId: undefined,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    getTaskById(Number(id))
      .then(fetched => {
        setTask({
          id: fetched.id,
          title: fetched.title,
          description: fetched.description,
          dueDate: fetched.dueDate,
          priority: fetched.priority,
          completed: fetched.completed,
          userId: fetched.userId,
          categoryId: fetched.categoryId,
        });
      })
      .catch(() => setError('Failed to load task'))
      .finally(() => setLoading(false));
  }, [id, token]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setTask({ ...task, [name]: checked });
    }
    // Select categoryId: parse to number
    else if (name === 'categoryId') {
      setTask({ ...task, categoryId: Number(value) });
    }
    // Other inputs
    else {
      setTask({ ...task, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (id) {
        await updateTask(Number(id), task);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading task...</p>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-task-page">
      <div className="page-header">
        <h1 className="page-title">Edit Task</h1>
        <p className="page-description">Modify the details below to update your task</p>
      </div>
      <div className="task-form-container">
        <form onSubmit={handleSubmit} className="task-form cyberpunk-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
              className="form-textarea"
              rows={4}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority" className="form-label">Priority</label>
              <select
                id="priority"
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
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
          <div className="form-group">
            <label htmlFor="completed" className="form-label">Completed</label>
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={task.completed}
              onChange={handleChange}
              className="form-checkbox"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin" /> Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPage; 