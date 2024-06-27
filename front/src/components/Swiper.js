import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import ListItem from './ListItem'
import TimeSelectionBar from './TimeSelectionBar'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { setMonth } from '../reducers/viewReducer'
import { sortByDayNumber } from '../util/helpers'
import { useLanguage } from '../hooks/useLanguage'
import 'swiper/css'
const Chart = lazy(() => import('./Chart'))

// Constructs an array of ListItems to be placed into a 'data-container' in View component. The content is presented as swiper slides.
// The viewType property determines whether the slides are populated with list views or line charts. Tools for creating a pdf-file of
// currently active slide included.
const SwiperView = ({ viewType }) => {
  const [slidesList, setSlidesList] = useState(null)
  const [slidesChart, setSlidesChart] = useState(null)
  const [swiper, setSwiper] = useState(null)
  const [data, selectedMonth, timePeriod, user, lan] = useSelector(state => [state.data, state.view.month, state.view.timePeriod, state.login, state.lan], shallowEqual)
  const values = Object.entries(data.entries)
  const [initialSlide] = useState(() => values.findIndex((m) => m[0] === selectedMonth))
  const dispatch = useDispatch()
  const texts = useLanguage()
  const listItemsRef = useRef()
  const chartsRef = useRef()

  // Creating slides for swiper. Detects changes by watching values stored in component state.
  useEffect(() => {
    listItemsRef.current = []
    chartsRef.current = []
    // If all values are deleted, slides are discarded.
    if (values.length < 1) {
      setSlidesList(null)
      setSlidesChart(null)
      return
    }

    if (viewType === 'list') {
      return setSlidesList(values.map(m => {
        return createSlide(m)
      }))
    }
    setSlidesChart(values.map(m => {
      // Creating chart slide only if iterated month contains entries at least for 2 days.
      if (Object.keys(m[1]).length > 1) return createSlide(m)
    }))
  }, [data, viewType, timePeriod])
  
  // Setting the active slide in the swiper to correspond with the currently selected month in viewReducer.
  useEffect(() => {    
    if (swiper) {
      const selectedMonthIndex = values.findIndex((m) => m[0] === selectedMonth)      
      if (selectedMonthIndex >= 0) swiper.activeIndex = selectedMonthIndex
      swiper.update()
    }
  }, [slidesList, slidesChart, selectedMonth])
  
  // A method to expand individual readings on the list. Each ListItem (created in createSlide) is saved in 
  // in reference listItemRef, through which toggleExpanded has an access to expand() methods 
  // in ListItems. This method is forwarded to ListItems as a prop.
  const toggleExpanded = useCallback((itemKey) => {    
    for (let key in listItemsRef.current) {
      if (listItemsRef.current[key] === null) continue
      key === itemKey
        ? listItemsRef.current[key].expand()
        : listItemsRef.current[key].expand(false)
    }
  }, [])

  // A helper method for creating a slides of readings in requested month. The slides are stored into component state
  // and used as content for Swiper component.
  const createSlide = useCallback((month) => {
    const [monthObjectKey, days] = month
    // Creating entry array from month data, which is sorted by day number and shortened according to the currently
    // selected time period (day, week, month).
    const daysArr = Object.entries(days).sort(sortByDayNumber).slice(0, timePeriod)
    
    // If the selected viewType is 'list', creating ListItems of each entry. Otherwise a line chart is constructed.
    return (
      <SwiperSlide key={`${monthObjectKey}-${viewType}-slide`} data-month-object-key={monthObjectKey}>
        {viewType === 'list'
          ? daysArr.map(day => {
            const key = `${day[0]}-${viewType}`
            // Created items are also added into the array in listItemsRef.current.
            return <ListItem ref={(elem) => listItemsRef.current[key] = elem} key={key} day={day} toggleExpanded={toggleExpanded}/>
          }) :
          <Suspense>
            <Chart 
              ref={(elem) => chartsRef.current[`${month[0]}-${viewType}`] = elem}
              key={`${monthObjectKey}-${viewType}`}
              month={daysArr}
            />
          </Suspense>
        }
      </SwiperSlide>
    )    
  }, [viewType, timePeriod])
  
  if (!slidesList && !slidesChart || !values) return null

  // Loading PDF file asynchronously. Function pdf creates a blob of given content, which is saved by file-saver.
  const downloadPdf = async () => {
    // Sorting day objects inside a month by date
    const sortForPdf = () =>
      Object.entries(values.find(obj => obj[0] === selectedMonth)[1]).sort(sortByDayNumber)

    const PDFDoc = (await import('./PDFDoc')).default
    const { pdf } = (await import('@react-pdf/renderer')).default
    const blob = await pdf((
      <PDFDoc 
        contents={sortForPdf()}
        chartImg={(viewType === 'chart') && chartsRef.current[`${selectedMonth}-chart`].toImage()}
        user={user}
        monthObjectKey={selectedMonth}
        lan={lan}
        texts={texts}
      />
    )).toBlob()    
    const { saveAs } = (await import('file-saver')).default
    saveAs(blob, `${selectedMonth}-${viewType}`)
  }
  
  return (
    <>
      <TimeSelectionBar selectedMonth={selectedMonth}/>
      <button className='pdf-btn' onClick={downloadPdf}>{texts.view.pdf.btn}</button>    
      <Swiper
        className='list-item-wrapper'
        spaceBetween={100}
        autoHeight={false}
        onSlideChange={(swiper) => {
          const month = swiper.slides[swiper.activeIndex]?.dataset.monthObjectKey
          dispatch(setMonth(month))
        }}
        onSwiper={setSwiper}
        initialSlide={initialSlide}
        observer={true}
      >
        { viewType === 'list' ? slidesList : slidesChart }
      </Swiper>
    </>
  )
}

export default SwiperView