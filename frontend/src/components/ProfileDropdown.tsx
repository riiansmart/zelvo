import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Sun, Settings, UserCircle } from 'lucide-react';
import '../styles/dashboard.css';

const ProfileDropdown = () => {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        className="profile-avatar"
        onClick={() => setOpen(prev => !prev)}
        aria-label="User menu"
      >
        <UserCircle size={32} />
      </button>

      {open && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun size={16} />
            <span>Toggle Theme</span>
          </button>
          <button className="dropdown-item" onClick={() => navigate('/settings')} aria-label="Settings">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 