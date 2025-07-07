import React from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import '../styles/dashboard.css';

const CalendarPage: React.FC = () => {
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

        {/* Page Content */}
        <div className="mb-6">
          <h1 className="welcome-text">Calendar</h1>
          <p className="welcome-description">Manage your schedule and deadlines.</p>
        </div>

        {/* Calendar Content - Placeholder for now */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Calendar View</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600">Calendar views will be implemented here.</p>
            <p className="text-gray-500 mt-2">Features coming soon:</p>
            <ul className="text-gray-500 mt-2 ml-4 list-disc">
              <li>Monthly, weekly, and daily views</li>
              <li>Task deadline visualization</li>
              <li>Event scheduling</li>
              <li>Integration with task due dates</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage; 