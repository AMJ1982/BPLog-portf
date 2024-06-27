import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMonth, initialize } from '../reducers/viewReducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faAngleDown  } from '@fortawesome/free-solid-svg-icons'
import { getMonthName } from '../util/helpers'

// Time selection tools are used as a part of swiper views to select the year and the month from which the
// blood pressure readings are shown at a time. The selection is set to Redux state in viewReducer to be
// reflected to all relevant components of the application.
const TimeSelectionBar = ({ selectedMonth }) => {
  const dispatch = useDispatch()
  // Defining the first and the last month containing entries to determine if prev and/or next arrows are shown.
  const [monthObjectKeys, firstEntryMonth, lastEntryMonth, lan] = useSelector(({ view, data, lan }) => {    
    if (!data || Object.keys(data) === 0) return null
    const keys = Object.keys(data.entries)
    return [keys, keys[0], keys[keys.length - 1], lan]
  })
  /* Moving to previous or next month. Finds the index of currently selected month
     in monthObjectKeys array. The index is used in dispatches to select the next or previous month: 
     if previous is chosen, decreasing index by one to select the preceding index in monthObjectKeys.
  */ 
  const handleIconClick = (event) => {
    const iconName = event.target.firstChild.dataset.icon
    const index = monthObjectKeys.findIndex((key) => {
      return key === selectedMonth
    })
    // Whether to set the month to next or previous is determined by the name of the icon.
    if (iconName === 'angle-left') dispatch(setMonth(monthObjectKeys[index - 1]))
    if (iconName === 'angle-right') dispatch(setMonth(monthObjectKeys[index + 1]))    
  }

  // Options for Select component. The month numbers derived from monthObjectKeys is converted
  // to month name.
  const options = () => {
    return monthObjectKeys.map(mok =>
      <option key={mok} value={mok}>
        {getMonthName(mok, lan)}
      </option>
    )    
  }

  if (!monthObjectKeys.includes(selectedMonth)) return null

  // Showing prev and next arrows if the first or last month of the list isn't selected
  return (
    <div className='view-option-bar' id='time-selection-bar'>
      <div>
        {selectedMonth.toString() !== firstEntryMonth &&
        <div className='icon-div' onClick={handleIconClick}>
          <FontAwesomeIcon className='icon' icon={faAngleLeft} />
        </div>
        }
      </div>
      <select
        value={selectedMonth}
        className='view-option month'
        onChange={({ target }) => {
          dispatch(setMonth(target.value))
        }}
      >
        {options()}
      </select>
      <div>
        {selectedMonth.toString() !== lastEntryMonth &&
        <div className='icon-div' onClick={handleIconClick}>
          <FontAwesomeIcon className='icon' icon={faAngleRight} />
        </div>
        }
      </div>
    </div>
  )
}

export default TimeSelectionBar