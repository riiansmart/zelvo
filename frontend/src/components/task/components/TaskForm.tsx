/**
 * TaskForm.tsx
 * Form component for creating new tasks or updating existing ones.
 * Implements an uncontrolled form pattern using FormData for efficient form handling.
 */

import React from 'react'
import { Task, TaskStatus, TaskPriority } from '../../../types/task.types'
import { Card, CardBody, Input, Select, SelectItem, Textarea, Button } from '@nextui-org/react'

/**
 * Props for the TaskForm component
 * @interface TaskFormProps
 * @property {Task} [task] - Optional existing task for updates
 * @property {function} onSubmit - Callback when form is submitted
 */
interface TaskFormProps {
  task?: Task
  onSubmit: (task: Partial<Task>) => void
}

/**
 * TaskForm Component
 * Provides a form interface for task creation and updates.
 * Features:
 * - Uncontrolled form pattern
 * - FormData-based submission
 * - Required field validation
 * - Default values for updates
 * - Type-safe form handling
 * 
 * Form Fields:
 * 1. Title (required)
 *    - Text input
 *    - Primary task identifier
 * 
 * 2. Description
 *    - Textarea
 *    - Detailed task information
 * 
 * 3. Status (required)
 *    - Select dropdown
 *    - Task workflow state
 * 
 * 4. Priority (required)
 *    - Select dropdown
 *    - Task importance level
 * 
 * 5. Due Date
 *    - Date input
 *    - Task deadline
 * 
 * 6. Assignee
 *    - Text input
 *    - Task owner
 * 
 * 7. Story Points
 *    - Number input
 *    - Effort estimation
 * 
 * @param {TaskFormProps} props - Component props
 * @returns {JSX.Element} The task form component
 */
export function TaskForm({ task, onSubmit }: TaskFormProps) {
  /**
   * Handles form submission
   * Collects form data and converts it to task format
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Extract form data
    const formData = new FormData(e.target as HTMLFormElement)
    
    // Convert form data to task object
    const taskData: Partial<Task> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as TaskStatus,
      priority: formData.get('priority') as TaskPriority,
      dueDate: formData.get('dueDate') as string,
      assignee: formData.get('assignee') as string,
      storyPoints: Number(formData.get('storyPoints'))
    }
    
    onSubmit(taskData)
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Identification */}
          <Input
            name="title"
            label="Title"
            defaultValue={task?.title}
            isRequired
          />
          <Textarea
            name="description"
            label="Description"
            defaultValue={task?.description}
          />

          {/* Task Status and Priority */}
          <Select
            name="status"
            label="Status"
            defaultSelectedKeys={task ? [task.status] : undefined}
            isRequired
          >
            {Object.values(TaskStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </Select>
          <Select
            name="priority"
            label="Priority"
            defaultSelectedKeys={task ? [task.priority] : undefined}
            isRequired
          >
            {Object.values(TaskPriority).map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </Select>

          {/* Task Planning and Assignment */}
          <Input
            name="dueDate"
            label="Due Date"
            type="date"
            defaultValue={task?.dueDate}
          />
          <Input
            name="assignee"
            label="Assignee"
            defaultValue={task?.assignee}
          />
          <Input
            name="storyPoints"
            label="Story Points"
            type="number"
            defaultValue={task?.storyPoints?.toString()}
          />

          {/* Submit Button */}
          <Button type="submit" color="primary">
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
} 