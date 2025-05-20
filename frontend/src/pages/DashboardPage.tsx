/**
 * DashboardPage.tsx
 * Main dashboard interface for task management.
 * Features a responsive grid layout with filtering, sorting, and bulk actions.
 */

import { useState, useEffect } from 'react';
import { getTasks, deleteTask } from '../services/taskService';
import { useAuth } from '../hooks/useAuth';
import { Task, TaskStatus, TaskPriority } from '../types/task.types';
import { formatDate, isOverdue } from '../utils/dateUtils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUserInfo } from '../services/authService';

/**
 * DashboardPage Component
 * Main interface for task management with:
 * - Task list with sorting and filtering
 * - Search functionality
 * - Status and priority filters
 * - Bulk actions
 * - Task CRUD operations
 * 
 * @returns {JSX.Element} The dashboard page component
 */
const DashboardPage = () => {
  // Authentication and navigation
  const { token, login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Task state management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Filter state management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'STATUS' | 'PRIORITY' | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');

  /**
   * Handle OAuth redirect and user session setup
   * Checks for token in URL and fetches user info
   */
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && !user) {
      // First store the token
      getUserInfo(token)
        .then(userInfo => {
          console.log('User info received:', userInfo);
          login(token, userInfo);
        })
        .catch(error => {
          console.error('Failed to get user info:', error);
          navigate('/login', { replace: true });
        });
    }
  }, [searchParams, login, navigate, user]);

  /**
   * Load tasks on component mount
   * Fetches tasks from API when token is available
   */
  useEffect(() => {
    if (!token) return;
    
    setLoading(true);
    getTasks()
      .then(response => {
        console.log('Dashboard tasks response:', response);
        // Handle different response formats
        if (Array.isArray(response)) {
          setTasks(response);
        } else if (response && response.content) {
          setTasks(response.content);
        } else {
          console.error('Unexpected tasks response format:', response);
          setTasks([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again.');
        setTasks([]);
        setLoading(false);
      });
  }, [token]);

  /**
   * Handles task deletion
   * Confirms with user before deleting
   * @param {string} id - ID of task to delete
   */
  const handleDeleteTask = async (id: string) => {
    if (!token) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(Number(id));
        setTasks(tasks.filter(task => task.id !== id));
      } catch (err) {
        console.error('Failed to delete task:', err);
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  /**
   * Navigates to task edit page
   * @param {string} id - ID of task to edit
   */
  const handleEditTask = (id: string) => {
    navigate(`/tasks/${id}/edit`);
  };

  /**
   * Handles individual task selection
   * Toggles task selection state
   * @param {string} id - ID of task to select/deselect
   */
  const handleTaskSelect = (id: string) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter(taskId => taskId !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };

  /**
   * Handles select all checkbox
   * Toggles selection of all filtered tasks
   */
  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(task => task.id));
    }
  };

  /**
   * Filters tasks based on search term and active filters
   * Applies text search, status, and priority filters
   */
  const filteredTasks = tasks.filter(task => {
    // Text search filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    // Status filter
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h1 className="welcome-text">Welcome back</h1>
        <p className="welcome-description">Here's a list of your tasks for this month</p>
      </section>

      {/* Toolbar Section */}
      <div className="toolbar">
        {/* Search Input */}
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Filter tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="filter-options">
          <button 
            className={`filter-button ${activeFilter === 'STATUS' ? 'active' : ''}`}
            onClick={() => setActiveFilter('STATUS')}
          >
            <i className="fas fa-th-large"></i>
            Status
          </button>
          <button 
            className={`filter-button ${activeFilter === 'PRIORITY' ? 'active' : ''}`}
            onClick={() => setActiveFilter('PRIORITY')}
          >
            <i className="fas fa-list"></i>
            Priority
          </button>
          <button 
            className={`filter-button ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => {
              setActiveFilter('ALL');
              setStatusFilter('ALL');
              setPriorityFilter('ALL');
            }}
          >
            <i className="fas fa-columns"></i>
            All
          </button>
        </div>
      </div>

      {/* Status Filter Tags */}
      {activeFilter === 'STATUS' && (
        <div className="filter-tags">
          <button 
            className={`filter-tag ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All
          </button>
          <button 
            className={`filter-tag ${statusFilter === TaskStatus.TODO ? 'active' : ''}`}
            onClick={() => setStatusFilter(TaskStatus.TODO)}
          >
            To Do
          </button>
          <button 
            className={`filter-tag ${statusFilter === TaskStatus.DONE ? 'active' : ''}`}
            onClick={() => setStatusFilter(TaskStatus.DONE)}
          >
            Completed
          </button>
        </div>
      )}

      {/* Priority Filter Tags */}
      {activeFilter === 'PRIORITY' && (
        <div className="filter-tags">
          <button 
            className={`filter-tag ${priorityFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setPriorityFilter('ALL')}
          >
            All
          </button>
          <button 
            className={`filter-tag ${priorityFilter === TaskPriority.LOW ? 'active' : ''}`}
            onClick={() => setPriorityFilter(TaskPriority.LOW)}
          >
            Low
          </button>
          <button 
            className={`filter-tag ${priorityFilter === TaskPriority.MEDIUM ? 'active' : ''}`}
            onClick={() => setPriorityFilter(TaskPriority.MEDIUM)}
          >
            Medium
          </button>
          <button 
            className={`filter-tag ${priorityFilter === TaskPriority.HIGH ? 'active' : ''}`}
            onClick={() => setPriorityFilter(TaskPriority.HIGH)}
          >
            High
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Task List */}
      <div className="task-list">
        {/* List Header */}
        <div className="task-list-header">
          <div className="task-list-header-item task-header-checkbox">
            <input 
              type="checkbox" 
              className="task-checkbox" 
              id="select-all"
              checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
              onChange={handleSelectAll}
            />
          </div>
          <div className="task-list-header-item task-header-id sortable">#</div>
          <div className="task-list-header-item sortable">Title</div>
          <div className="task-list-header-item task-header-type sortable">Type</div>
          <div className="task-list-header-item sortable">Status</div>
          <div className="task-list-header-item sortable">Priority</div>
          <div className="task-list-header-item task-header-date sortable">Due Date</div>
          <div className="task-list-header-item task-header-actions">Actions</div>
        </div>
        
        {/* List Body */}
        <div className="task-list-body">
          {loading ? (
            <div className="loading-message">
              <i className="fas fa-spinner fa-spin"></i> Loading tasks...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-message">
              <i className="fas fa-tasks"></i>
              <p>No tasks found. Create a new task to get started!</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div className="task-item" key={task.id}>
                <div className="task-cell task-cell-checkbox">
                  <input 
                    type="checkbox" 
                    className="task-checkbox" 
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => handleTaskSelect(task.id)}
                  />
                </div>
                <div className="task-cell task-cell-id">
                  <span className="task-id">TASK-{task.id}</span>
                </div>
                <div className="task-cell">
                  <div 
                    className="task-title task-title-tooltip" 
                    data-tooltip={task.description || "No description provided"}
                  >
                    {task.title}
                  </div>
                </div>
                <div className="task-cell task-cell-type">
                  <span className="task-type">
                    <i className="fas fa-file-alt task-type-icon"></i>
                    {task.categoryId ? "Feature" : "Task"}
                  </span>
                </div>
                <div className="task-cell">
                  {task.completed ? (
                    <span className="status-pill status-done">
                      <i className="fas fa-check-circle"></i>
                      Done
                    </span>
                  ) : isOverdue(task.dueDate) ? (
                    <span className="status-pill status-in-progress">
                      <i className="fas fa-exclamation-circle"></i>
                      Overdue
                    </span>
                  ) : (
                    <span className="status-pill status-todo">
                      <i className="fas fa-circle-notch"></i>
                      Todo
                    </span>
                  )}
                </div>
                <div className="task-cell">
                  <span className={`priority-indicator priority-${task.priority.toLowerCase()}`}>
                    <span className={`priority-dot dot-${task.priority.toLowerCase()}`}></span>
                    {task.priority}
                  </span>
                </div>
                <div className="task-cell task-cell-date">
                  <span className={`task-due ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
                <div className="task-cell task-cell-actions">
                  <div className="action-buttons">
                    <button 
                      className="action-button edit-button"
                      onClick={() => handleEditTask(task.id)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-button delete-button"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pagination">
        <div className="page-info">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
        {/* We'll implement pagination later if needed */}
        <div className="page-controls">
          <button className="page-button disabled">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="page-button active">1</button>
          <button className="page-button disabled">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Add task button wrapper to push it down below content */}
      <div className="add-task-container">
        <button
          className="add-task-button glow-effect"
          onClick={() => navigate('/tasks/new')}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;