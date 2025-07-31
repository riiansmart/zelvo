import { ArrowRight, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Task } from '../../types/task.types';
import { formatDate } from '../../utils/dateUtils';
import { deleteTask } from '../../services/taskService';
import TaskCreateModal from '../TaskCreateModal';
import '../../styles/dashboard.css';

interface Props {
  tasks: Task[];
  loading: boolean;
  onTaskUpdate?: () => void; // Callback to refresh tasks
}

const RecentTasksCard = ({ tasks, loading, onTaskUpdate }: Props) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const sorted = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const recent = sorted.slice(0, 2);

  const handleMenuClick = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === taskId ? null : taskId);
  };

  const handleMenuBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpenMenuId(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteConfirmation(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask(parseInt(taskToDelete.id as unknown as string));
      setShowDeleteConfirmation(false);
      setTaskToDelete(null);
      onTaskUpdate?.(); // Refresh tasks
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

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setTaskToEdit(null);
  };

  const handleTaskSaved = () => {
    setShowEditModal(false);
    setTaskToEdit(null);
    onTaskUpdate?.(); // Refresh tasks
  };

  return (
    <>
      <div className="card recent-tasks-card">
        <div className="card-header">
          <h2 className="card-title">Recent Tasks</h2>
          <button className="card-action" onClick={() => navigate('/tasks')} aria-label="View tasks page">
            <ArrowRight size={20} />
          </button>
        </div>

        {loading ? (
          <p className="card-message">Loading...</p>
        ) : recent.length === 0 ? (
          <p className="card-message">No tasks yet. Create a task to get started!</p>
        ) : (
          recent.map(task => (
            <div key={task.id} className="recent-task-item">
              <div className="recent-task-content">
                <div className="recent-task-status">
                  <span className="status-dot status-design-system"></span>
                  <span>{task.status || 'TASK'}</span>
                </div>
                <h3 className="recent-task-title">{task.title}</h3>
                <p className="recent-task-description">{task.description || 'No description available'}</p>
              </div>
              <div className="recent-task-menu-container" onBlur={handleMenuBlur} tabIndex={-1}>
                <button 
                  className="recent-task-menu" 
                  onClick={(e) => handleMenuClick(e, task.id as string)}
                  aria-label="Task options"
                >
                  <MoreHorizontal size={16} />
                </button>
                
                {/* Dropdown Menu */}
                {openMenuId === task.id && (
                  <div className="recent-task-dropdown-menu">
                    <button 
                      onClick={() => handleEditTask(task)} 
                      className="recent-task-dropdown-item"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task)} 
                      className="recent-task-dropdown-item recent-task-dropdown-item-delete"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Task Modal */}
      <TaskCreateModal 
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onTaskSaved={handleTaskSaved}
        existingTask={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="delete-confirmation-overlay" onClick={handleCancelDelete}>
          <div className="delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirmation-header">
              <h3 className="delete-confirmation-title">Delete Task</h3>
            </div>
            <div className="delete-confirmation-content">
              <p className="delete-confirmation-message">
                Are you sure you want to delete "<strong>{taskToDelete?.title}</strong>"?
              </p>
              <p className="delete-confirmation-warning">
                This action cannot be undone.
              </p>
            </div>
            <div className="delete-confirmation-actions">
              <button className="btn-cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="btn-delete" onClick={handleConfirmDelete}>
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentTasksCard; 