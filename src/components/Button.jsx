import React from 'react'
import './Button.css'

/**
 * Button Component
 * 
 * @param {string} text - Button text content
 * @param {function} onClick - Click handler function
 * @param {string} variant - Button variant (primary, secondary, etc.)
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Whether button is disabled
 */
const Button = ({ 
  text = 'Button', 
  onClick, 
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`button button-${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  )
}

export default Button


