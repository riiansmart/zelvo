/**
 * MainContentPanel.tsx
 * Central panel component that displays task details and enables task editing.
 * Features a tabbed interface for managing multiple open tasks and a rich markdown editor.
 */

import { Task, ActivityLog } from '../types/task.types'  // Task type definitions
import { FileText, X, Edit2, Eye, Check, Copy } from 'lucide-react'  // UI icons
import '../styles/taskflow-dashboard.css'  // Component styles
import MDEditor from '@uiw/react-md-editor'  // Markdown editor component
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'  // Theme context for editor styling

/**
 * Props for the MainContentPanel component
 * @interface MainContentPanelProps
 * @property {Task[]} openTasks - Array of currently open tasks
 * @property {string | null} activeTaskId - ID of the currently active task
 * @property {function} onTabSelect - Callback when a tab is selected
 * @property {function} onCloseTab - Callback when a tab is closed
 * @property {function} onTaskUpdate - Callback when a task is updated
 */
interface MainContentPanelProps {
  openTasks: Task[]
  activeTaskId: string | null
  onTabSelect: (taskId: string) => void
  onCloseTab: (taskId: string) => void
  onTaskUpdate: (task: Task) => void
}

/**
 * MainContentPanel Component
 * Displays task details in a tabbed interface with editing capabilities.
 * Features:
 * - Tabbed interface for multiple tasks
 * - Markdown editor for task description
 * - Task metadata display
 * - Activity timeline
 * - Acceptance criteria list
 * - Label management
 * 
 * @param {MainContentPanelProps} props - Component props
 * @returns {JSX.Element} The main content panel component
 */
export function MainContentPanel({ 
  openTasks,
  activeTaskId,
  onTabSelect,
  onCloseTab,
  onTaskUpdate
}: MainContentPanelProps) {
  // Theme context for editor styling
  const { isLightMode } = useTheme()
  const colorMode = isLightMode ? 'light' : 'dark'

  // Local state management
  const [isEditing, setIsEditing] = useState(false)  // Toggle between edit/preview mode
  const [copySuccess, setCopySuccess] = useState(false)  // Track copy operation success
  
  // Get the currently active task
  const activeTask = openTasks.find(task => task.id === activeTaskId)

  /**
   * Handles changes to the task description in the markdown editor
   * @param {string} value - New description content
   */
  const handleDescriptionChange = (value?: string) => {
    if (activeTask && value !== undefined) {
      onTaskUpdate({
        ...activeTask,
        description: value
      })
    }
  }

  /**
   * Handles copying task description to clipboard
   * Shows success indicator temporarily
   */
  const handleCopyContent = async () => {
    if (activeTask?.description) {
      try {
        await navigator.clipboard.writeText(activeTask.description)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        console.error('Failed to copy text:', err)
      }
    }
  }

  return (
    <div className="main-content">
      {/* Tab Bar - Displays open tasks */}
      <div className="tabs-bar">
        {openTasks.length === 0 ? (
          <div className="px-4 py-2 text-muted text-sm italic">No tasks open</div>
        ) : (
          openTasks.map(task => (
            <div 
              key={task.id}
              onClick={() => onTabSelect(task.id)}
              className={`tab ${task.id === activeTaskId ? 'active' : ''}`}
              role="tab"
              aria-selected={task.id === activeTaskId}
              tabIndex={0}
            >
              <FileText className="flex-shrink-0 mr-2" size={14} /> 
              <span className="truncate max-w-[200px]">{task.title}</span>
              <button 
                onClick={(e) => { 
                  e.stopPropagation()
                  onCloseTab(task.id)
                }}
                className="ml-2 p-1 rounded-sm hover:bg-secondary"
                aria-label={`Close ${task.title}`}
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Task Detail Area */}
      <div className="task-content">
        {activeTask ? (
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Task Header - ID, Status, Priority */}
            <div className="task-header mb-8">
              <div className="task-badges flex items-center gap-3 mb-4">
                <span className="task-badge id px-2.5 py-1.5 bg-secondary/50 text-muted rounded-md text-sm font-mono">
                  {activeTask.id}
                </span>
                <span className="task-badge status px-2.5 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 bg-secondary/50">
                  <span className={`status-indicator status-${activeTask.status} w-2 h-2 rounded-full`} />
                  <span className={`text-${activeTask.status.toLowerCase().replace('_', '-')}`}>
                    {activeTask.status.replace('_', ' ')}
                  </span>
                </span>
                <span className={`task-badge priority px-2.5 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 bg-secondary/50 text-${activeTask.priority.toLowerCase()}`}>
                  <span className={`w-2 h-2 rounded-full bg-${activeTask.priority.toLowerCase()}`} />
                  {activeTask.priority}
                </span>
              </div>
              <h2 className="text-2xl font-medium text-white">{activeTask.title}</h2>
            </div>
            
            <div className="space-y-8">
              {/* Description Section with Markdown Editor */}
              <div className="task-section">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="task-section-title">Description</h3>
                  <div className="flex items-center gap-2">
                    {/* Copy Content Button */}
                    <button
                      onClick={handleCopyContent}
                      className="p-1.5 rounded hover:bg-secondary text-secondary hover:text-primary transition-colors"
                      title="Copy content"
                    >
                      {copySuccess ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                    {/* Toggle Edit/Preview Button */}
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-1.5 rounded hover:bg-secondary text-secondary hover:text-primary transition-colors"
                      title={isEditing ? 'Preview' : 'Edit'}
                    >
                      {isEditing ? <Eye size={16} /> : <Edit2 size={16} />}
                    </button>
                  </div>
                </div>
                {/* Markdown Editor/Preview */}
                <div className="markdown-editor bg-secondary">
                  {isEditing ? (
                    <MDEditor
                      value={activeTask.description || ''}
                      onChange={handleDescriptionChange}
                      preview="edit"
                      height={400}
                      data-color-mode={colorMode}
                      className="bg-secondary"
                      hideToolbar={false}
                      toolbarHeight={40}
                      visibleDragbar={false}
                      enableScroll={true}
                      textareaProps={{
                        placeholder: 'Write your description here...',
                        spellCheck: false,
                        style: {
                          fontSize: '14px',
                          lineHeight: '1.6',
                          fontFamily: "'SF Mono', Monaco, Menlo, Consolas, monospace",
                        }
                      }}
                      previewOptions={{
                        skipHtml: false
                      }}
                    />
                  ) : (
                    <div className="markdown-preview border border-default bg-secondary">
                      <MDEditor.Markdown 
                        source={activeTask.description || 'No description provided.'} 
                        className="text-primary"
                        data-color-mode={colorMode}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Acceptance Criteria Section */}
              <div className="task-section">
                <h3 className="task-section-title mb-4 text-primary">Acceptance Criteria</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {activeTask.acceptanceCriteria?.map((criteria: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-accent" />
                      <span>{criteria}</span>
                    </li>
                  )) || (
                    <li className="text-gray-500 italic">No acceptance criteria specified.</li>
                  )}
                </ul>
              </div>
              
              {/* Labels Section */}
              {activeTask.labels && activeTask.labels.length > 0 && (
                <div className="task-section">
                  <h3 className="task-section-title mb-4">Labels</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeTask.labels.map(label => (
                      <span 
                        key={label} 
                        className={`px-2 py-1 text-xs rounded-md bg-opacity-20 ${getLabelColor(label)}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Activity Timeline Section */}
              <div className="task-section">
                <h3 className="task-section-title mb-4">Activity</h3>
                <div className="space-y-4">
                  {activeTask.activity?.map((activity: ActivityLog, index: number) => (
                    <div key={index} className="task-activity bg-tertiary rounded-lg p-4">
                      <div className="activity-header flex items-center gap-3 mb-2">
                        <div className="activity-avatar w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                          {activity.user.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="activity-meta">
                          <span className="activity-user font-medium text-white">{activity.user}</span>
                          <span className="activity-date text-sm text-gray-400 ml-2">{activity.date}</span>
                        </div>
                      </div>
                      <p className="activity-content text-sm text-gray-300">{activity.comment}</p>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 italic">No activity recorded.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {openTasks.length > 0 
              ? 'Select an open tab to view details.'
              : 'Select a task from the explorer to open it.'}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Helper function to get the appropriate CSS class for a label's color
 * @param {string} label - The label text
 * @returns {string} CSS class name for the label color
 */
function getLabelColor(label: string): string {
  switch (label.toLowerCase()) {
    case 'frontend':
    case 'backend':
    case 'database':
    case 'security':
    case 'feature':
    case 'bug':
    case 'ui':
    case 'mobile':
      return 'bg-accent/20 text-accent'
    default:
      return 'bg-secondary text-secondary'
  }
} 