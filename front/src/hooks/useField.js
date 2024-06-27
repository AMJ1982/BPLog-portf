import { useState } from 'react'

// A hook for centering the functionality of different kinds of fields. Not in use at the moment.
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }
  
  return {
    type,
    value,
    onChange
  }
}