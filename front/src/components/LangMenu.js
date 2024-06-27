import React from 'react'
import { useDispatch } from 'react-redux'
import { setLan } from '../reducers/languageReducer'

// The language menu shown in navigation bar.
const LangMenu = () => {
  const dispatch = useDispatch()

  // Setting the selected language to languageReducer. This Redux state is used globally to determine
  // which language object is used in the components.
  const handleClick = (e) => {
    dispatch(setLan(e.target.closest('.link').getAttribute('name')))
  }

  return (
    <div>
      <div className='link' name='fi' onClick={handleClick}>
        <div className='icon-div'>
          <img src={require('../img/fi.png')} className='flag' />
        </div>
        FI       
      </div>
      <div className='link' name='en' onClick={handleClick}>
        <div className='icon-div'>
          <img src={require('../img/en.png')} className='flag' />
        </div>
        EN
      </div>
    </div>
  )
}

export default LangMenu