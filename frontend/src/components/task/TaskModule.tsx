/**
 * TaskModule.tsx
 * Main task management interface component that combines task listing and editing.
 * Implements a master-detail pattern for task management.
 */

import { useState } from 'react'
import { Task } from '../../types/task.types'
import { TaskEditor, TaskForm, TaskCard } from './components'
import { Button } from '@nextui-org/react'

/**
 * Props for the TaskModule component
 * @interface TaskModuleProps
 * @property {Task[]} tasks - Array of tasks to display
 * @property {function} onTaskCreate - Callback when a new task is created
 * @property {function} onTaskUpdate - Callback when an existing task is updated
 */
interface TaskModuleProps {
  tasks: Task[]
  onTaskCreate: (task: Partial<Task>) => void
  onTaskUpdate: (task: Task) => void
}

/**
 * TaskModule Component
 * Main task management interface with list and detail views.
 * Features:
 * - Task list with card previews
 * - Task creation form
 * - Task editor for existing tasks
 * - Responsive two-panel layout
 * 
 * Layout:
 * - Left panel: Task list and create button
 * - Right panel: Task editor or creation form
 * 
 * States:
 * - Viewing: No task selected
 * - Creating: New task form visible
 * - Editing: Existing task open in editor
 * 
 * @param {TaskModuleProps} props - Component props
 * @returns {JSX.Element} The task module component
 */
export function TaskModule({ tasks, onTaskCreate, onTaskUpdate }: TaskModuleProps) {
  // Track currently selected task and creation mode
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  /**
   * Handles clicking a task in the list
   * Opens the task in the editor panel
   * @param {Task} task - The selected task
   */
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsCreating(false)
  }

  /**
   * Handles clicking the create button
   * Opens the task creation form
   */
  const handleCreateClick = () => {
    setSelectedTask(null)
    setIsCreating(true)
  }

  /**
   * Handles submitting a new task
   * Creates the task and exits creation mode
   * @param {Partial<Task>} taskData - The new task data
   */
  const handleTaskSubmit = (taskData: Partial<Task>) => {
    onTaskCreate(taskData)
    setIsCreating(false)
  }

  /**
   * Handles saving changes to an existing task
   * Updates the task and closes the editor
   * @param {Task} task - The updated task
   */
  const handleTaskSave = (task: Task) => {
    onTaskUpdate(task)
    setSelectedTask(null)
  }

  return (
    <div className="flex h-full">
      {/* Task List Panel */}
      <div className="w-1/3 p-4 border-r border-default overflow-y-auto">
        {/* Create Task Button */}
        <div className="mb-4">
          <Button 
            color="primary"
            onPress={handleCreateClick}
          >
            Create New Task
          </Button>
        </div>
        {/* Task Card List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={handleTaskClick}
            />
          ))}
        </div>
      </div>

      {/* Task Detail Panel */}
      <div className="flex-1 p-4">
        {isCreating ? (
          <TaskForm onSubmit={handleTaskSubmit} />
        ) : selectedTask ? (
          <TaskEditor task={selectedTask} onSave={handleTaskSave} />
        ) : (
          <div className="flex items-center justify-center h-full text-default-500">
            Select a task to view or edit
          </div>
        )}
      </div>
    </div>
  )
} 