import React from 'react'

// A wrapper component for dropdown menus.
const Dropdown = (props) => {

  return (
    <div className='dropdown-menu'>
      {props.children}
    </div>
  )
}

export default Dropdown