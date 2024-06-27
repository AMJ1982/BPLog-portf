import React, { useContext } from 'react'
import Logo from './Logo'
import Dropdown from './Dropdown'
import UserMenu from './UserMenu'
import LangMenu from './LangMenu'
import { ModalContext } from '../App'
import { useLanguage } from '../hooks/useLanguage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faAngleDown } from '@fortawesome/free-solid-svg-icons'

// The component for navigation bar.
const Nav = ({ user }) => {  
  const texts = useLanguage()
  const [openModal] = useContext(ModalContext)

  // Forming the content to be shown in navigation bar. If a user is logged in, the user icon is shown. Otherwise buttons
  // for logging in or signing up to the service are shown instead.
  const menuContent = () => {
    return (
      <>
        {user ?
          <>
            <div className='icon-div dropdown' data-dropdown style={{ position: 'static' }}>
              <FontAwesomeIcon className='icon icon-nav' icon={faUser} />
              <Dropdown>
                <UserMenu user={user} texts={texts}/>  
              </Dropdown>              
            </div>
          </> :
          <>
            <div data-form-type='login' className='link' onClick={(e) => openModal(e)}>{texts.nav.login}</div>
            <div data-form-type='createAccount' className='link' onClick={(e) => openModal(e)}>{texts.nav.signUp}</div>
          </>
        }
      </>
    )
  }
  
  return (
    <>
      <div id='nav-bar'>
        <Logo />
        <div className='link-group'>          
          <div className='link dropdown' data-dropdown>
            {texts.lan}
            <FontAwesomeIcon 
              className='icon icon-nav'
              icon={faAngleDown}
              style={{ margin: 0, padding: 0, width: '15px' }}
            />
            <Dropdown>
              <LangMenu />
            </Dropdown> 
          </div>
          {menuContent()}</div>        
      </div>
    </>
  )
}

export default Nav