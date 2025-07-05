/**
 * ExplorerPanel.tsx
 * Task explorer component that displays tasks organized by groups (sprints, backlog).
 * Implements a collapsible tree-view interface similar to VSCode's explorer.
 */

import { ChevronDown, ChevronRight } from 'lucide-react'  // Icons for expand/collapse
import * as Collapsible from '@radix-ui/react-collapsible'  // Accessible collapsible UI
import { useState } from 'react'
import { Task, TaskStatus } from '../types/task.types'  // Task type definitions
import '../styles/dashboard.css'   // Component styles

/**
 * Props for the ExplorerPanel component
 * @interface ExplorerPanelProps
 * @property {Task[]} tasks - Array of all tasks to display
 * @property {string | null} activeTaskId - ID of currently selected task
 * @property {function} onTaskSelect - Callback when a task is selected
 */
interface ExplorerPanelProps {
  tasks: Task[]
  activeTaskId: string | null
  onTaskSelect: (taskId: string) => void
}

/**
 * Represents a group of tasks in the explorer
 * @interface TaskGroup
 * @property {string} id - Unique identifier for the group
 * @property {string} title - Display title for the group
 * @property {Task[]} tasks - Tasks belonging to this group
 */
interface TaskGroup {
  id: string
  title: string
  tasks: Task[]
}

/**
 * ExplorerPanel Component
 * Displays tasks in collapsible groups with status indicators and labels.
 * Features:
 * - Collapsible task groups (Current Sprint, Backlog)
 * - Visual status indicators
 * - Task selection
 * - Label display
 * 
 * @param {ExplorerPanelProps} props - Component props
 * @returns {JSX.Element} The explorer panel component
 */
export function ExplorerPanel({ tasks, activeTaskId, onTaskSelect }: ExplorerPanelProps) {
  // Track which sections are expanded
  const [openSections, setOpenSections] = useState<string[]>(['current-sprint'])
  
  /**
   * Task groups configuration
   * Organizes tasks into Current Sprint and Backlog based on status
   */
  const taskGroups: TaskGroup[] = [
    {
      id: 'current-sprint',
      title: 'Current Sprint (May 5-19)',
      tasks: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS || task.status === TaskStatus.REVIEW)
    },
    {
      id: 'backlog',
      title: 'Backlog',
      tasks: tasks.filter(task => task.status === TaskStatus.TODO)
    }
  ]

  /**
   * Toggles the expanded/collapsed state of a section
   * @param {string} sectionId - ID of the section to toggle
   */
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <div className="explorer-panel bg-secondary border-r border-default">
      {/* Panel Header */}
      <div className="explorer-header bg-tertiary px-4 py-3 font-semibold text-sm text-primary border-b border-default flex items-center justify-between">
        <span>Explorer</span>
      </div>
      
      {/* Task Groups */}
      <div className="p-2">
        {taskGroups.map(group => (
          <Collapsible.Root
            key={group.id}
            open={openSections.includes(group.id)}
            onOpenChange={() => toggleSection(group.id)}
            className="task-group mb-2"
          >
            {/* Group Header with Expand/Collapse Control */}
            <Collapsible.Trigger className="task-group-header w-full flex items-center gap-1 px-2 py-1.5 text-sm text-secondary hover:text-primary rounded transition-colors duration-150">
              {openSections.includes(group.id) ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="font-medium">{group.title}</span>
            </Collapsible.Trigger>
            
            {/* Group Content - Task List */}
            <Collapsible.Content>
              <div className="pl-6 mt-1 space-y-1">
                {group.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onTaskSelect(task.id)}
                    className={`task-item group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm
                      ${task.id === activeTaskId 
                        ? 'bg-accent text-white' 
                        : 'text-secondary hover:text-primary hover:bg-hover'}`}
                  >
                    {/* Task Status Indicator */}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(task.status)}`} />
                    
                    {/* Task Title with ID */}
                    <span className="flex-1 truncate">
                      <span className="font-mono text-xs opacity-70">{task.id}:</span> {task.title}
                    </span>
                    
                    {/* Task Labels */}
                    {task.labels && task.labels.length > 0 && (
                      <div className="task-item-labels hidden group-hover:flex gap-1">
                        {task.labels.map(label => (
                          <span 
                            key={label}
                            className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-secondary/50"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Collapsible.Content>
          </Collapsible.Root>
        ))}
      </div>
    </div>
  )
}

// Helper function to get status color classes
function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return 'bg-gray-400'
    case TaskStatus.IN_PROGRESS:
      return 'bg-blue-500'
    case TaskStatus.REVIEW:
      return 'bg-purple-500'
    case TaskStatus.DONE:
      return 'bg-green-500'
    default:
      return 'bg-gray-400'
  }
} 