import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Calendar as CalendarIcon, Settings as SettingsIcon, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/dashboard.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Tasks', path: '/tasks', icon: <ListTodo size={20} /> },
    { label: 'Calendar', path: '/calendar', icon: <CalendarIcon size={20} /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Zelvo Brand Logo - Clickable to Landing Page */}
      <Link to="/" className="sidebar-brand">
        <Package size={28} className="sidebar-brand-icon" />
        <span className="sidebar-brand-text">Zelvo</span>
      </Link>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ label, path, icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            aria-label={label}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout} aria-label="Logout">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar; 