import React from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import '../styles/dashboard.css';

const SettingsPage: React.FC = () => {
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
          <h1 className="welcome-text">Settings</h1>
          <p className="welcome-description">Customize your experience and preferences.</p>
        </div>

        {/* Settings Content - Placeholder for now */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Account Settings</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Manage your account information and preferences.</p>
              <ul className="text-gray-500 mt-2 ml-4 list-disc">
                <li>Profile information</li>
                <li>Email preferences</li>
                <li>Password security</li>
                <li>Two-factor authentication</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Appearance</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Customize the look and feel of your workspace.</p>
              <ul className="text-gray-500 mt-2 ml-4 list-disc">
                <li>Theme selection (Light/Dark)</li>
                <li>Color schemes</li>
                <li>Layout preferences</li>
                <li>Font size adjustments</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Notifications</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Control how and when you receive notifications.</p>
              <ul className="text-gray-500 mt-2 ml-4 list-disc">
                <li>Task reminders</li>
                <li>Deadline alerts</li>
                <li>Team collaboration</li>
                <li>Email notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage; 