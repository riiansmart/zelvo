/**
 * TaskEditor.tsx
 * Form component for editing existing task details.
 * Implements a controlled form with real-time updates and validation.
 */

import { useState } from 'react'
import { Task, TaskStatus, TaskPriority } from '../../../types/task.types'
import { Card, CardBody, Input, Textarea, Select, SelectItem, Button } from '@nextui-org/react'

/**
 * Props for the TaskEditor component
 * @interface TaskEditorProps
 * @property {Task} task - Task data to edit
 * @property {function} onSave - Callback when changes are saved
 */
interface TaskEditorProps {
  task: Task
  onSave: (task: Task) => void
}

/**
 * TaskEditor Component
 * Provides a form interface for editing task details.
 * Features:
 * - Real-time field updates
 * - Field-specific validation
 * - Status and priority selection
 * - Story point estimation
 * - Due date selection
 * - Assignee management
 * 
 * Form Fields:
 * 1. Title - Text input
 * 2. Description - Textarea
 * 3. Status - Select dropdown
 * 4. Priority - Select dropdown
 * 5. Story Points - Number input
 * 6. Due Date - Date input
 * 7. Assignee - Text input
 * 
 * State Management:
 * - Maintains local state for edited task
 * - Only propagates changes on save
 * - Preserves original task until saved
 * 
 * @param {TaskEditorProps} props - Component props
 * @returns {JSX.Element} The task editor component
 */
export function TaskEditor({ task, onSave }: TaskEditorProps) {
  // Track local changes to task data
  const [editedTask, setEditedTask] = useState<Task>(task)

  /**
   * Generic change handler for string fields
   * @param {keyof Task} field - Name of the task field to update
   * @returns {function} Change handler function
   */
  const handleChange = (field: keyof Task) => (value: string) => {
    setEditedTask(prev => ({ ...prev, [field]: value }))
  }

  /**
   * Specialized change handler for numeric fields
   * Converts string input to number or undefined
   * @param {keyof Task} field - Name of the task field to update
   * @returns {function} Change handler function
   */
  const handleNumberChange = (field: keyof Task) => (value: string) => {
    setEditedTask(prev => ({ ...prev, [field]: value ? Number(value) : undefined }))
  }

  /**
   * Saves the edited task
   * Propagates all changes to parent component
   */
  const handleSave = () => {
    onSave(editedTask)
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        {/* Basic Task Information */}
        <Input
          label="Title"
          value={editedTask.title}
          onValueChange={handleChange('title')}
        />
        <Textarea
          label="Description"
          value={editedTask.description}
          onValueChange={handleChange('description')}
        />

        {/* Task Status and Priority */}
        <Select
          label="Status"
          selectedKeys={[editedTask.status]}
          onSelectionChange={(keys) => {
            const status = Array.from(keys)[0] as TaskStatus
            setEditedTask(prev => ({ ...prev, status }))
          }}
        >
          {Object.values(TaskStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Priority"
          selectedKeys={[editedTask.priority]}
          onSelectionChange={(keys) => {
            const priority = Array.from(keys)[0] as TaskPriority
            setEditedTask(prev => ({ ...prev, priority }))
          }}
        >
          {Object.values(TaskPriority).map((priority) => (
            <SelectItem key={priority} value={priority}>
              {priority}
            </SelectItem>
          ))}
        </Select>

        {/* Task Planning Fields */}
        <Input
          type="number"
          label="Story Points"
          value={editedTask.storyPoints?.toString() || ''}
          onValueChange={handleNumberChange('storyPoints')}
        />
        <Input
          type="date"
          label="Due Date"
          value={editedTask.dueDate}
          onValueChange={handleChange('dueDate')}
        />
        <Input
          label="Assignee"
          value={editedTask.assignee}
          onValueChange={handleChange('assignee')}
        />

        {/* Save Button */}
        <Button color="primary" onPress={handleSave}>
          Save Changes
        </Button>
      </CardBody>
    </Card>
  )
} 