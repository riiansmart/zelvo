// View/update user profile info

import React from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import { useAuth } from '../hooks/useAuth';
import '../styles/dashboard.css';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

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
          <h1 className="welcome-text">Profile</h1>
          <p className="welcome-description">Manage your account information and preferences.</p>
        </div>

        {/* Profile Content */}
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Personal Information</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-lg text-gray-900">{user.name}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-gray-600">Account created recently</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Account Actions</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Manage your account settings and preferences.</p>
              <ul className="text-gray-500 ml-4 list-disc">
                <li>Update profile information</li>
                <li>Change password</li>
                <li>Notification preferences</li>
                <li>Privacy settings</li>
                <li>Account deletion</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;