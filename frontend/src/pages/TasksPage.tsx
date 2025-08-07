/**
 * TasksPage presents a kanban-style overview of all tasks with filtering, CRUD actions,
 * and drag-and-drop style interactions (WIP) for Zelvo.
 */
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import TaskCreateModal from '../components/TaskCreateModal';
import { Task, TaskStatus } from '../types/task.types';
import { getTasks, deleteTask, updateTask } from '../services/taskService';
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
            data-priority={task.priority}
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

// Task Transfer Modal Component (To Do ↔ In Progress)
interface TaskTransferModalProps {
  isOpen: boolean;
  todoTasks: Task[];
  inProgressTasks: Task[];
  onClose: () => void;
  onTasksTransferred: () => void;
}

// Done Transfer Modal Component (In Progress ↔ Done)
interface DoneTransferModalProps {
  isOpen: boolean;
  inProgressTasks: Task[];
  doneTasks: Task[];
  onClose: () => void;
  onTasksTransferred: () => void;
}

const TaskTransferModal: React.FC<TaskTransferModalProps> = ({
  isOpen,
  todoTasks,
  inProgressTasks,
  onClose,
  onTasksTransferred
}) => {
  const [selectedTodoTasks, setSelectedTodoTasks] = useState<Set<string>>(new Set());
  const [selectedInProgressTasks, setSelectedInProgressTasks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTodoTasks(new Set());
      setSelectedInProgressTasks(new Set());
    }
  }, [isOpen]);

  const handleTodoTaskSelect = (taskId: string) => {
    setSelectedTodoTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleInProgressTaskSelect = (taskId: string) => {
    setSelectedInProgressTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const moveTasksToInProgress = async () => {
    if (selectedTodoTasks.size === 0) return;
    
    setLoading(true);
    try {
      // Move selected todo tasks to in progress
      const promises = Array.from(selectedTodoTasks).map(async taskId => {
        const task = todoTasks.find(t => t.id === taskId);
        if (task) {
          console.log('Updating task:', task.id, 'with status:', TaskStatus.IN_PROGRESS);
          // Only send the necessary fields to avoid conflicts
          const updateData = {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: TaskStatus.IN_PROGRESS,
            completed: task.completed,
            categoryId: task.categoryId
          };
          console.log('Update payload:', updateData);
          return updateTask(parseInt(taskId), updateData);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setSelectedTodoTasks(new Set());
      onTasksTransferred();
    } catch (error: any) {
      console.error('Failed to move tasks to in progress:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const moveTasksToTodo = async () => {
    if (selectedInProgressTasks.size === 0) return;
    
    setLoading(true);
    try {
      // Move selected in progress tasks back to todo
      const promises = Array.from(selectedInProgressTasks).map(async taskId => {
        const task = inProgressTasks.find(t => t.id === taskId);
        if (task) {
          console.log('Updating task:', task.id, 'with status:', TaskStatus.TODO);
          // Only send the necessary fields to avoid conflicts
          const updateData = {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: TaskStatus.TODO,
            completed: task.completed,
            categoryId: task.categoryId
          };
          console.log('Update payload:', updateData);
          return updateTask(parseInt(taskId), updateData);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setSelectedInProgressTasks(new Set());
      onTasksTransferred();
    } catch (error: any) {
      console.error('Failed to move tasks to todo:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-transfer-modal-overlay" onClick={handleClose}>
      <div className="task-transfer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-transfer-modal-header">
          <h3 className="task-transfer-modal-title">Move Tasks</h3>
          <button className="task-transfer-modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        
        <div className="task-transfer-content">
          {/* Left Column - To Do Tasks */}
          <div className="transfer-column">
            <div className="transfer-column-header">
              <h4 className="transfer-column-title">To Do</h4>
              <span className="transfer-column-count">({todoTasks.length})</span>
            </div>
            <div className="transfer-task-list">
              {todoTasks.length === 0 ? (
                <div className="transfer-empty-state">No tasks available</div>
              ) : (
                todoTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`transfer-task-item ${selectedTodoTasks.has(task.id as string) ? 'selected' : ''}`}
                    onClick={() => handleTodoTaskSelect(task.id as string)}
                  >
                    <div className="transfer-task-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedTodoTasks.has(task.id as string)}
                        onChange={() => handleTodoTaskSelect(task.id as string)}
                      />
                    </div>
                    <div className="transfer-task-content">
                      <h5 className="transfer-task-title">{task.title}</h5>
                      <p className="transfer-task-description">{task.description || 'No description'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Center Arrow Controls */}
          <div className="transfer-controls">
            <button
              className="transfer-btn transfer-btn-right"
              onClick={moveTasksToInProgress}
              disabled={selectedTodoTasks.size === 0 || loading}
              title={`Move ${selectedTodoTasks.size} task(s) to In Progress`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {selectedTodoTasks.size > 0 && (
                <span className="transfer-count">{selectedTodoTasks.size}</span>
              )}
            </button>
            
            <button
              className="transfer-btn transfer-btn-left"
              onClick={moveTasksToTodo}
              disabled={selectedInProgressTasks.size === 0 || loading}
              title={`Move ${selectedInProgressTasks.size} task(s) to To Do`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {selectedInProgressTasks.size > 0 && (
                <span className="transfer-count">{selectedInProgressTasks.size}</span>
              )}
            </button>
          </div>

          {/* Right Column - In Progress Tasks */}
          <div className="transfer-column">
            <div className="transfer-column-header">
              <h4 className="transfer-column-title">In Progress</h4>
              <span className="transfer-column-count">({inProgressTasks.length})</span>
            </div>
            <div className="transfer-task-list">
              {inProgressTasks.length === 0 ? (
                <div className="transfer-empty-state">No tasks available</div>
              ) : (
                inProgressTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`transfer-task-item ${selectedInProgressTasks.has(task.id as string) ? 'selected' : ''}`}
                    onClick={() => handleInProgressTaskSelect(task.id as string)}
                  >
                    <div className="transfer-task-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedInProgressTasks.has(task.id as string)}
                        onChange={() => handleInProgressTaskSelect(task.id as string)}
                      />
                    </div>
                    <div className="transfer-task-content">
                      <h5 className="transfer-task-title">{task.title}</h5>
                      <p className="transfer-task-description">{task.description || 'No description'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="task-transfer-modal-footer">
          <div className="transfer-summary">
            {(selectedTodoTasks.size > 0 || selectedInProgressTasks.size > 0) && (
              <span className="transfer-summary-text">
                {selectedTodoTasks.size > 0 && `${selectedTodoTasks.size} from To Do`}
                {selectedTodoTasks.size > 0 && selectedInProgressTasks.size > 0 && ', '}
                {selectedInProgressTasks.size > 0 && `${selectedInProgressTasks.size} from In Progress`}
                {' '}selected
              </span>
            )}
          </div>
          <button className="btn-secondary" onClick={handleClose} disabled={loading}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DoneTransferModal: React.FC<DoneTransferModalProps> = ({
  isOpen,
  inProgressTasks,
  doneTasks,
  onClose,
  onTasksTransferred
}) => {
  const [selectedInProgressTasks, setSelectedInProgressTasks] = useState<Set<string>>(new Set());
  const [selectedDoneTasks, setSelectedDoneTasks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedInProgressTasks(new Set());
      setSelectedDoneTasks(new Set());
    }
  }, [isOpen]);

  const handleInProgressTaskSelect = (taskId: string) => {
    setSelectedInProgressTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleDoneTaskSelect = (taskId: string) => {
    setSelectedDoneTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const moveTasksToDone = async () => {
    if (selectedInProgressTasks.size === 0) return;
    
    setLoading(true);
    try {
      // Move selected in progress tasks to done
      const promises = Array.from(selectedInProgressTasks).map(async taskId => {
        const task = inProgressTasks.find(t => t.id === taskId);
        if (task) {
          console.log('Updating task:', task.id, 'with status:', TaskStatus.DONE);
          // Only send the necessary fields to avoid conflicts
          const updateData = {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: TaskStatus.DONE,
            completed: true, // Mark as completed when moving to done
            categoryId: task.categoryId
          };
          console.log('Update payload:', updateData);
          return updateTask(parseInt(taskId), updateData);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setSelectedInProgressTasks(new Set());
      onTasksTransferred();
    } catch (error: any) {
      console.error('Failed to move tasks to done:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const moveTasksToInProgress = async () => {
    if (selectedDoneTasks.size === 0) return;
    
    setLoading(true);
    try {
      // Move selected done tasks back to in progress
      const promises = Array.from(selectedDoneTasks).map(async taskId => {
        const task = doneTasks.find(t => t.id === taskId);
        if (task) {
          console.log('Updating task:', task.id, 'with status:', TaskStatus.IN_PROGRESS);
          // Only send the necessary fields to avoid conflicts
          const updateData = {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: TaskStatus.IN_PROGRESS,
            completed: false, // Mark as incomplete when moving back to in progress
            categoryId: task.categoryId
          };
          console.log('Update payload:', updateData);
          return updateTask(parseInt(taskId), updateData);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setSelectedDoneTasks(new Set());
      onTasksTransferred();
    } catch (error: any) {
      console.error('Failed to move tasks to in progress:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-transfer-modal-overlay" onClick={handleClose}>
      <div className="task-transfer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-transfer-modal-header">
          <h3 className="task-transfer-modal-title">Complete Tasks</h3>
          <button className="task-transfer-modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        
        <div className="task-transfer-content">
          {/* Left Column - In Progress Tasks */}
          <div className="transfer-column">
            <div className="transfer-column-header">
              <h4 className="transfer-column-title">In Progress</h4>
              <span className="transfer-column-count">({inProgressTasks.length})</span>
            </div>
            <div className="transfer-task-list">
              {inProgressTasks.length === 0 ? (
                <div className="transfer-empty-state">No tasks available</div>
              ) : (
                inProgressTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`transfer-task-item ${selectedInProgressTasks.has(task.id as string) ? 'selected' : ''}`}
                    onClick={() => handleInProgressTaskSelect(task.id as string)}
                  >
                    <div className="transfer-task-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedInProgressTasks.has(task.id as string)}
                        onChange={() => handleInProgressTaskSelect(task.id as string)}
                      />
                    </div>
                    <div className="transfer-task-content">
                      <h5 className="transfer-task-title">{task.title}</h5>
                      <p className="transfer-task-description">{task.description || 'No description'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Center Arrow Controls */}
          <div className="transfer-controls">
            <button
              className="transfer-btn transfer-btn-right"
              onClick={moveTasksToDone}
              disabled={selectedInProgressTasks.size === 0 || loading}
              title={`Mark ${selectedInProgressTasks.size} task(s) as done`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {selectedInProgressTasks.size > 0 && (
                <span className="transfer-count">{selectedInProgressTasks.size}</span>
              )}
            </button>
            
            <button
              className="transfer-btn transfer-btn-left"
              onClick={moveTasksToInProgress}
              disabled={selectedDoneTasks.size === 0 || loading}
              title={`Move ${selectedDoneTasks.size} task(s) back to In Progress`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {selectedDoneTasks.size > 0 && (
                <span className="transfer-count">{selectedDoneTasks.size}</span>
              )}
            </button>
          </div>

          {/* Right Column - Done Tasks */}
          <div className="transfer-column">
            <div className="transfer-column-header">
              <h4 className="transfer-column-title">Done</h4>
              <span className="transfer-column-count">({doneTasks.length})</span>
            </div>
            <div className="transfer-task-list">
              {doneTasks.length === 0 ? (
                <div className="transfer-empty-state">No tasks available</div>
              ) : (
                doneTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`transfer-task-item ${selectedDoneTasks.has(task.id as string) ? 'selected' : ''}`}
                    onClick={() => handleDoneTaskSelect(task.id as string)}
                  >
                    <div className="transfer-task-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedDoneTasks.has(task.id as string)}
                        onChange={() => handleDoneTaskSelect(task.id as string)}
                      />
                    </div>
                    <div className="transfer-task-content">
                      <h5 className="transfer-task-title">{task.title}</h5>
                      <p className="transfer-task-description">{task.description || 'No description'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="task-transfer-modal-footer">
          <div className="transfer-summary">
            {(selectedInProgressTasks.size > 0 || selectedDoneTasks.size > 0) && (
              <span className="transfer-summary-text">
                {selectedInProgressTasks.size > 0 && `${selectedInProgressTasks.size} from In Progress`}
                {selectedInProgressTasks.size > 0 && selectedDoneTasks.size > 0 && ', '}
                {selectedDoneTasks.size > 0 && `${selectedDoneTasks.size} from Done`}
                {' '}selected
              </span>
            )}
          </div>
          <button className="btn-secondary" onClick={handleClose} disabled={loading}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Sorting Menu Component
interface SortingMenuProps {
  isOpen: boolean;
  currentSort: SortOption;
  column: 'todo' | 'inProgress' | 'done';
  onSortSelect: (column: 'todo' | 'inProgress' | 'done', sortOption: SortOption) => void;
  onBlur: (column: 'todo' | 'inProgress' | 'done', e: React.FocusEvent) => void;
}

const SortingMenu: React.FC<SortingMenuProps> = ({ 
  isOpen, 
  currentSort, 
  column, 
  onSortSelect, 
  onBlur 
}) => {
  if (!isOpen) return null;

  const sortOptions = [
    { value: SortOption.A_TO_Z, label: 'A-Z' },
    { value: SortOption.Z_TO_A, label: 'Z-A' },
    { value: SortOption.NEWEST_TO_OLDEST, label: 'Newest to Oldest' },
    { value: SortOption.OLDEST_TO_NEWEST, label: 'Oldest to Newest' }
  ];

  return (
    <div 
      className="column-sorting-menu"
      onBlur={(e) => onBlur(column, e)}
      tabIndex={-1}
    >
      {sortOptions.map((option) => (
        <button
          key={option.value}
          className={`sorting-menu-item ${currentSort === option.value ? 'active' : ''}`}
          onClick={() => onSortSelect(column, option.value)}
        >
          <span className="sorting-option-label">{option.label}</span>
          {currentSort === option.value && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="check-icon">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      ))}
    </div>
  );
};

// Sorting options enum
enum SortOption {
  A_TO_Z = 'A_TO_Z',
  Z_TO_A = 'Z_TO_A',
  NEWEST_TO_OLDEST = 'NEWEST_TO_OLDEST',
  OLDEST_TO_NEWEST = 'OLDEST_TO_NEWEST'
}

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showTaskTransferModal, setShowTaskTransferModal] = useState(false);
  const [showDoneTransferModal, setShowDoneTransferModal] = useState(false);
  
  // Sorting state for each column
  const [sortOptions, setSortOptions] = useState<{
    todo: SortOption;
    inProgress: SortOption;
    done: SortOption;
  }>({
    todo: SortOption.A_TO_Z,
    inProgress: SortOption.A_TO_Z,
    done: SortOption.A_TO_Z
  });
  
  // Menu state for each column
  const [openMenus, setOpenMenus] = useState<{
    todo: boolean;
    inProgress: boolean;
    done: boolean;
  }>({
    todo: false,
    inProgress: false,
    done: false
  });
  
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
  
  // Sorting function
  const sortTasks = (tasks: Task[], sortOption: SortOption): Task[] => {
    const tasksCopy = [...tasks];
    
    switch (sortOption) {
      case SortOption.A_TO_Z:
        return tasksCopy.sort((a, b) => a.title.localeCompare(b.title));
      
      case SortOption.Z_TO_A:
        return tasksCopy.sort((a, b) => b.title.localeCompare(a.title));
      
      case SortOption.NEWEST_TO_OLDEST:
        return tasksCopy.sort((a, b) => {
          // Tasks without due dates go to the end
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          
          // Sort by due date - newest (closest to today) first
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      
      case SortOption.OLDEST_TO_NEWEST:
        return tasksCopy.sort((a, b) => {
          // Tasks without due dates go to the end
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          
          // Sort by due date - oldest (furthest from today) first
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });
      
      default:
        return tasksCopy;
    }
  };
  
  // Group and sort tasks by status
  const groupedTasks = {
    todo: sortTasks(tasks.filter(task => task.status === TaskStatus.TODO), sortOptions.todo),
    inProgress: sortTasks(tasks.filter(task => task.status === TaskStatus.IN_PROGRESS), sortOptions.inProgress),
    done: sortTasks(tasks.filter(task => task.status === TaskStatus.DONE), sortOptions.done)
  };

  const handleAddTask = (column: string) => {
    // Only allow creating new tasks in the "todo" column
    if (column === 'todo') {
      setTaskBeingEdited(null);
      setShowModal(true);
    } else {
      // For other columns, this could be used for moving tasks or other actions
      // For now, we'll just log the action
      console.log(`Add action clicked for ${column} column`);
    }
  };

  const handleColumnMenu = (column: 'todo' | 'inProgress' | 'done') => {
    setOpenMenus(prev => ({
      ...prev,
      [column]: !prev[column],
      // Close other menus when opening a new one
      ...(prev[column] ? {} : {
        todo: column === 'todo' ? true : false,
        inProgress: column === 'inProgress' ? true : false,
        done: column === 'done' ? true : false
      })
    }));
  };

  const handleSortOption = (column: 'todo' | 'inProgress' | 'done', sortOption: SortOption) => {
    setSortOptions(prev => ({
      ...prev,
      [column]: sortOption
    }));
    
    // Close the menu after selection
    setOpenMenus(prev => ({
      ...prev,
      [column]: false
    }));
  };

  const handleMenuBlur = (column: 'todo' | 'inProgress' | 'done', e: React.FocusEvent) => {
    // Close menu when focus leaves the menu container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpenMenus(prev => ({
        ...prev,
        [column]: false
      }));
    }
  };

  const getSortOptionLabel = (sortOption: SortOption): string => {
    switch (sortOption) {
      case SortOption.A_TO_Z:
        return 'A-Z';
      case SortOption.Z_TO_A:
        return 'Z-A';
      case SortOption.NEWEST_TO_OLDEST:
        return 'Newest to Oldest';
      case SortOption.OLDEST_TO_NEWEST:
        return 'Oldest to Newest';
      default:
        return 'A-Z';
    }
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

  const handleOpenTaskTransfer = () => {
    setShowTaskTransferModal(true);
  };

  const handleCloseTaskTransfer = () => {
    setShowTaskTransferModal(false);
  };

  const handleTasksTransferred = async () => {
    // Refresh tasks after transfer
    await fetchTasks();
  };

  const handleOpenDoneTransfer = () => {
    setShowDoneTransferModal(true);
  };

  const handleCloseDoneTransfer = () => {
    setShowDoneTransferModal(false);
  };

  const handleDoneTasksTransferred = async () => {
    // Refresh tasks after transfer
    await fetchTasks();
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
            <br></br>
            <p className="welcome-description">To start, click the + in the "To Do" column, to create a new task!</p>
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
                <div className="column-menu-container" onBlur={(e) => handleMenuBlur('todo', e)} tabIndex={-1}>
                  <button 
                    className="column-menu-btn" 
                    aria-label="Sort menu"
                    onClick={() => handleColumnMenu('todo')}
                  >
                    <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                      <circle cx="2" cy="2" r="2" fill="currentColor"/>
                      <circle cx="8" cy="2" r="2" fill="currentColor"/>
                      <circle cx="14" cy="2" r="2" fill="currentColor"/>
                    </svg>
                  </button>
                  <SortingMenu
                    isOpen={openMenus.todo}
                    currentSort={sortOptions.todo}
                    column="todo"
                    onSortSelect={handleSortOption}
                    onBlur={handleMenuBlur}
                  />
                </div>
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
                  onClick={handleOpenTaskTransfer}
                  aria-label="Move tasks to in progress"
                  title="Move tasks to in progress"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="column-menu-container" onBlur={(e) => handleMenuBlur('inProgress', e)} tabIndex={-1}>
                  <button 
                    className="column-menu-btn" 
                    aria-label="Sort menu"
                    onClick={() => handleColumnMenu('inProgress')}
                  >
                    <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                      <circle cx="2" cy="2" r="2" fill="currentColor"/>
                      <circle cx="8" cy="2" r="2" fill="currentColor"/>
                      <circle cx="14" cy="2" r="2" fill="currentColor"/>
                    </svg>
                  </button>
                  <SortingMenu
                    isOpen={openMenus.inProgress}
                    currentSort={sortOptions.inProgress}
                    column="inProgress"
                    onSortSelect={handleSortOption}
                    onBlur={handleMenuBlur}
                  />
                </div>
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
                  onClick={handleOpenDoneTransfer}
                  aria-label="Mark tasks as done"
                  title="Mark tasks as done"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="column-menu-container" onBlur={(e) => handleMenuBlur('done', e)} tabIndex={-1}>
                  <button 
                    className="column-menu-btn" 
                    aria-label="Sort menu"
                    onClick={() => handleColumnMenu('done')}
                  >
                    <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                      <circle cx="2" cy="2" r="2" fill="currentColor"/>
                      <circle cx="8" cy="2" r="2" fill="currentColor"/>
                      <circle cx="14" cy="2" r="2" fill="currentColor"/>
                    </svg>
                  </button>
                  <SortingMenu
                    isOpen={openMenus.done}
                    currentSort={sortOptions.done}
                    column="done"
                    onSortSelect={handleSortOption}
                    onBlur={handleMenuBlur}
                  />
                </div>
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

      {/* Task Transfer Modal */}
      <TaskTransferModal
        isOpen={showTaskTransferModal}
        todoTasks={groupedTasks.todo}
        inProgressTasks={groupedTasks.inProgress}
        onClose={handleCloseTaskTransfer}
        onTasksTransferred={handleTasksTransferred}
      />

      {/* Done Transfer Modal */}
      <DoneTransferModal
        isOpen={showDoneTransferModal}
        inProgressTasks={groupedTasks.inProgress}
        doneTasks={groupedTasks.done}
        onClose={handleCloseDoneTransfer}
        onTasksTransferred={handleDoneTasksTransferred}
      />
    </div>
  );
};

export default TasksPage; 