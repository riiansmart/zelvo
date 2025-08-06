import { Task } from '../../types/task.types';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/dashboard.css';

interface Props {
  tasks: Task[];
}

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const yAxisLabels = ['5+', '4', '3', '2', '1', '0'];

function groupCompletedTasksByDay(tasks: Task[]): number[] {
  const counts = Array(7).fill(0);
  const now = new Date();
  
  // Get the start of the current week (Monday)
  const weekStart = new Date(now);
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so we need to handle it
  weekStart.setDate(now.getDate() - daysToMonday);
  weekStart.setHours(0, 0, 0, 0);
  
  // Get the end of the current week (Sunday)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  tasks.forEach((task) => {
    // Only count completed tasks
    if (!task.completed) return;
    
    // Use updatedAt as completion date, fallback to createdAt
    const completionDate = task.updatedAt ? new Date(task.updatedAt) : new Date(task.createdAt || '');
    
    // Check if task was completed within the current week
    if (completionDate >= weekStart && completionDate <= weekEnd) {
      // Get day of week (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = completionDate.getDay();
      // Convert to our array index (0 = Monday, 6 = Sunday)
      const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      counts[index] += 1;
    }
  });

  return counts;
}

const TaskActivityCard = ({ tasks }: Props) => {
  const { user } = useAuth();
  const completedTasksByDay = groupCompletedTasksByDay(tasks);
  const maxCompleted = Math.max(...completedTasksByDay, 1); // Minimum 1 to avoid division by zero
  
  // Calculate metrics from real task data
  const completedTasks = tasks.filter(t => t.completed).length;
  const incompleteTasks = tasks.filter(t => !t.completed).length;
  
  // Calculate user's total time in app (based on earliest task or session time)
  const calculateTimeSpent = (): string => {
    if (!tasks.length) return '0h';
    
    // Find the earliest task creation date as a proxy for user activity
    const earliestTaskDate = tasks
      .filter(task => task.createdAt)
      .map(task => new Date(task.createdAt!))
      .sort((a, b) => a.getTime() - b.getTime())[0];
    
    if (!earliestTaskDate) return '0h';
    
    const now = new Date();
    const diffInMs = now.getTime() - earliestTaskDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    return `${Math.max(diffInHours, 1)}h`; // Minimum 1 hour
  };

  return (
    <div className="card activity-card">
      <h2 className="card-title">Task Activity</h2>
      
      <div className="activity-content">
        {/* Y-axis labels */}
        <div className="activity-y-axis">
          {yAxisLabels.map((label) => (
            <div key={label} className="activity-y-label">
              {label}
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="activity-chart">
          {completedTasksByDay.map((completedCount, idx) => {
            // Calculate the height based on completed tasks for this day
            // Cap at 5+ for the y-axis
            const normalizedCount = Math.min(completedCount, 5);
            const completedHeight = (normalizedCount / 5) * 100;
            const incompleteHeight = 100 - completedHeight;
            
            return (
              <div key={idx} className="activity-column">
                <div className="activity-bar-container" style={{ height: `100%` }}>
                  {/* Incomplete portion (light blue/red) - top part */}
                  <div
                    className="activity-bar activity-bar-incomplete"
                    style={{ height: `${incompleteHeight}%` }}
                  />
                  {/* Completed portion (dark blue/red) - bottom part */}
                  {completedCount > 0 && (
                    <div
                      className="activity-bar activity-bar-completed"
                      style={{ height: `${completedHeight}%` }}
                    />
                  )}
                </div>
                <span className="activity-label">{days[idx]}</span>
              </div>
            );
          })}
          
          {/* Metrics panel positioned absolutely */}
          <div className="activity-metrics">
            <div className="activity-metric">
              <span className="activity-metric-value">{calculateTimeSpent()}</span>
              <span className="activity-metric-label">Time spent</span>
            </div>
            
            <div className="activity-metric">
              <span className="activity-metric-value">{completedTasks}</span>
              <span className="activity-metric-label">Tasks Completed</span>
            </div>
            
            <div className="activity-metric">
              <span className="activity-metric-value">{incompleteTasks}</span>
              <span className="activity-metric-label">Tasks Incomplete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskActivityCard; 