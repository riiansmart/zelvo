import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import TaskCreateModal from '../components/TaskCreateModal';
import { Task, TaskStatus } from '../types/task.types';
import { getTasks, deleteTask } from '../services/taskService';
import { formatDate, isOverdue } from '../utils/dateUtils';
import '../styles/task-page.css';
import '../styles/dashboard.css';

// Priority types for personal task management
type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

// Default category colors for when backend doesn't provide colors
const defaultCategoryColors = [
  '#4CAF50', // Green
  '#2196F3', // Blue  
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#F44336', // Red
  '#00BCD4', // Cyan
  '#8BC34A', // Light Green
  '#FF5722', // Deep Orange
  '#607D8B', // Blue Grey
  '#795548'  // Brown
];

// Function to get category color based on category name
const getCategoryColor = (categoryName?: string, categoryColor?: string): string => {
  if (categoryColor) return categoryColor;
  if (!categoryName) return '#6B7280'; // Default grey for "GENERAL"
  
  // Generate consistent color based on category name hash
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return defaultCategoryColors[Math.abs(hash) % defaultCategoryColors.length];
};

// Development Warning Component
interface DevelopmentWarningProps {
  isVisible: boolean;
  onClose: () => void;
}

const DevelopmentWarning: React.FC<DevelopmentWarningProps> = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="development-warning">
      <div className="development-warning-content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="warning-icon">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="17" r="1" fill="currentColor"/>
        </svg>
        <span className="warning-text">This feature is still being developed</span>
        <button className="warning-close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Custom Delete Confirmation Modal
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-confirmation-overlay" onClick={onCancel}>
      <div className="delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-confirmation-header">
          <h3 className="delete-confirmation-title">Delete Task</h3>
        </div>
        <div className="delete-confirmation-content">
          <p className="delete-confirmation-message">
            Are you sure you want to delete "<strong>{taskTitle}</strong>"?
          </p>
          <p className="delete-confirmation-warning">
            This action cannot be undone.
          </p>
        </div>
        <div className="delete-confirmation-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-delete" onClick={onConfirm}>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// Priority configuration with simple, intuitive urgency colors
const priorityConfig = {
  LOW: {
    label: 'Low',
    color: '#16A34A', // Green
    bgColor: '#F0FDF4' // Very light green background
  },
  MEDIUM: {
    label: 'Medium',
    color: '#CA8A04', // Yellow/Amber
    bgColor: '#FEFCE8' // Very light yellow background
  },
  HIGH: {
    label: 'High',
    color: '#DC2626', // Red
    bgColor: '#FEF2F2' // Very light red background
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const priority = priorityConfig[task.priority as Priority];
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Get category display info
  const categoryName = task.categoryName || 'GENERAL';
  const categoryColor = getCategoryColor(task.categoryName, task.categoryColor);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  };

  const handleMenuBlur = (e: React.FocusEvent) => {
    // Close menu when focus leaves the menu container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setMenuOpen(false);
    }
  };

  // Format due date and check if overdue
  const formatDueDate = (dueDate: string): string => {
    try {
      const date = new Date(dueDate);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'No date';
    }
  };

  const isDueDateOverdue = task.dueDate ? isOverdue(task.dueDate) : false;
  
  return (
    <div className="task-card">
      <div className="task-card-header">
        <div className="task-category">
          <div 
            className="category-dot" 
            style={{ backgroundColor: categoryColor }}
          ></div>
          <span className="category-text">{categoryName.toUpperCase()}</span>
        </div>
        <div className="task-menu-container" onBlur={handleMenuBlur} tabIndex={-1}>
          <button className="task-menu-btn" onClick={handleMenuClick}>
            <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
              <circle cx="2" cy="2" r="2" fill="#6B7280"/>
              <circle cx="8" cy="2" r="2" fill="#6B7280"/>
              <circle cx="14" cy="2" r="2" fill="#6B7280"/>
            </svg>
          </button>
          
          {/* Menu */}
          {menuOpen && (
            <div className="task-card-menu">
              <button 
                onClick={() => {
                  onEdit(task); 
                  setMenuOpen(false);
                }} 
                className="task-card-menu-item"
              >
                Edit
              </button>
              <button 
                onClick={() => {
                  onDelete(task); 
                  setMenuOpen(false);
                }} 
                className="task-card-menu-item task-card-menu-item-delete"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description || 'No description'}</p>

      {/* Bottom row with Priority and Due Date */}
      <div className="task-bottom-row">
        {/* Priority Indicator */}
        <div className="task-priority">
          <div 
            className="priority-badge"
            style={{ 
              backgroundColor: priority.bgColor,
              color: priority.color,
              border: `1px solid ${priority.color}20`
            }}
          >
            <span className="priority-label">{priority.label}</span>
          </div>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className={`task-due-date ${isDueDateOverdue ? 'overdue' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="due-date-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="due-date-text">{formatDueDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showDevelopmentWarning, setShowDevelopmentWarning] = useState(false);
  
  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Group tasks by status (use raw Task objects)
  const groupedTasks = {
    todo: tasks.filter(task => task.status === TaskStatus.TODO),
    inProgress: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
    done: tasks.filter(task => task.status === TaskStatus.DONE)
  };

  const handleAddTask = (column: string) => {
    if (column === 'todo') {
      setTaskBeingEdited(null);
      setShowModal(true);
    } else {
      // Show development warning for other columns
      setShowDevelopmentWarning(true);
    }
  };

  const handleColumnMenu = () => {
    setShowDevelopmentWarning(true);
  };

  const handleTaskCreated = async () => {
    // Refresh tasks after creation
    await fetchTasks();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTaskBeingEdited(null);
  };

  const handleEditTask = (task: Task) => {
    setTaskBeingEdited(task);
    setShowModal(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask(parseInt(taskToDelete.id as unknown as string));
      await fetchTasks();
      setShowDeleteConfirmation(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Failed to delete task', error);
      setShowDeleteConfirmation(false);
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  const handleCloseDevelopmentWarning = () => {
    setShowDevelopmentWarning(false);
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading tasks...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation - Same as Dashboard */}
      <Sidebar />

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Search + Icons Row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="search-container flex-1">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
            />
          </div>
          <ProfileDropdown />
        </div>

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="welcome-text">Tasks</h1>
            <p className="welcome-description">Organize and efficiently track your tasks.</p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="kanban-board">
          {/* To Do Column */}
          <div className="kanban-column">
            <div className="column-header">
              <h2 className="column-title">To do</h2>
              <div className="column-actions">
                <button 
                  className="add-task-btn"
                  onClick={() => handleAddTask('todo')}
                  aria-label="Add new task"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <button 
                  className="column-menu-btn" 
                  aria-label="Column menu"
                  onClick={handleColumnMenu}
                >
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                    <circle cx="2" cy="2" r="2" fill="currentColor"/>
                    <circle cx="8" cy="2" r="2" fill="currentColor"/>
                    <circle cx="14" cy="2" r="2" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="column-content">
              {groupedTasks.todo.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              ))}
              {groupedTasks.todo.length === 0 && (
                <div className="empty-state">
                  <p>No Tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="kanban-column">
            <div className="column-header">
              <h2 className="column-title">In progress</h2>
              <div className="column-actions">
                <button 
                  className="add-task-btn"
                  onClick={() => handleAddTask('inProgress')}
                  aria-label="Add new task"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <button 
                  className="column-menu-btn" 
                  aria-label="Column menu"
                  onClick={handleColumnMenu}
                >
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                    <circle cx="2" cy="2" r="2" fill="currentColor"/>
                    <circle cx="8" cy="2" r="2" fill="currentColor"/>
                    <circle cx="14" cy="2" r="2" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="column-content">
              {groupedTasks.inProgress.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              ))}
              {groupedTasks.inProgress.length === 0 && (
                <div className="empty-state">
                  <p>No Tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="kanban-column">
            <div className="column-header">
              <h2 className="column-title">Done</h2>
              <div className="column-actions">
                <button 
                  className="add-task-btn"
                  onClick={() => handleAddTask('done')}
                  aria-label="Add new task"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <button 
                  className="column-menu-btn" 
                  aria-label="Column menu"
                  onClick={handleColumnMenu}
                >
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                    <circle cx="2" cy="2" r="2" fill="currentColor"/>
                    <circle cx="8" cy="2" r="2" fill="currentColor"/>
                    <circle cx="14" cy="2" r="2" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="column-content">
              {groupedTasks.done.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              ))}
              {groupedTasks.done.length === 0 && (
                <div className="empty-state">
                  <p>No Tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Development Warning */}
      <DevelopmentWarning 
        isVisible={showDevelopmentWarning}
        onClose={handleCloseDevelopmentWarning}
      />

      {/* Task Create Modal */}
      <TaskCreateModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        onTaskSaved={handleTaskCreated}
        existingTask={taskBeingEdited}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        taskTitle={taskToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default TasksPage; 