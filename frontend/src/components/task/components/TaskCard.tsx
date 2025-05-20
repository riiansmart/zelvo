/**
 * TaskCard.tsx
 * Card component for displaying task information in a compact, interactive format.
 * Implements a modern, clean design with status indicators and hover states.
 */

import { Task } from '../../../types/task.types'
import { Card, CardBody, CardHeader, Chip } from '@nextui-org/react'
import { TaskPriority } from '../../../types/task.types'

/**
 * Props for the TaskCard component
 * @interface TaskCardProps
 * @property {Task} task - Task data to display
 * @property {function} [onClick] - Optional callback when card is clicked
 */
interface TaskCardProps {
  task: Task
  onClick?: (task: Task) => void
}

/**
 * TaskCard Component
 * Displays task information in a card format with visual status indicators.
 * Features:
 * - Interactive hover states
 * - Priority color coding
 * - Status chips
 * - Truncated description
 * - Assignee display
 * 
 * Visual Hierarchy:
 * 1. Header
 *    - Task ID
 *    - Title
 *    - Priority chip
 * 2. Body
 *    - Truncated description (2 lines)
 *    - Status chip
 *    - Assignee name
 * 
 * Priority Colors:
 * - High: Danger (red)
 * - Medium: Warning (yellow)
 * - Low: Success (green)
 * 
 * @param {TaskCardProps} props - Component props
 * @returns {JSX.Element} The task card component
 */
export function TaskCard({ task, onClick }: TaskCardProps) {
  /**
   * Handles card click events
   * Only triggers if onClick handler is provided
   */
  const handleClick = () => {
    onClick?.(task)
  }

  return (
    <Card 
      isPressable={!!onClick}
      onPress={handleClick}
      className="w-full"
    >
      {/* Card Header - Task ID, Title, and Priority */}
      <CardHeader className="flex justify-between">
        <div className="flex flex-col">
          <p className="text-small text-default-500">#{task.id}</p>
          <p className="text-md font-semibold">{task.title}</p>
        </div>
        <Chip
          size="sm"
          variant="flat"
          color={task.priority === TaskPriority.HIGH ? 'danger' : task.priority === TaskPriority.MEDIUM ? 'warning' : 'success'}
        >
          {task.priority}
        </Chip>
      </CardHeader>
      {/* Card Body - Description, Status, and Assignee */}
      <CardBody>
        <p className="text-small text-default-500 line-clamp-2">{task.description}</p>
        <div className="flex justify-between items-center mt-2">
          <Chip size="sm" variant="flat">{task.status}</Chip>
          <p className="text-small text-default-500">{task.assignee}</p>
        </div>
      </CardBody>
    </Card>
  )
} 