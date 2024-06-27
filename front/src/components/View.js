import React, { useState, useContext, useMemo, useEffect } from 'react'
import { ModalContext } from '../App'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { selectTimePeriod } from '../reducers/viewReducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLanguage } from '../hooks/useLanguage'
import { faChartLine, faList, faPlus, faHome } from '@fortawesome/free-solid-svg-icons'
import SwiperView from './Swiper'

// A component for view selection allowing the user to limit the amount of shown entries from whole month
// to one week or day. The selected time period is saved as Redux state. Whenever it's changed, this component
// is re-rendered.
const ViewOptions = ({ timePeriod, texts }) => {
  // Collecting view option elements (day, week, month).
  const views = useMemo(() => document.getElementsByClassName('view-option'), [])
  const dispatch = useDispatch()

  // Adding class 'selected' to the view option representing the currently active time period.
  // Only one option can be selected at a time.
  useEffect(() => {
    for (let view of views) {
      if (view.id === timePeriod.toString()) view.classList.add('selected')
      else (view.classList.remove('selected'))
    }
  }, [timePeriod])  

  // When a time period option is clicked, the Redux state of selected time period in viewReducer is updated.
  return (
    <>
      <div className='view-option-bar'>
        <div id='1' className='view-option' onClick={() => dispatch(selectTimePeriod('day'))}>{texts.view.viewOptions.day}</div>
        <div id='7' className='view-option' onClick={() => dispatch(selectTimePeriod('week'))}>{texts.view.viewOptions.week}</div>
        <div id='31' className='view-option' onClick={() => dispatch(selectTimePeriod('month'))}>{texts.view.viewOptions.month}</div>
      </div>
    </>
  )
}

// The main view for saved blood pressure readings. It shows the entries of one month at a time as swiper slides as a list. If there
// are entries for more than 1 day in the month, the view can be toggled between a list and a line chart.
const View = () => {
  const [openModal] = useContext(ModalContext)
  const [view, setView] = useState('list')
  const [rawData, timePeriod, selectedMonth, user] = useSelector(state => [state.data, state.view.timePeriod, state.view.month, state.login], shallowEqual)
  const data = Object.entries(rawData.entries)
  const swiperView = useMemo(() => <SwiperView viewType={view}/>, [view] )
  const texts = useLanguage()
  const navigate = useNavigate()
  
  // If selected month has less than 2 days with entries, line chart can't be selected as view type.
  const enableChart = useMemo(() => {
    const month = data.find(m => m[0] === selectedMonth)
    
    return selectedMonth && (month !== undefined)
      ? Object.keys(month[1]).length > 1
      : false
  }, [selectedMonth, rawData])

  // If there's no data, user is redirected to main view. Effect hook is used to prevent simultaneous rendering of two components.
  useEffect(() => {
    if (data.length < 1) navigate('/')
  }, [rawData])

  return (
    <div>
      {(user && data.length > 0) &&
        <>
          <div className='data-container'>        
            <ViewOptions timePeriod={timePeriod} texts={texts}/>
            {swiperView}
            {/* The bottom bar of the view. This could be refactored into a designated component. */}
            <div className='icon-bar'>
              <div className='icon-div' onClick={() => navigate('/')}>
                <FontAwesomeIcon className='icon' icon={faHome} />
                <div className='icon-text'>{texts.view.iconBar.home}</div>
              </div>
              <div data-form-type='createRecord' className='icon-div' onClick={(e) => openModal(e)}>
                <FontAwesomeIcon className='icon' icon={faPlus} />
                <div className='icon-text'>{texts.view.iconBar.new}</div>
              </div>
              <div className='icon-div' onClick={() => setView('list')}>
                <FontAwesomeIcon className='icon' icon={faList} />
                <div className='icon-text'>{texts.view.iconBar.list}</div>
              </div>
              {enableChart && <div className='icon-div' onClick={() => setView('chart')}>
                <FontAwesomeIcon className='icon' icon={faChartLine} />
                <div className='icon-text'>{texts.view.iconBar.chart}</div>
              </div>}
            </div>          
          </div>
          <div id='bottom-block'></div>
        </>
      }
    </div>
  )
}

export default View