/**
 * TaskFlowDashboard.tsx
 * Main dashboard component that implements the core task management interface.
 * Features a multi-panel layout with explorer, content, properties, and timeline views.
 */

import { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'  // Resizable panel system
import { ExplorerPanel } from './ExplorerPanel'        // Task explorer/navigation panel
import { MainContentPanel } from './MainContentPanel'  // Main task content display
import { TimelinePanel } from './TimelinePanel'        // Timeline visualization
import { PropertiesPanel } from './PropertiesPanel'    // Task properties editor
import { Task } from '../types/task.types'  // Task-related types
import { Clock } from 'lucide-react'                   // Icon components
import { MenuBar } from './MenuBar'
import { mockTasks, mockUsers } from '../data/mockData'

/**
 * TaskFlowDashboard Component
 * Implements a VSCode-inspired interface with:
 * - Left sidebar for task exploration
 * - Central area for task content
 * - Right sidebar for task properties
 * - Optional timeline view at bottom
 * 
 * Features:
 * - Multi-panel layout with resizable panels
 * - Task selection and management
 * - Tab-based task navigation
 * - Real-time task updates
 * 
 * @returns {JSX.Element} The dashboard component
 */
export function TaskFlowDashboard() {
  // State Management
  const [tasks, setTasks] = useState<Task[]>(mockTasks)           // All available tasks
  const [openTasks, setOpenTasks] = useState<Task[]>([])            // Currently open tasks
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)  // Selected task
  const [isTimelineVisible, setIsTimelineVisible] = useState(true)   // Timeline visibility

  /**
   * Handles task selection from the explorer panel
   * - Opens the task if not already open
   * - Sets it as the active task
   * @param taskId - ID of the selected task
   */
  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    if (!openTasks.some(t => t.id === taskId)) {
      setOpenTasks(prev => [...prev, task])
    }
    setActiveTaskId(taskId)
  }

  /**
   * Handles tab selection in the main content area
   * @param taskId - ID of the task to activate
   */
  const handleTabSelect = (taskId: string) => {
    setActiveTaskId(taskId)
  }

  /**
   * Handles closing a task tab
   * - Removes task from open tasks
   * - Updates active task if necessary
   * @param taskId - ID of the task to close
   */
  const handleCloseTab = (taskId: string) => {
    setOpenTasks(prev => prev.filter(t => t.id !== taskId))
    if (activeTaskId === taskId) {
      setActiveTaskId(openTasks[openTasks.length - 2]?.id || null)
    }
  }

  /**
   * Handles task updates from any panel
   * - Updates task in both tasks and openTasks arrays
   * @param updatedTask - The modified task object
   */
  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
    setOpenTasks(prev => prev.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  /**
   * Toggles the visibility of the timeline panel
   */
  const toggleTimeline = () => {
    setIsTimelineVisible(prev => !prev)
  }

  const handleViewChange = (panelId: string) => {
    console.log("View change requested for panel:", panelId); // Placeholder
  };

  // Get the currently active task object
  const activeTask = tasks.find(t => t.id === activeTaskId)

  return (
    <div className="dashboard-container">
      <MenuBar 
        onViewChange={handleViewChange}
        onTimelineToggle={toggleTimeline}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Explorer Panel */}
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <div className="panel">
              <ExplorerPanel 
                tasks={tasks}
                onTaskSelect={handleTaskSelect}
                activeTaskId={activeTaskId}
              />
            </div>
          </Panel>

          <PanelResizeHandle className="panel-resize-handle" />

          {/* Main Content Panel */}
          <Panel defaultSize={60} minSize={30}>
            <div className="panel-content">
              <MainContentPanel 
                openTasks={openTasks}
                activeTaskId={activeTaskId}
                onTabSelect={handleTabSelect}
                onCloseTab={handleCloseTab}
                onTaskUpdate={handleTaskUpdate}
              />
            </div>
          </Panel>

          <PanelResizeHandle className="panel-resize-handle" />

          {/* Properties Panel */}
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <div className="panel">
              <PropertiesPanel 
                task={activeTask}
                users={mockUsers}
                onTaskUpdate={handleTaskUpdate}
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Timeline Panel */}
      {isTimelineVisible && (
        <div className="timeline-container">
          <TimelinePanel 
            tasks={tasks}
            onClose={() => setIsTimelineVisible(false)}
            onMaximize={() => {
              // TODO: Implement maximize functionality
              console.log('Maximize timeline')
            }}
          />
        </div>
      )}

      {/* Status Bar */}
      <div className="status-bar">
        <button 
          className="flex items-center gap-1 text-xs hover:text-accent px-2 py-1"
          onClick={() => setIsTimelineVisible(!isTimelineVisible)}
        >
          <Clock size={14} />
          <span>Timeline</span>
        </button>
      </div>
    </div>
  )
}

export default TaskFlowDashboard 