/**
 * PropertiesPanel.tsx
 * Task properties editor component that provides a form-like interface for editing task metadata.
 * Features a clean, organized layout with dropdown selectors and input fields.
 */

import * as Select from '@radix-ui/react-select'
import { ChevronDown, Plus, X } from 'lucide-react'
import { Task, TaskPriority, TaskStatus, User } from '../types/task.types'
import '../styles/dropdown.css'
import '../styles/properties-panel.css'

/**
 * Props for the PropertiesPanel component
 * @interface PropertiesPanelProps
 * @property {Task | undefined} task - The task to edit, undefined if no task is selected
 * @property {User[]} users - Available users for task assignment
 * @property {function} onTaskUpdate - Callback when task properties are updated
 */
interface PropertiesPanelProps {
  task: Task | undefined
  users: User[]
  onTaskUpdate: (task: Task) => void
}

// Available options for task properties
const priorities = Object.values(TaskPriority)
const statuses = Object.values(TaskStatus)
const points = [1, 2, 3, 5, 8, 13]  // Fibonacci sequence for story points

/**
 * PropertiesPanel Component
 * Provides an interface for editing task metadata and properties.
 * Features:
 * - Status selection with visual indicators
 * - Priority management
 * - Story point estimation
 * - Assignee selection
 * - Due date management
 * - Label management
 * - Task dependencies
 * 
 * Uses Radix UI's Select component for consistent, accessible dropdowns
 * 
 * @param {PropertiesPanelProps} props - Component props
 * @returns {JSX.Element} The properties panel component
 */
export function PropertiesPanel({ task, users, onTaskUpdate }: PropertiesPanelProps) {
  // Show placeholder when no task is selected
  if (!task) {
    return (
      <div className="properties-panel">
        <div className="no-task">No task selected</div>
      </div>
    )
  }

  /**
   * Updates the task's status
   * @param {TaskStatus} status - New status value
   */
  const handleStatusChange = (status: TaskStatus) => {
    onTaskUpdate({ ...task, status })
  }

  /**
   * Updates the task's priority level
   * @param {TaskPriority} priority - New priority value
   */
  const handlePriorityChange = (priority: TaskPriority) => {
    onTaskUpdate({ ...task, priority })
  }

  /**
   * Updates the task's story points
   * @param {string} points - New story points value
   */
  const handlePointsChange = (points: string) => {
    onTaskUpdate({ ...task, storyPoints: parseInt(points, 10) })
  }

  /**
   * Updates the task's assignee
   * @param {string} userId - ID of the selected user
   */
  const handleAssigneeChange = (userId: string) => {
    const user = users.find(u => u.id.toString() === userId)
    if (user) {
      onTaskUpdate({ ...task, assignee: user.name })
    }
  }

  /**
   * Updates the task's due date
   * @param {string} date - New due date in ISO format
   */
  const handleDateChange = (date: string) => {
    onTaskUpdate({ ...task, dueDate: date })
  }

  /**
   * Adds a new label to the task
   * @param {string} label - Label to add
   */
  const handleAddLabel = (label: string) => {
    const labels = task.labels || []
    onTaskUpdate({ ...task, labels: [...labels, label] })
  }

  /**
   * Removes a label from the task
   * @param {string} label - Label to remove
   */
  const handleRemoveLabel = (label: string) => {
    const labels = task.labels || []
    onTaskUpdate({ ...task, labels: labels.filter(l => l !== label) })
  }

  /**
   * Adds a new dependency to the task
   * @param {string} dependency - Task ID to add as dependency
   */
  const handleAddDependency = (dependency: string) => {
    const dependencies = task.dependencies || []
    onTaskUpdate({ ...task, dependencies: [...dependencies, dependency] })
  }

  /**
   * Removes a dependency from the task
   * @param {string} dependency - Task ID to remove from dependencies
   */
  const handleRemoveDependency = (dependency: string) => {
    const dependencies = task.dependencies || []
    onTaskUpdate({ 
      ...task, 
      dependencies: dependencies.filter(d => d !== dependency)
    })
  }

  return (
    <div className="properties-panel">
      <div className="space-y-2">
        {/* Task ID */}
        <div className="property-section">
          <div className="property-label">ID</div>
          <div className="task-id">{task.id}</div>
        </div>

        {/* Status */}
        <div className="property-section">
          <div className="property-label">Status</div>
          <Select.Root value={task.status} onValueChange={handleStatusChange}>
            <Select.Trigger className="SelectTrigger" data-type="status">
              <Select.Value>
                <div className="property-value-content">
                  <div className={`status-indicator status-${task.status}`} />
                  <span className="property-value-text">
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </Select.Value>
              <Select.Icon>
                <ChevronDown className="property-icon" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={4}
                align="start"
                className="SelectContent"
                avoidCollisions
              >
                <Select.ScrollUpButton className="SelectScrollButton">
                  <ChevronDown className="rotate-180" />
                </Select.ScrollUpButton>
                <Select.Viewport className="SelectViewport">
                  {statuses.map(status => (
                    <Select.Item
                      key={status}
                      value={status}
                      className="SelectItem"
                      data-type="status"
                    >
                      <div className={`status-indicator status-${status}`} />
                      <Select.ItemText>
                        {status.replace('_', ' ')}
                      </Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="SelectScrollButton">
                  <ChevronDown />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Assignee */}
        <div className="property-section">
          <div className="property-label">Assignee</div>
          <Select.Root 
            value={users.find(u => u.name === task.assignee)?.id.toString() || ''} 
            onValueChange={handleAssigneeChange}
          >
            <Select.Trigger className="SelectTrigger">
              <Select.Value>
                <div className="property-value-content">
                  <span className="property-value-text">
                    {task.assignee || 'Unassigned'}
                  </span>
                </div>
              </Select.Value>
              <Select.Icon>
                <ChevronDown className="property-icon" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={4}
                align="start"
                className="SelectContent"
                avoidCollisions
              >
                <Select.ScrollUpButton className="SelectScrollButton">
                  <ChevronDown className="rotate-180" />
                </Select.ScrollUpButton>
                <Select.Viewport className="SelectViewport">
                  {users.map(user => (
                    <Select.Item
                      key={user.id}
                      value={user.id.toString()}
                      className="SelectItem"
                    >
                      <Select.ItemText>{user.name}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="SelectScrollButton">
                  <ChevronDown />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Priority */}
        <div className="property-section">
          <div className="property-label">Priority</div>
          <Select.Root value={task.priority} onValueChange={handlePriorityChange}>
            <Select.Trigger className="SelectTrigger" data-type="priority">
              <Select.Value>
                <div className="property-value-content">
                  <div className={`priority-indicator priority-${task.priority}`} />
                  <span className="property-value-text">{task.priority}</span>
                </div>
              </Select.Value>
              <Select.Icon>
                <ChevronDown className="property-icon" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={4}
                align="start"
                className="SelectContent"
                avoidCollisions
              >
                <Select.ScrollUpButton className="SelectScrollButton">
                  <ChevronDown className="rotate-180" />
                </Select.ScrollUpButton>
                <Select.Viewport className="SelectViewport">
                  {priorities.map(priority => (
                    <Select.Item
                      key={priority}
                      value={priority}
                      className="SelectItem"
                      data-type="priority"
                    >
                      <div className={`priority-indicator priority-${priority}`} />
                      <Select.ItemText>{priority}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="SelectScrollButton">
                  <ChevronDown />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Story Points */}
        <div className="property-section">
          <div className="property-label">Story Points</div>
          <Select.Root 
            value={task.storyPoints?.toString() || ''} 
            onValueChange={handlePointsChange}
          >
            <Select.Trigger className="SelectTrigger">
              <Select.Value>
                <div className="property-value-content">
                  <span className="property-value-text">
                    {task.storyPoints || 'Unestimated'}
                  </span>
                </div>
              </Select.Value>
              <Select.Icon>
                <ChevronDown className="property-icon" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={4}
                align="start"
                className="SelectContent"
                avoidCollisions
              >
                <Select.Viewport className="SelectViewport">
                  {points.map(point => (
                    <Select.Item
                      key={point}
                      value={point.toString()}
                      className="SelectItem"
                    >
                      <Select.ItemText>{point}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Due Date */}
        <div className="property-section">
          <div className="property-label">Due Date</div>
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="SelectTrigger"
          />
        </div>

        {/* Labels */}
        <div className="property-section">
          <div className="property-label">Labels</div>
          <div className="labels-container">
            {task.labels?.map(label => (
              <div key={label} className="label">
                {label}
                <button
                  onClick={() => handleRemoveLabel(label)}
                  className="label-remove"
                  aria-label={`Remove ${label} label`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddLabel('frontend')}
              className="add-label"
            >
              <Plus className="w-3 h-3" />
              Add label
            </button>
          </div>
        </div>

        {/* Dependencies */}
        <div className="property-section">
          <div className="property-label">Dependencies</div>
          <div className="space-y-2">
            {task.dependencies?.map(dep => (
              <div key={dep} className="dependency-item">
                <span>{dep}</span>
                <button
                  onClick={() => handleRemoveDependency(dep)}
                  className="dependency-remove"
                  aria-label={`Remove ${dep} dependency`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddDependency('TASK-7835')}
              className="add-dependency"
            >
              <Plus className="w-4 h-4" />
              Add dependency
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 