import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import ChartBar from './ChartBar'
import { useLanguage } from '../hooks/useLanguage'
import { calculateAverage, standardDeviation, classifyData, getMonthName } from '../util/helpers'

// The component for showing 2 bar charts of readings on the main page: one for the most recent month containing
// readings, and the other for entire reading history.
const StatGrid = ({ data }) => {
  const [loading, setLoading] = useState(true)
  const [averages, setAverages] = useState({})
  const [stdDevs, setStdDevs] = useState({})
  const [classifiedData, setClassifiedData] = useState({})
  const texts = useLanguage()
  
  useEffect(() => {
    // Destructuring data object into a basic array containing objects of each blood pressure reading in users data.
    const monthsInData = Object.keys(data.entries)
    let entriesInMonths = []
    monthsInData.forEach(month => {
      for (let day in data.entries[month]) {
        entriesInMonths.push(...data.entries[month][day].readings)
      }
    })

    // Calculating the averages and standard deviations for readings in the current/latest month (mostRecentMonth).
    // The other field (allMonths) contains all readings, including the latest month. 
    const latestMonth = entriesInMonths.filter(m => 
      m.monthObjectKey === monthsInData[monthsInData.length - 1])
    
    const averages = {
      allMonths: calculateAverage(entriesInMonths),
      mostRecentMonth: calculateAverage(latestMonth)
    }

    const stdDevs = {
      allMonths: standardDeviation(entriesInMonths, averages.allMonths),
      mostRecentMonth: standardDeviation(latestMonth, averages.mostRecentMonth)
    }

    // Calculations are saved into component state. The classifiedData state contains objects storing the amount
    // of entries belonging to each group, e.g. systolic readings within the range 120-129 etc. The keys in these
    // objects are used as data stamps in the bar charts. Also the names of the first and the last month containing
    // readings are stored to be used as chart headings.
    setStdDevs(stdDevs)    
    setAverages(averages)
    setClassifiedData({
      allMonths: classifyData(entriesInMonths),
      mostRecentMonth: classifyData(latestMonth),
      firstMonth: `${getMonthName(monthsInData[0], texts.lan.toLowerCase())}`,
      lastMonth: `${getMonthName(monthsInData[monthsInData.length - 1], texts.lan.toLowerCase())}`
    })
    setLoading(false)
  }, [data, texts])
  
  // The chart for all months (the second grid-item) is shown only if there are readings in more than 1 months.
  return (
    <div className='grid'>
      {loading ? <Loader /> :
        <>
          <div className='info grid-item'>
            <h4 className='grid-item-heading'>{classifiedData.lastMonth}</h4>
            <div className='flex-cont'>
              <div className='grid-item-data'>
                <h5 style={{ margin: '0.4em 0' }}>{texts.main.stats.avg}</h5>
                <div className='sys'>{texts.main.stats.sys}<span>{averages.mostRecentMonth.systolic}</span></div>
                <div className='dia'>{texts.main.stats.dia}<span>{averages.mostRecentMonth.diastolic}</span></div>
                <div className='pul'>{texts.main.stats.pul}<span>{averages.mostRecentMonth.pulse}</span></div>
              </div>
              <div className='grid-item-data'>
                <h5 style={{ margin: '0.4em 0' }}>{texts.main.stats.dev}</h5>
                <div className='sys'>{texts.main.stats.sys}<span>{stdDevs.mostRecentMonth.systolic}</span></div>
                <div className='dia'>{texts.main.stats.dia}<span>{stdDevs.mostRecentMonth.diastolic}</span></div>
              </div>
              <div className='grid-item-data chart-wrap'>
                <ChartBar entries={classifiedData.mostRecentMonth}/>
              </div>
            </div>
          </div>
          {Object.keys(data.entries).length > 1 && 
            <div className='info grid-item'>
              <h4 className='grid-item-heading'>{`${classifiedData.firstMonth} - ${classifiedData.lastMonth}`}</h4>
              <div className='flex-cont'>
                <div className='grid-item-data'>
                  <h5 style={{margin: '0.4em 0'}}>{texts.main.stats.avg}</h5>
                  <div className='sys'>{texts.main.stats.sys}<span>{averages.allMonths.systolic}</span></div>
                  <div className='dia'>{texts.main.stats.dia}<span>{averages.allMonths.diastolic}</span></div>
                  <div className='pul'>{texts.main.stats.pul}<span>{averages.allMonths.pulse}</span></div>
                </div>
                <div className='grid-item-data'>
                  <h5 style={{margin: '0.4em 0'}}>{texts.main.stats.dev}</h5>
                  <div className='sys'>{texts.main.stats.sys}<span>{stdDevs.allMonths.systolic}</span></div>
                  <div className='dia'>{texts.main.stats.dia}<span>{stdDevs.allMonths.diastolic}</span></div>
                </div>
                <div className='grid-item-data chart-wrap'>
                  <ChartBar entries={classifiedData.allMonths}/>
                </div>
              </div>
            </div>}
        </>}
    </div>
  )
}

export default StatGrid
