import React, { useState } from 'react'
import userService from '../services/userService'
import { updateLoggedUser } from '../reducers/loginReducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faSignOut, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../reducers/loginReducer'

// The main menu for user options. This is displayed as a dropdown when clicking the user icon in navigation bar.
const UserMenu = ({ user, texts }) => {
  const [light, setLight] = useState(document.body.classList.contains('light'))
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // Toggling between light and dark themes. The preferred selection is also saved in the user object in the database.
  // Finally the updated user object is dispatched to the updateLoggedUser action in loginReducer where the user object
  // is updated to Redux state and local storage.
  const toggleTheme = async () => {
    document.body.classList.toggle('light')
    setLight(prev => !prev)    
    const userObj = await userService.getOne(user.id)
    const updatedUser = await userService.update({...userObj, lightTheme: !light })
    dispatch(updateLoggedUser(updatedUser))
  }
  
  // Logging out navigates to the main page and clears tokens along with local storage in
  // loginReducer.logout action.
  const handleLogout = async (e) => {
    e.preventDefault()
    navigate('/')   
    dispatch(logout())
  }

  return (
    <div>
      <div className='dropdown-header'>{user.name}</div>
      <div className='separator-line'></div>
      <Link className='link' to={'/user'}>
        <div className='icon-div'>
          <FontAwesomeIcon icon={faCog} />
        </div>
        {texts.nav.dropDown.settings}
      </Link>
      <div className='link' onClick={toggleTheme}>
        <div className='icon-div'>
          <FontAwesomeIcon icon={light ? faMoon : faSun} />
        </div>
        {light ? texts.nav.dropDown.dark : texts.nav.dropDown.light}
      </div>
      <div className='link' onClick={(e) => handleLogout(e)}>
        <div className='icon-div'>
          <FontAwesomeIcon icon={faSignOut} />
        </div>
        {texts.nav.dropDown.logout}
      </div>
    </div>
  )
}

export default UserMenu