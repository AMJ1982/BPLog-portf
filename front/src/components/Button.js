import React from 'react'

// A component encapsulating creation of button elements.
const Button = ({ text, type, onClick, className, style, disabled }) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >{text}</button>
  )
}

export default Button