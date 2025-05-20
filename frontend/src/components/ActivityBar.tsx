/**
 * ActivityBar.tsx
 * VSCode-inspired activity bar component that provides navigation between major application views.
 * Features a vertical icon bar with hover effects and active state indicators.
 */

import { Files, Calendar, Settings, BarChart2, Users } from 'lucide-react'
import { ReactNode } from 'react'

/**
 * Interface for activity bar navigation items
 * @interface ActivityBarItem
 * @property {ReactNode} icon - Icon component to display
 * @property {string} label - Accessible label and tooltip text
 * @property {boolean} [isActive] - Whether this item is currently active
 */
interface ActivityBarItem {
  icon: ReactNode
  label: string
  isActive?: boolean
}

/**
 * ActivityBar Component
 * Provides primary navigation through a vertical bar of icons.
 * Features:
 * - VSCode-inspired design
 * - Accessible button controls
 * - Hover and active state indicators
 * - Tooltips for labels
 * - Accent bar indicators
 * 
 * Navigation Structure:
 * 1. Explorer - File and task management
 * 2. Timeline - Time-based task view
 * 3. Reports - Analytics and metrics
 * 4. Team - Collaboration features
 * 5. Settings - Application configuration
 * 
 * @returns {JSX.Element} The activity bar component
 */
export function ActivityBar() {
  // Navigation items configuration
  const items: ActivityBarItem[] = [
    { icon: <Files size={24} />, label: 'Explorer', isActive: true },
    { icon: <Calendar size={24} />, label: 'Timeline' },
    { icon: <BarChart2 size={24} />, label: 'Reports' },
    { icon: <Users size={24} />, label: 'Team' },
    { icon: <Settings size={24} />, label: 'Settings' }
  ]

  return (
    <div className="w-12 bg-secondary flex flex-col items-center py-2 border-r border-default">
      {items.map((item, index) => (
        <button
          key={index}
          className={`
            w-full p-3 flex justify-center hover:bg-secondary relative group
            ${item.isActive ? 'bg-secondary' : ''}
          `}
          aria-label={item.label}
          title={item.label}
        >
          {/* Active state indicator bar */}
          <div className={`
            absolute left-0 w-0.5 h-6 top-1/2 -translate-y-1/2 transition-colors
            ${item.isActive ? 'bg-accent' : 'bg-transparent hover:bg-accent'}
          `} />
          {/* Icon with active and hover states */}
          <div className={`text-secondary ${item.isActive ? 'text-primary' : ''} hover:text-primary`}>
            {item.icon}
          </div>
        </button>
      ))}
    </div>
  )
} 