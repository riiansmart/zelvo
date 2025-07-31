/**
 * DashboardPage.tsx
 * Main dashboard interface for task management.
 * Features a responsive grid layout with filtering, sorting, and bulk actions.
 */

import { useEffect, useState } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import CalendarCard from '../components/cards/CalendarCard';
import RecentTasksCard from '../components/cards/RecentTasksCard';
import StatsCard from '../components/cards/StatsCard';
import TaskActivityCard from '../components/cards/TaskActivityCard';
import { useAuth } from '../hooks/useAuth';
import { getTasks } from '../services/taskService';
import { Task, TaskStatus } from '../types/task.types';
import { Search } from 'lucide-react';
import '../styles/dashboard.css';

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
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getTasks();
      if (Array.isArray(response)) setTasks(response);
      else if (response?.content) setTasks(response.content);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  if (!user) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ProfileDropdown />
        </div>

        {/* Welcome */}
        <div className="mb-6">
          <h1 className="welcome-text">Dashboard</h1>
          <p className="welcome-description">Welcome to your Dashboard!</p>
          <p className="welcome-description">Here's your general overview of current tasks.</p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-4 mb-6">
          <StatsCard
            count={tasks.filter((t) => t.status === TaskStatus.TODO && new Date(t.dueDate) >= new Date()).length}
            title="Upcoming"
            subtitle="Tasks"
            borderColor="#d9534f"
          />
          <StatsCard
            count={tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length}
            title="In Progress"
            subtitle="Tasks"
            borderColor="#f0ad4e"
          />
          <StatsCard
            count={tasks.filter((t) => t.status === TaskStatus.DONE).length}
            title="Completed"
            subtitle="Tasks"
            borderColor="#5cb85c"
          />
        </div>

        {/* Main Grid with Activity + Right Sidebar */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 320px' }}>
          <TaskActivityCard tasks={tasks} />

          <div className="flex flex-col gap-6">
            <CalendarCard />
            <RecentTasksCard tasks={tasks} loading={loading} onTaskUpdate={fetchTasks} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;