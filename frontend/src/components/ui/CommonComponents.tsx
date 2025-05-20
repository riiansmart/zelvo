/**
 * CommonComponents.tsx
 * Collection of reusable UI components with consistent styling and accessibility.
 * Implements common patterns for error handling, selection, and date/time input.
 */

// Error Message Component
/**
 * Props for the ErrorMessage component
 * @interface ErrorMessageProps
 * @property {string | null} message - Error message to display, null to hide
 */
interface ErrorMessageProps {
  message: string | null
}

/**
 * ErrorMessage Component
 * Displays error messages in a consistent, accessible format.
 * Features:
 * - Red alert styling
 * - Responsive layout
 * - ARIA role for accessibility
 * - Conditional rendering
 * 
 * @param {ErrorMessageProps} props - Component props
 * @returns {JSX.Element | null} The error message component or null
 */
export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  )
}

// Category Select Component
/**
 * Props for the CategorySelect component
 * @interface CategorySelectProps
 * @property {Array<{id: number, name: string}>} categories - List of available categories
 * @property {number | null} selectedId - Currently selected category ID
 * @property {function} onChange - Callback when selection changes
 */
interface CategorySelectProps {
  categories: { id: number; name: string }[]
  selectedId: number | null
  onChange: (id: number) => void
}

/**
 * CategorySelect Component
 * Dropdown selector for category selection with consistent styling.
 * Features:
 * - Theme-aware styling
 * - Focus states
 * - Default option
 * - Type-safe value handling
 * 
 * @param {CategorySelectProps} props - Component props
 * @returns {JSX.Element} The category select component
 */
export function CategorySelect({ categories, selectedId, onChange }: CategorySelectProps) {
  return (
    <select
      value={selectedId ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-primary text-primary border border-default rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <option value="">Select category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
  )
}

// DateTimeSelector Component
/**
 * Props for the DateTimeSelector component
 * @interface DateTimeSelectorProps
 * @property {string} value - Current datetime value in ISO format
 * @property {function} onChange - Callback when datetime changes
 * @property {string} [label] - Optional label text
 * @property {boolean} [required] - Whether the field is required
 */
interface DateTimeSelectorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
}

/**
 * DateTimeSelector Component
 * Native datetime input with consistent styling and labeling.
 * Features:
 * - Theme-aware styling
 * - Optional labeling
 * - Required field indicator
 * - Focus states
 * - HTML5 datetime-local input
 * 
 * @param {DateTimeSelectorProps} props - Component props
 * @returns {JSX.Element} The datetime selector component
 */
export function DateTimeSelector({
  value,
  onChange,
  label = 'Date and Time',
  required = false
}: DateTimeSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-secondary">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="bg-primary text-primary border border-default rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  )
} 