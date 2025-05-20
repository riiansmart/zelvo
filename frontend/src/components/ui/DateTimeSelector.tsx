/**
 * DateTimeSelector.tsx
 * Custom date and time selector component with dropdown controls.
 * Provides a user-friendly interface for selecting dates and times in 12-hour format.
 */

import React from 'react'

/**
 * Props for the DateTimeSelector component
 * @interface DateTimeSelectorProps
 * @property {Date} value - Currently selected date and time
 * @property {function} onChange - Callback when date/time is changed
 */
interface DateTimeSelectorProps {
  value: Date
  onChange: (date: Date) => void
}

/**
 * DateTimeSelector Component
 * A custom date and time picker using native select elements.
 * Features:
 * - Month, day, year selection
 * - 12-hour time format with AM/PM
 * - 5-minute interval time selection
 * - Automatic date validation
 * - Accessible dropdown controls
 * 
 * Time Format:
 * - Hours: 1-12
 * - Minutes: 00-55 (5-minute intervals)
 * - Period: AM/PM
 * 
 * Date Range:
 * - Years: Current year + 5 years
 * - Months: All 12 months
 * - Days: Automatically adjusted for selected month
 * 
 * @param {DateTimeSelectorProps} props - Component props
 * @returns {JSX.Element} The date/time selector component
 */
const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({ value, onChange }) => {
  // Extract current date/time components
  const current = value || new Date()
  const year = current.getFullYear()
  const month = current.getMonth()
  const day = current.getDate()
  const hour24 = current.getHours()
  const ampm = hour24 >= 12 ? 'PM' : 'AM'
  let hour12 = hour24 % 12
  if (hour12 === 0) hour12 = 12
  const minute = current.getMinutes()

  // Generate options for dropdowns
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const currentYear = new Date().getFullYear()
  const years = Array.from({length: 6}, (_, i) => currentYear + i)  // Current year + 5
  const daysInMonth = new Date(year, month + 1, 0).getDate()        // Get days in selected month
  const days = Array.from({length: daysInMonth}, (_, i) => i + 1)   // 1 to last day of month
  const hours = Array.from({length: 12}, (_, i) => i + 1)           // 1 to 12
  const minutes = Array.from({length: 12}, (_, i) => i * 5)         // 0, 5, 10, ..., 55
  const ampmArr = ['AM', 'PM']

  /**
   * Handles changes to any date/time field
   * Updates the date object while maintaining other fields
   * @param {string} field - Field being updated (year, month, day, hour, minute, ampm)
   * @param {number | string} val - New value for the field
   */
  const handleFieldChange = (field: string, val: number | string) => {
    let newYear = year
    let newMonth = month
    let newDay = day
    let newHour = hour12
    let newMinute = minute
    let newAmPm = ampm
    
    // Update appropriate field
    switch (field) {
      case 'year': newYear = Number(val); break
      case 'month': newMonth = Number(val); break
      case 'day': newDay = Number(val); break
      case 'hour': newHour = Number(val); break
      case 'minute': newMinute = Number(val); break
      case 'ampm': newAmPm = String(val); break
    }
    
    // Convert 12-hour to 24-hour format
    let adjustedHour = newHour
    if (newAmPm === 'PM' && newHour < 12) adjustedHour = newHour + 12
    if (newAmPm === 'AM' && newHour === 12) adjustedHour = 0
    
    // Create and propagate new date
    const updated = new Date(newYear, newMonth, newDay, adjustedHour, newMinute)
    onChange(updated)
  }

  return (
    <div className="date-time-selector">
      {/* Month selector */}
      <select className="form-select" value={month} onChange={e => handleFieldChange('month', Number(e.target.value))}>
        {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
      </select>
      {/* Day selector - updates based on month */}
      <select className="form-select" value={day} onChange={e => handleFieldChange('day', Number(e.target.value))}>
        {days.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      {/* Year selector - current year + 5 */}
      <select className="form-select" value={year} onChange={e => handleFieldChange('year', Number(e.target.value))}>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      {/* Hour selector - 12-hour format */}
      <select className="form-select" value={hour12} onChange={e => handleFieldChange('hour', Number(e.target.value))}>
        {hours.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      {/* Minute selector - 5-minute intervals */}
      <select className="form-select" value={minute} onChange={e => handleFieldChange('minute', Number(e.target.value))}>
        {minutes.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
      </select>
      {/* AM/PM selector */}
      <select className="form-select" value={ampm} onChange={e => handleFieldChange('ampm', e.target.value)}>
        {ampmArr.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
  )
}

export default DateTimeSelector 