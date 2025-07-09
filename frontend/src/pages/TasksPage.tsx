import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import '../styles/task-page.css';
import '../styles/dashboard.css';

// Priority types for personal task management
type Priority = 'low' | 'medium' | 'high';

// Mock data for demonstration - Updated for personal task management
const mockTasks = {
  todo: [
    {
      id: 1,
      category: 'DESIGN SYSTEM',
      categoryColor: '#4CAF50',
      title: 'Hero section',
      description: 'Create a design system for a hero section in 2 different variants. Create a simple presentation with these components.',
      priority: 'high' as Priority
    },
    {
      id: 2,
      category: 'TYPOGRAPHY',
      categoryColor: '#FF9800',
      title: 'Typography change',
      description: 'Modify typography and styling of text placed on 6 screens of the website design. Prepare a documentation.',
      priority: 'medium' as Priority
    }
  ],
  inProgress: [
    {
      id: 3,
      category: 'DEVELOPMENT',
      categoryColor: '#F44336',
      title: 'Implement design screens',
      description: 'Our designers created 6 screens for a website that needs to be implemented by our dev team.',
      priority: 'high' as Priority
    }
  ],
  done: [
    {
      id: 4,
      category: 'DEVELOPMENT',
      categoryColor: '#F44336',
      title: 'Fix bugs in the CSS code',
      description: 'Fix small bugs that are essential to prepare for the next release that will happen this quarter.',
      priority: 'medium' as Priority
    },
    {
      id: 5,
      category: 'TYPOGRAPHY',
      categoryColor: '#FF9800',
      title: 'Proofread final text',
      description: 'The text provided by marketing department needs to be proofread so that we make sure that it fits into our design.',
      priority: 'low' as Priority
    },
    {
      id: 6,
      category: 'DESIGN SYSTEM',
      categoryColor: '#4CAF50',
      title: 'Responsive design',
      description: 'All designs need to be responsive. The requirement is that it fits all web and mobile screens.',
      priority: 'high' as Priority
    }
  ]
};

interface TaskCardProps {
  task: {
    id: number;
    category: string;
    categoryColor: string;
    title: string;
    description: string;
    priority: Priority;
  };
}

// Priority configuration with simple, intuitive urgency colors
const priorityConfig = {
  low: {
    label: 'Low',
    color: '#16A34A', // Green
    bgColor: '#F0FDF4' // Very light green background
  },
  medium: {
    label: 'Medium',
    color: '#CA8A04', // Yellow/Amber
    bgColor: '#FEFCE8' // Very light yellow background
  },
  high: {
    label: 'High',
    color: '#DC2626', // Red
    bgColor: '#FEF2F2' // Very light red background
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const priority = priorityConfig[task.priority];
  
  return (
    <div className="task-card">
      <div className="task-card-header">
        <div className="task-category">
          <div 
            className="category-dot" 
            style={{ backgroundColor: task.categoryColor }}
          ></div>
          <span className="category-text">{task.category}</span>
        </div>
        <button className="task-menu-btn">
          <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
            <circle cx="2" cy="2" r="2" fill="#6B7280"/>
            <circle cx="8" cy="2" r="2" fill="#6B7280"/>
            <circle cx="14" cy="2" r="2" fill="#6B7280"/>
          </svg>
        </button>
      </div>
      
      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>
      
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
    </div>
  );
};

const TasksPage: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('This week');

  const handleAddTask = (column: string) => {
    // TODO: Implement add task functionality
    console.log(`Add task to ${column}`);
  };

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
          <div className="week-selector">
            <select 
              value={selectedWeek} 
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="week-dropdown"
            >
              <option value="This week">This week</option>
              <option value="Last week">Last week</option>
              <option value="Next week">Next week</option>
            </select>
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
                <button className="column-menu-btn" aria-label="Column menu">
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                    <circle cx="2" cy="2" r="2" fill="currentColor"/>
                    <circle cx="8" cy="2" r="2" fill="currentColor"/>
                    <circle cx="14" cy="2" r="2" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="column-content">
              {mockTasks.todo.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
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
                <button className="column-menu-btn" aria-label="Column menu">
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                    <circle cx="2" cy="2" r="2" fill="currentColor"/>
                    <circle cx="8" cy="2" r="2" fill="currentColor"/>
                    <circle cx="14" cy="2" r="2" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="column-content">
              {mockTasks.inProgress.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
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
                <button className="column-menu-btn" aria-label="Column menu">
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                    <circle cx="2" cy="2" r="2" fill="currentColor"/>
                    <circle cx="8" cy="2" r="2" fill="currentColor"/>
                    <circle cx="14" cy="2" r="2" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="column-content">
              {mockTasks.done.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TasksPage; 