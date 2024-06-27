import React, { useState, useImperativeHandle, lazy, Suspense } from 'react'
import Loader from './Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp  } from '@fortawesome/free-solid-svg-icons'
import { calculateAverage, sortByTime } from '../util/helpers'
import { useLanguage } from '../hooks/useLanguage'
const Entry = lazy(() => import('./Entry'))

// A component representing a single data entry. List type views in Swiper are constructed
// of ListItems.
const ListItem = React.forwardRef((props, ref) => {
  const [expanded, setExpanded] = useState(false)
  const texts = useLanguage()
  const [date, entries] = props.day
  const [monthNum, dayNum, year] = date.split('/')

  // Toggles the expanded state of of this component. More information about the entry
  // is shown in expanded views.
  const expand = (value = null) => {    
    setExpanded(value === null ? !expanded : value)
  }

  // Distributing the expand method via ref.
  useImperativeHandle(ref, () => {
    return { expand }
  })

  // Sorting individual readings by time stamps and creating Entry components. The sorting method
  // resides in helpers.js.
  const createEntries = () =>
    [...entries.readings]
      .sort(sortByTime)
      .map(entry => <Entry key={entry.id} content={entry} texts={texts}/>)
  
  const dayAverage = calculateAverage(entries.readings)
  
  return (
    <>    
      <div className='list-item' onClick={() => {
        props.toggleExpanded(`${date}-list`)}}>
        
        <div className='item-field-bp-cont outer'>          
          <div className='item-field-bp-cont'>
            <div className='item-field-bp'>
              <div className='item-bp'>{dayNum}</div>
              <div className='guide-text'>{`${monthNum}/${year}`}</div>
            </div>      
            
            <div className='item-field-bp'>
              <div className='guide-text'>{texts.view.listItem.sys}</div>
              <div className='item-bp sys'>{dayAverage.systolic}</div>
              <div className='guide-text'>mmHg</div>
            </div>

            <div className='item-field-bp'>
              <div className='guide-text'>{texts.view.listItem.dia}</div>
              <div className='item-bp dia'> {dayAverage.diastolic}</div>
              <div className='guide-text'>mmHg</div>
            </div>

            <div className='item-field-bp'>
              <div className='guide-text'>{texts.view.listItem.pul}</div>
              <div className='item-bp pul'>{dayAverage.pulse}</div>
              <div className='guide-text'>bpm</div>
            </div>          
          </div>
          <div className='item-field-bp'>
            {expanded ? 
              <div className='item-bp'>
                <span className='list-guide-text'>{texts.view.listItem.showLess}</span>
                <FontAwesomeIcon icon={faAngleUp} />
              </div> :
              <div className='item-bp'>
                <span className='list-guide-text'>{texts.view.listItem.showMore}</span>
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            }
          </div>          
        </div>
        {expanded ?
          <div className='item-cont-expanded'>            
            <div className='guide-text'>{texts.view.listItem.entry.entries}</div>
            <div>
              <Suspense fallback={<Loader />}>
                {createEntries()}
              </Suspense>
            </div>            
          </div> : null
        }      
      </div>
    </>
  )
})

ListItem.displayName = 'ListItem'

export default ListItem