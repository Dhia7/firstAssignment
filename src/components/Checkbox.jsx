import { useRef, useEffect, useState } from 'react'
import './Checkbox.css'

/**
 * Custom Checkbox Component
 * 
 * Each checkbox has its own independent clickCount state:
 * - "All pages" checkbox uses external clickCount (from App.jsx)
 * - Page 1, 2, 3, 4 each use their own local clickCount (independent from each other)
 * 
 * @param {string} id - Unique identifier for the checkbox
 * @param {boolean} checked - Whether the checkbox is checked
 * @param {function} onChange - Callback function when checkbox state changes
 * @param {boolean} indeterminate - Whether checkbox is in indeterminate state
 * @param {string} className - Additional CSS classes
 * @param {number} clickCount - External clickCount (for "All pages" checkbox)
 * @param {function} setClickCount - External setClickCount (for "All pages" checkbox)
 */
const Checkbox = ({ 
  id, 
  checked = false, 
  onChange, 
  indeterminate = false, 
  className = '',
  clickCount: externalClickCount,
  setClickCount: externalSetClickCount
}) => {
  const checkboxRef = useRef(null)
  
  // Each checkbox has its own independent local clickCount state
  // "All pages" uses externalClickCount, Page 1-4 use their own localClickCount
  const [localClickCount, setLocalClickCount] = useState(0)
  
  // Use external clickCount if provided ("All pages"), otherwise use local (Page 1-4)
  const clickCount = externalClickCount !== undefined ? externalClickCount : localClickCount
  const setClickCount = externalSetClickCount || setLocalClickCount
  
  // Check if this checkbox can control its clickCount
  const canControlClickCount = externalSetClickCount !== undefined || externalClickCount === undefined

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  // Click state style configuration - same styles for all checkboxes
  const clickStateStyles = {
    1: {
      '--checkbox-border-color': '#BDBDBD',
      '--checkmark-border-color': '#E3E3E3',
      '--checkmark-left': '8px',
      '--checkmark-top': '7px'
    },
    2: {
      '--checkbox-border-color': 'rgba(36, 106, 246, 0.2)',
      '--checkmark-border-color': '#878787',
      '--checkmark-bg-color': '#FFFFFF',
      '--checkmark-left': '8px',
      '--checkmark-top': '7px',
    },
    3: {
      '--dynamic-checkbox-color': '#5087F8',
      '--checkbox-border-color': '#5087F8',
      '--checkmark-border-color': '#FFFFFF',
      '--checkmark-border-width': '1px',
      '--checkmark-left': '8px',
      '--checkmark-top': '7px',
      '--hide-inner-square': 'none'
    },
    4: {
      '--dynamic-checkbox-color': '#2469F6',
      '--checkbox-border-color': '#2469F6',
      '--checkmark-border-color': '#FFFFFF',
      '--checkmark-border-width': '1px',
      '--checkmark-left': '8px',
      '--checkmark-top': '7px',
      '--hide-inner-square': 'none'
    }
  }

  const handleChange = (e) => {
    const maxClickState = Math.max(...Object.keys(clickStateStyles).map(Number))
    
    // If checkbox is already checked and user clicks to uncheck
    if (checked && !e.target.checked) {
      // If at max state (4), allow uncheck
      if (clickCount >= maxClickState) {
        if (canControlClickCount) {
          setClickCount(0)
        }
        if (onChange) {
          onChange(e)
        }
      } else {
        // Not at max state - increment clickCount and keep checked
        if (canControlClickCount) {
          setClickCount(prev => prev + 1)
        }
        // Force checkbox to stay checked
        setTimeout(() => {
          if (checkboxRef.current) {
            checkboxRef.current.checked = true
          }
        }, 0)
        // Notify parent to keep it checked
        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              checked: true
            },
            preventDefault: () => {}
          }
          onChange(syntheticEvent)
        }
      }
    } else if (e.target.checked && !checked) {
      // First time checking - set clickCount to 1
      if (canControlClickCount) {
        setClickCount(1)
      }
      if (onChange) {
        onChange(e)
      }
    } else if (!e.target.checked) {
      // Unchecking - reset clickCount to 0
      if (canControlClickCount) {
        setClickCount(0)
      }
      if (onChange) {
        onChange(e)
      }
    }
  }

  // Calculate checkmark position offset based on border width
  const calculateCheckmarkOffset = (borderWidth) => {
    // Use 1.5px as default to match CSS default border width
    const defaultBorderWidth = 1.5
    const currentBorderWidth = parseFloat(borderWidth) || defaultBorderWidth
    const offset = (currentBorderWidth - defaultBorderWidth) / 2
    return offset
  }

  // Apply styles based on click count
  // Each checkbox uses its own independent clickCount value
  const getDynamicStyles = () => {
    if (!checked) return {}
    
    // Get styles for current clickCount
    const availableCounts = Object.keys(clickStateStyles).map(Number).sort((a, b) => a - b)
    const targetCount = availableCounts.filter(count => clickCount >= count).pop() || availableCounts[0]
    
    const styles = clickStateStyles[targetCount] || {}
    
    // Set checkmark position - use the same fixed position for all clickCount states
    const defaultLeft = 8
    const defaultTop = 7
    
    // Always use the same fixed position for all states to ensure consistency
    styles['--checkmark-left'] = `${defaultLeft}px`
    styles['--checkmark-top'] = `${defaultTop}px`
    
    return styles
  }

  return (
    <div 
      className={`checkbox-wrapper ${className}`.trim()}
      style={getDynamicStyles()}
    >
      <input
        type="checkbox"
        id={id}
        ref={checkboxRef}
        checked={checked}
        onChange={handleChange}
        className="custom-checkbox"
        aria-checked={checked}
        aria-label={id === 'selectAll' ? 'Select all pages' : `Select ${id}`}
      />
      <label htmlFor={id} className="checkbox-label" aria-hidden="true" />
    </div>
  )
}

export default Checkbox
