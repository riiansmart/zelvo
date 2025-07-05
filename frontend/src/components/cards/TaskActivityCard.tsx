import { Task } from '../../types/task.types';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/dashboard.css';

interface Props {
  tasks: Task[];
}

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const yAxisLabels = ['05', '04', '03', '02', '01', '0'];

function groupTasksByDay(tasks: Task[]): number[] {
  const counts = Array(7).fill(0);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());

  tasks.forEach((task) => {
    const due = new Date(task.dueDate);
    if (due >= weekStart && due <= now) {
      const index = due.getDay();
      counts[index] += 1;
    }
  });

  return counts;
}

const TaskActivityCard = ({ tasks }: Props) => {
  const { user } = useAuth();
  const counts = groupTasksByDay(tasks);
  const max = Math.max(...counts, 5);
  
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

  // Mock data for visual representation (as shown in Figma)
  // All bars go to top (5), dark blue shows completed portion
  const mockData = [
    { total: 5, completed: 1.2 },  // M: full bar, 1.2 completed
    { total: 5, completed: 3.8 },  // T: full bar, 3.8 completed  
    { total: 5, completed: 3.1 },  // W: full bar, 3.1 completed
    { total: 5, completed: 2.5 },  // T: full bar, 2.5 completed
    { total: 5, completed: 3.2 },  // F: full bar, 3.2 completed
    { total: 5, completed: 3.8 },  // S: full bar, 3.8 completed
    { total: 5, completed: 2.5 }   // S: full bar, 2.5 completed
  ];

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
                    {mockData.map((data, idx) => {
            // All bars go to 100% height (Y-axis 05)
            // Dark blue shows completed portion from bottom
            const completedHeight = (data.completed / 5) * 100;
            const incompleteHeight = 100 - completedHeight;
            
            return (
              <div key={idx} className="activity-column">
                <div className="activity-bar-container" style={{ height: `100%` }}>
                  {/* Incomplete portion (light blue) - top part */}
                  <div
                    className="activity-bar activity-bar-incomplete"
                    style={{ height: `${incompleteHeight}%` }}
                  />
                  {/* Completed portion (dark blue) - bottom part */}
                  <div
                    className="activity-bar activity-bar-completed"
                    style={{ height: `${completedHeight}%` }}
                  />
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