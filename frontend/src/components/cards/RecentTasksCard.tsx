import { ArrowRight, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../../types/task.types';
import { formatDate } from '../../utils/dateUtils';
import '../../styles/dashboard.css';

interface Props {
  tasks: Task[];
  loading: boolean;
}

const RecentTasksCard = ({ tasks, loading }: Props) => {
  const navigate = useNavigate();

  const sorted = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const recent = sorted.slice(0, 2);

  return (
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
            <button className="recent-task-menu" aria-label="Task options">
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentTasksCard; 