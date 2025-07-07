import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import { getTasks } from '../services/taskService';
import { Task, TaskPriority } from '../types/task.types';
import '../styles/dashboard.css';
import '../styles/calender-page.css';

// Priority color configuration
const priorityColors = {
  [TaskPriority.LOW]: '#16A34A',
  [TaskPriority.MEDIUM]: '#CA8A04', 
  [TaskPriority.HIGH]: '#DC2626'
};

interface TaskPopupProps {
  task: Task;
  onClose: () => void;
}

const TaskPopup: React.FC<TaskPopupProps> = ({ task, onClose }) => {
  return (
    <div className="task-popup-overlay" onClick={onClose}>
      <div className="task-popup" onClick={(e) => e.stopPropagation()}>
        <div className="task-popup-header">
          <h3 className="task-popup-title">{task.title}</h3>
          <button 
            className="task-popup-close" 
            onClick={onClose}
            aria-label="Close task details"
          >
            <X size={20} />
          </button>
        </div>
        <div className="task-popup-content">
          <div className="task-popup-priority">
            <span 
              className="priority-indicator"
              style={{ backgroundColor: priorityColors[task.priority] }}
            ></span>
            <span className="priority-text">{task.priority}</span>
          </div>
          {task.description && (
            <div className="task-popup-description">
              <h4>Description</h4>
              <p>{task.description}</p>
            </div>
          )}
          <div className="task-popup-due-date">
            <h4>Due Date</h4>
            <p>{new Date(task.dueDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface VisualPickerProps {
  currentYear: number;
  currentMonth: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}

const VisualPicker: React.FC<VisualPickerProps> = ({ currentYear, currentMonth, onSelect, onClose }) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const currentDate = new Date();
  const thisYear = currentDate.getFullYear();
  const thisMonth = currentDate.getMonth() + 1;

  return (
    <div className="visual-picker-overlay" onClick={onClose}>
      <div className="visual-picker" onClick={(e) => e.stopPropagation()}>
        <div className="visual-picker-header">
          <button 
            className="visual-picker-nav" 
            onClick={() => setSelectedYear(selectedYear - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="visual-picker-year">{selectedYear}</span>
          <button 
            className="visual-picker-nav" 
            onClick={() => setSelectedYear(selectedYear + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="visual-picker-months">
          {monthNames.map((monthName, index) => (
            <button
              key={index}
              className={`visual-picker-month ${
                selectedYear === currentYear && index + 1 === currentMonth ? 'current' : ''
              } ${
                selectedYear === thisYear && index + 1 === thisMonth ? 'today' : ''
              }`}
              onClick={() => onSelect(selectedYear, index + 1)}
            >
              {monthName}
            </button>
          ))}
        </div>
        
        <div className="visual-picker-actions">
          <button className="visual-picker-today" onClick={() => onSelect(thisYear, thisMonth)}>
            This Month
          </button>
          <button className="visual-picker-close" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    console.log('Calendar initializing with current date:', now.getFullYear(), now.getMonth() + 1);
    return now;
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showVisualPicker, setShowVisualPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchTasks();
  }, []);

  // Get calendar data for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Create calendar grid
  const calendarDays = [];
  
  // Add previous month's trailing days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonthDays = new Date(prevYear, prevMonth + 1, 0).getDate();
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      isPrevMonth: true,
      isNextMonth: false
    });
  }
  
  // Add all days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day: day,
      isCurrentMonth: true,
      isPrevMonth: false,
      isNextMonth: false
    });
  }
  
  // Add next month's leading days to complete only the final week
  const lastDayOfWeek = (firstDayOfWeek + daysInMonth - 1) % 7;
  const remainingDaysInWeek = lastDayOfWeek === 6 ? 0 : 6 - lastDayOfWeek;
  
  for (let day = 1; day <= remainingDaysInWeek; day++) {
    calendarDays.push({
      day: day,
      isCurrentMonth: false,
      isPrevMonth: false,
      isNextMonth: true
    });
  }

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };





  const handleVisualPickerSelect = (selectedYear: number, selectedMonth: number) => {
    const selectedDate = new Date(selectedYear, selectedMonth - 1, 1);
    console.log('Visual picker selected:', selectedDate.getFullYear(), selectedDate.getMonth() + 1);
    setCurrentDate(selectedDate);
    setShowVisualPicker(false);
  };

  const handleMonthYearClick = () => {
    setShowVisualPicker(!showVisualPicker);
  };

  // Get tasks for a specific day
  const getTasksForDay = (dayObj: any) => {
    if (!dayObj.isCurrentMonth) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === dateStr);
  };

  // Check if date is today
  const isToday = (dayObj: any) => {
    if (!dayObj.isCurrentMonth) return false;
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === dayObj.day;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="dashboard-layout">
      <Sidebar />

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

        {/* Page Content */}
        <div className="mb-6">
          <h1 className="welcome-text">Calendar</h1>
          <p className="welcome-description">Manage your schedule and deadlines.</p>
        </div>

        {/* Calendar */}
        <div className="calendar-container">
          <div className="calendar-header">
            <button 
              className="calendar-nav-btn" 
              onClick={goToPreviousMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="calendar-title-container">
              <button 
                className="calendar-title" 
                onClick={handleMonthYearClick}
              >
                {monthNames[month]} {year}
              </button>

            </div>

            <button 
              className="calendar-nav-btn" 
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="calendar-grid">
            {/* Day names header */}
            {dayNames.map(day => (
              <div key={day} className="calendar-day-name">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((dayObj, index) => (
              <div 
                key={index} 
                className={`calendar-day ${
                  !dayObj.isCurrentMonth ? 'other-month' : ''
                } ${
                  dayObj.isCurrentMonth && isToday(dayObj) ? 'today' : ''
                }`}
              >
                <span className={`day-number ${
                  !dayObj.isCurrentMonth ? 'other-month-number' : ''
                }`}>
                  {dayObj.day}
                </span>
                {dayObj.isCurrentMonth && (
                  <div className="day-tasks">
                    {getTasksForDay(dayObj).slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className="task-item"
                        style={{ backgroundColor: priorityColors[task.priority] }}
                        onClick={() => setSelectedTask(task)}
                        title={task.title}
                      >
                        <span className="task-title">{task.title}</span>
                      </div>
                    ))}
                    {getTasksForDay(dayObj).length > 3 && (
                      <div className="more-tasks">
                        +{getTasksForDay(dayObj).length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {loading && (
            <div className="calendar-loading">
              <p>Loading tasks...</p>
            </div>
          )}
        </div>

        {/* Task Popup */}
        {selectedTask && (
          <TaskPopup 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
          />
        )}

        {/* Visual Date Picker */}
        {showVisualPicker && (
          <VisualPicker
            currentYear={year}
            currentMonth={month + 1}
            onSelect={handleVisualPickerSelect}
            onClose={() => setShowVisualPicker(false)}
          />
        )}
      </main>
    </div>
  );
};

export default CalendarPage; 