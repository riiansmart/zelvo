import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

const CalendarCard = () => {
  const navigate = useNavigate();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  // Create array of days for the calendar
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          {monthNames[month]} {year}
        </h2>
        <button
          className="card-action"
          onClick={() => navigate('/calendar')}
          aria-label="Open calendar page"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="dashboard-calendar">
        {/* Day headers */}
        <div className="dashboard-calendar-header">
          {dayNames.map((name, index) => (
            <div key={index} className="dashboard-calendar-day-header">
              {name}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="dashboard-calendar-grid">
          {days.map((day, index) => {
            const isToday = day === today.getDate();
            return (
              <div
                key={index}
                className={`dashboard-calendar-cell ${
                  day ? 'dashboard-calendar-day' : 'dashboard-calendar-empty'
                } ${isToday ? 'dashboard-calendar-today' : ''}`}
              >
                {day || ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarCard; 