/**
 * TimelinePanel.tsx
 * Timeline visualization component that displays tasks in a Gantt-chart style interface.
 * Features a resizable, collapsible panel with drag handles and fullscreen support.
 */

import { format, addDays, subDays } from 'date-fns'
import { Task, TaskStatus } from '../types/task.types'
import { ChevronDown, Clock, Maximize2, Minimize2, X } from 'lucide-react'
import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * Props for the TimelinePanel component
 * @interface TimelinePanelProps
 * @property {Task[]} tasks - Array of tasks to display in the timeline
 * @property {function} [onClose] - Optional callback when panel is closed
 * @property {function} [onMaximize] - Optional callback when panel is maximized
 */
interface TimelinePanelProps {
  tasks: Task[]
  onClose?: () => void
  onMaximize?: () => void
}

/**
 * TimelinePanel Component
 * Displays tasks in a timeline/Gantt chart view with interactive features.
 * Features:
 * - Resizable panel height with drag handle
 * - Collapsible panel for space efficiency
 * - Fullscreen mode for detailed view
 * - Task progress visualization
 * - Date-based navigation
 * - Status-based color coding
 * 
 * @param {TimelinePanelProps} props - Component props
 * @returns {JSX.Element} The timeline panel component
 */
export function TimelinePanel({ tasks, onClose, onMaximize }: TimelinePanelProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const startHeightRef = useRef<number>(0)
  const startYRef = useRef<number>(0)

  const statusColors: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'var(--status-todo)',
    [TaskStatus.IN_PROGRESS]: 'var(--status-in-progress)',
    [TaskStatus.REVIEW]: 'var(--status-review)',
    [TaskStatus.DONE]: 'var(--status-done)'
  }

  // Generate dates array (14 days, 7 days before and after today)
  const today = new Date()
  const startDate = subDays(today, 7)
  const dates = Array.from({ length: 14 }, (_, i) => addDays(startDate, i))

  // Convert tasks to timeline format
  const timelineTasks = tasks.map(task => ({
    ...task,
    startDate: new Date(task.createdAt || ''),
    endDate: new Date(task.dueDate),
    progress: task.status === TaskStatus.DONE ? 100 : 
             task.status === TaskStatus.REVIEW ? 80 :
             task.status === TaskStatus.IN_PROGRESS ? 50 : 0
  }))

  // Handle panel resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current || isCollapsed || isFullscreen) return
    
    setIsResizing(true)
    startHeightRef.current = panelRef.current.offsetHeight
    startYRef.current = e.clientY
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !panelRef.current) return

    const deltaY = startYRef.current - e.clientY
    const newHeight = Math.min(
      Math.max(startHeightRef.current + deltaY, 100),
      window.innerHeight - 70
    )
    
    panelRef.current.style.height = `${newHeight}px`
  }, [isResizing])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  const handleClose = () => {
    if (!onClose) return
    setIsClosing(true)
    setTimeout(onClose, 150)
  }

  const toggleCollapse = () => {
    if (isFullscreen) return
    setIsCollapsed(prev => !prev)
  }

  const toggleFullscreen = () => {
    if (isCollapsed) return
    setIsFullscreen(prev => !prev)
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div 
      ref={panelRef}
      className={`timeline-panel
        ${isClosing ? 'closing' : ''} 
        ${isCollapsed ? 'collapsed' : ''} 
        ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {/* Timeline Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-default bg-secondary">
        <div 
          className="flex items-center gap-2 text-primary cursor-pointer"
          onClick={toggleCollapse}
        >
          <Clock size={14} />
          <ChevronDown 
            className={`transform transition-transform ${isCollapsed ? '-rotate-90' : ''}`} 
            size={14} 
          />
          <span className="text-xs font-medium">Timeline</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              toggleFullscreen()
              onMaximize?.()
            }}
            className="p-1 text-primary hover:bg-hover rounded"
            title={isFullscreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          {onClose && (
            <button
              onClick={handleClose}
              className="p-1 text-primary hover:bg-hover rounded"
              title="Close timeline"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="timeline-content">
        <div className="min-w-[800px]">
          {/* Timeline Header - Dates */}
          <div className="flex border-b border-default sticky top-0 bg-primary z-10">
            <div className="w-48 flex-shrink-0 p-2 border-r border-default" />
            {dates.map((date, i) => (
              <div
                key={i}
                className={`w-24 flex-shrink-0 p-2 text-center text-xs ${
                  format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                    ? 'text-accent'
                    : 'text-secondary'
                }`}
              >
                {format(date, 'MMM d')}
              </div>
            ))}
          </div>

          {/* Task Rows */}
          {timelineTasks.map((task, index) => (
            <div
              key={task.id}
              className={`flex border-b border-default
                ${index % 2 === 0 ? 'bg-secondary' : 'bg-primary'} 
                hover:bg-hover`}
            >
              <div className="w-48 flex-shrink-0 p-2 border-r border-default">
                <div className="text-xs font-medium truncate">{task.title}</div>
              </div>
              <div className="flex-1 relative p-2">
                <div
                  className="absolute h-4 rounded"
                  style={{
                    left: `${getTaskOffset(task.startDate, dates) * 100}%`,
                    width: `${getTaskDuration(task.startDate, task.endDate) * 100}%`,
                    backgroundColor: statusColors[task.status],
                    opacity: 0.3
                  }}
                />
                <div
                  className="absolute h-4 rounded"
                  style={{
                    left: `${getTaskOffset(task.startDate, dates) * 100}%`,
                    width: `${(getTaskDuration(task.startDate, task.endDate) * task.progress) / 100 * 100}%`,
                    backgroundColor: statusColors[task.status]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resize Handle */}
      <div 
        className="timeline-resizer"
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

/**
 * Calculates the pixel offset for a task's position in the timeline
 * @param {Date} taskDate - Start date of the task
 * @param {Date[]} dates - Array of dates in the timeline
 * @returns {number} Pixel offset from the left edge
 */
function getTaskOffset(taskDate: Date, dates: Date[]): number {
  const startDate = dates[0]
  const daysDiff = Math.floor((taskDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  return (daysDiff * 96) + 192 // 96px per day (24px * 4), 192px initial offset
}

/**
 * Calculates the pixel width for a task's duration bar
 * @param {Date} startDate - Task start date
 * @param {Date} endDate - Task end date
 * @returns {number} Width in pixels for the task duration bar
 */
function getTaskDuration(startDate: Date, endDate: Date): number {
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  return daysDiff * 96 // 96px per day
} 