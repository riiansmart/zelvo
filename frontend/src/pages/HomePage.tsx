import { useState, useEffect } from 'react'
import { getTasks } from '../services/taskService'
import { useAuth } from '../hooks/useAuth'
import { Task, TaskPriority, TaskStatus } from '../types/task.types'
// import { Category } from '../types/category.types' // Removed - Definition not found
// import { getCategories } from '../services/categoryService' // Removed unused import

// Define Priority type locally based on Task interface
// type Priority = 'low' | 'medium' | 'high'; // Removed local Priority type

export default function HomePage() {
  const { token } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'ALL'>('ALL')
  const [loading, setLoading] = useState<boolean>(true)
  // const [categories, setCategories] = useState<Category[]>([]) // Commented out
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    
    setLoading(true)
    setError(null)
    
    getTasks()
      .then(response => {
        // Check if response is an array or has a content property
        if (Array.isArray(response)) {
          setTasks(response);
        } else if (response && response.content) {
          setTasks(response.content);
        } else {
          setTasks([]);
        }
        setLoading(false);
      })
      .catch(() => { // Remove unused err parameter
        setError('Failed to load tasks. Please try again later.');
        setTasks([]);
        setLoading(false);
      });
  }, [token])

  /* // Commented out category fetching until type is found
  useEffect(() => {
    if (!token) return;
    getCategories()
      .then(setCategories)
      .catch(err => console.error('Failed to load categories:', err));
  }, [token]);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map(c => [c.id, c] as [number, Category])),
    [categories]
  );
  */

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  return (
    // Apply cyberpunk theme classes to ensure consistency
    <div className="container mx-auto px-4 py-8">
      <section className="welcome-section mb-8"> {/* Use cyberpunk class? Add margin */}
        <h1 className="welcome-text">Welcome back</h1>
        <p className="welcome-description">Here's a list of your tasks for this month</p>
      </section>

      {error && (
        <div className="error-message mb-4"> {/* Add margin */}
          {error}
        </div>
      )}

      {/* Ensure toolbar uses cyberpunk classes */}
      <div className="toolbar mb-6"> {/* Add margin */} 
        <div className="search-container">
          <i className="fas fa-search search-icon" />
          <input
            className="search-input"
            placeholder="Filter tasks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-options">
          {(['ALL', TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH] as const).map(p => (
            <button
              key={p}
              className={`filter-button${filterPriority === p ? ' active' : ''}`}
              onClick={() => setFilterPriority(p)}
            >
              {p === 'ALL' ? 'ALL' : p} 
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-message text-center py-10"> {/* Add styles */}
          <i className="fas fa-spinner fa-spin text-2xl mr-2"></i> Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-message text-center py-10"> {/* Add styles */}
          <i className="fas fa-tasks text-4xl mb-3 block"></i>
          <p>No tasks found. Create a new task to get started!</p>
        </div>
      ) : (
        // Ensure task list uses cyberpunk classes
        <div className="task-list">
          <div className="task-list-header">
            <div className="task-list-header-item task-header-checkbox"><input type="checkbox" disabled /></div>
            <div className="task-list-header-item task-header-id sortable">#</div>
            <div className="task-list-header-item sortable">Title</div>
            {/* <div className="task-list-header-item task-header-type sortable">Type</div> */} {/* Removed Type column */}
            <div className="task-list-header-item sortable">Status</div>
            <div className="task-list-header-item sortable">Priority</div>
            <div className="task-list-header-item task-header-date sortable">Due Date</div>
            <div className="task-list-header-item task-header-actions">Actions</div>
          </div>
          <div className="task-list-body">
            {filteredTasks.map(task => {
              // const cat = task.categoryId != null ? categoryMap[task.categoryId] : undefined; // Commented out
              return (
                <div key={task.id} className="task-item">
                  {/* Use task.status instead of task.completed */}
                  <div className="task-cell task-cell-checkbox"><input type="checkbox" className="task-checkbox" checked={task.status === TaskStatus.DONE} readOnly /></div> 
                  <div className="task-cell task-cell-id"><span className="task-id">TASK-{task.id}</span></div>
                  <div className="task-cell"><div className="task-title task-title-tooltip" data-tooltip={task.description}>{task.title}</div></div>
                  {/* Type column: Use task.type from interface */}
                  {/* <div className="task-cell task-cell-type">
                    <span className="task-type">
                       {/* Example icon logic, adjust as needed */}
                  {/*    <i className={`fas fa-${task.type === 'bug' ? 'bug' : task.type === 'feature' ? 'star' : 'wrench'} task-type-icon`} /> 
                      {task.type} 
                    </span>
                  </div> */} {/* Removed Type cell */}
                   {/* Status column: Use task.status */}
                  <div className="task-cell">
                    {/* Use task.status for class and text */} 
                    <span className={`status-pill status-${task.status.toLowerCase().replace('_', '')}`}> 
                      {/* Example icon logic, adjust as needed */} 
                      <i className={`fas fa-${task.status === TaskStatus.DONE ? 'check-circle' : task.status === TaskStatus.IN_PROGRESS ? 'sync-alt fa-spin' : task.status === TaskStatus.REVIEW ? 'search' : 'circle-notch'}`} /> 
                      {task.status} 
                    </span>
                  </div>
                  <div className="task-cell"><span className={`priority-indicator priority-${task.priority.toLowerCase()}`}><span className={`priority-dot dot-${task.priority.toLowerCase()}`}></span> {task.priority}</span></div>
                  <div className="task-cell task-cell-date"><span className={`task-due${new Date(task.dueDate) < new Date() ? ' overdue' : ''}`}>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span></div>
                  <div className="task-cell task-cell-actions">
                    <div className="action-buttons">
                       {/* Add navigation/functionality later */}
                      <button className="action-button edit-button"><i className="fas fa-edit" /></button>
                      <button className="action-button delete-button"><i className="fas fa-trash" /></button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 