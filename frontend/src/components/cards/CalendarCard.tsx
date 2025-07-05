import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function generateCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: Array<number | null>[] = [];
  let currentDay = 1 - firstDay;
  while (currentDay <= daysInMonth) {
    const week: Array<number | null> = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay < 1 || currentDay > daysInMonth) {
        week.push(null);
      } else {
        week.push(currentDay);
      }
      currentDay++;
    }
    weeks.push(week);
  }
  return weeks;
}

const CalendarCard = () => {
  const navigate = useNavigate();
  const today = new Date();
  const weeks = generateCalendar(today.getFullYear(), today.getMonth());

  return (
    <div className="card calendar-card">
      <div className="card-header">
        <h2 className="card-title">
          {today.toLocaleString('default', { month: 'long' })} {today.getFullYear()}
        </h2>
        <button
          className="card-action"
          onClick={() => navigate('/calendar')}
          aria-label="Open calendar page"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="calendar-grid">
        {dayNames.map((name) => (
          <div key={name} className="calendar-day-name">
            {name}
          </div>
        ))}
        {weeks.flat().map((day, idx) => {
          const isToday = day === today.getDate();
          return (
            <div
              key={idx}
              className={`calendar-day ${isToday ? 'today' : ''}`}
            >
              {day || ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarCard; 