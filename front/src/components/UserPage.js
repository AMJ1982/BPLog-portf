import React from 'react'
import { UserSettingsForm } from './forms'
import { useSelector } from 'react-redux'

// A wrapper component for user settings form. Unlike the other forms, this is shown on
// an individual page instead of a modal view.
const UserPage = () => {
  const [user] = useSelector(state => [state.login])
  return (
    <UserSettingsForm user={user}/>
  )
}

export default UserPage