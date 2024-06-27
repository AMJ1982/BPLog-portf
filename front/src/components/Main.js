import React, { useContext, useMemo } from 'react'
import StatGrid from './StatGrid'
import { ModalContext } from '../App'
import { useLanguage } from '../hooks/useLanguage'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faBookMedical } from '@fortawesome/free-solid-svg-icons'

// The main page component.
const Main = ({ user, data }) => {
  const [openModal] = useContext(ModalContext)
  const texts = useLanguage()

  // If user has some saved entries, a link to the View component is shown and StatGrid component is rendered.
  const userHasData = useMemo(() => {
    return 'entries' in data 
      ? Object.keys(data.entries).length > 0
      : false
  }, [data])
  
  return (
    <div className='data-container'>
      <div className='info'>
        {user
          ? <h1>{`${texts.main.greetingLogged}, ${user.name.split(' ')[0]}`}</h1>
          : <h1>{texts.main.greetingNotLogged[0]}<br />{texts.main.greetingNotLogged[1]}</h1>}
      </div>
      {user &&
        <>
          <div className='flex-cont'>        
            <div data-form-type='createRecord' className='icon-div info main-function' onClick={(e) => openModal(e)}>
              <FontAwesomeIcon className='icon' icon={faPlus} />
              <p style={{ margin: '0.5em', pointerEvents: 'none' }}>{texts.main.new}</p>
            </div>        
            {userHasData &&
              <Link className='icon-div info main-function' to={'/view'}>
                <FontAwesomeIcon className='icon' icon={faBookMedical} />
                <p style={{ margin: '0.5em', pointerEvents: 'none' }}>{texts.main.view}</p>
              </Link>
            }
          </div>
          {userHasData && <StatGrid data={data} />}
        </>}
    </div>
  )
}

export default Main
