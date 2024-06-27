// A collection of helper methods used globally in the application.

import { languages } from '../languages/languages'
// Highest given id. Used to give an id for upcoming entries.
// For testing purposes only.
// let lastId = 0

export const setTheme = lightTheme => {
  if (lightTheme === true) document.body.classList.add('light')
}

// A handler function for tracking mouse clicks. If a click occurs inside a data-dropdown element, a dropdown menu
// controlled by the element is shown.
export const clickHandler = (e) => {
  if (!e.target) return

  const target = e.target
  const isDropdownBtn = target.matches('[data-dropdown]')
  const isLink = target.matches('.link')
  const currentDropdown = target.closest('[data-dropdown]')

  // If a dropdown activator (user icon, language selection) is clicked, the dropdown menu controlled by the activator 
  // is shown or hidden depending of its current state. Also clicking a link inside dropdown menu closes the menu.
  if (isDropdownBtn || isLink && currentDropdown) {
    currentDropdown.classList.toggle('active')
  }

  // Iterating through all active dropdowns, and closing all except the one the one that triggered this event.
  document.querySelectorAll('[data-dropdown].active')
    .forEach(d => {
      if (d !== currentDropdown) d.classList.remove('active')
    })
}

// Used in generateData() and NewRecordForm.js/DatePicker to convert Date object to string
export const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',/*year: '2-digit',*/
    month: '2-digit',
    day: '2-digit'  
  })
}

// Formatted time is used in NewRecordForm. Setting leading zeroes if time unit < 10.
export const formatTime = (date) => 
  ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)

// Returns the amount of days in given month. 0 as the day gives the last day of previous month, so 
// passing 1 as month returns the last day of January.
export const daysInMonth = (year, month) => {
  return (new Date(year, month, 0).getDate())
}

// Sorting data entries in month arrays by day number
export const sortByDayNumber = (entry1, entry2) => {
  const day1 = entry1[0].substring(3, 5)
  const day2 = entry2[0].substring(3, 5)
  return day2 - day1
}

// Sorting entries with the same date day by timestamp.
export const sortByTime = (entry1, entry2) => 
  (Number(entry2.time.substring(0, 5).split(':').join('')) -
   Number(entry1.time.substring(0, 5).split(':').join('')))

// Returns the name of the month by month number which is sliced from monthObjectKey (e.g. 202401).
export const getMonthName = (monthObjectKey, lan) => {
  const MONTHS = languages[lan].monthNames
  const year = monthObjectKey.substring(0, 4)
  const monthNum = monthObjectKey.slice(-2)

  return `${MONTHS[Number(monthNum) - 1]} ${year}`
}

// Clicking Font Awesome icon can return the svg-element or path node.
// Preventing event bubbling and finding the svg-element containing the icon name.
export const getIconName = (event) => {  
  event.stopPropagation()
  
  return event.target.tagName === 'path'
    ? event.target.nearestViewportElement.dataset.icon
    : event.target.tagName === 'DIV'
      ? event.target.firstChild.dataset.icon
      : event.target.dataset.icon
}

// Generate id for entries created after initial bunch
// For testing purposes only.
/*
export const getId = () => {
  return ++lastId
}
*/

// Entries contain date field, which is used to form a key to the month object containing the 
// requested entry. The key is used in dataReducer.js. Format: YYYYmm.
export const formMonthObjectKey = (dateStr) => 
  dateStr.slice(-4).concat(dateStr.substring(0, 2))

// Average of each value calculated from readings per day. The value (systolic, diastolic, pulse)
// is used as a key to read the corresponding value from each day in the entryArray.
export const calculateAverage = (entryArray, value = null) => {
  const values = ['systolic', 'diastolic', 'pulse']
  let averages = {}
    
  const calculate = (value) => {
    let numberOfValues = 0
    const result = Math.round(entryArray.reduce((total, current) => {
      if (!isNaN(current[value])) {
        numberOfValues++
        return total + current[value]
      }
      return total
    }, 0) / numberOfValues)
    numberOfValues = 0
    return isNaN(result) ? '-' : result
  }

  // If parameter 'value' isn't provided, using the values array to calculate the average of
  // each key.
  if (!value) {
    values.forEach(value => averages[value] = calculate(value))
    return averages
  }
  
  return calculate(value)
}

// Calculating standard deviations of systolic and diastolic pressures for each month.
export const standardDeviation = (data, avg) => {
  const sumOfDevsSquared = data.reduce((total, current) => {    
    return {
      systolic: total.systolic + Math.pow(current.systolic - avg.systolic, 2),
      diastolic: total.diastolic + Math.pow(current.diastolic - avg.diastolic, 2)
    }
  }, { systolic: 0, diastolic: 0 })
  
  return {
    systolic: Math.sqrt(sumOfDevsSquared.systolic / data.length).toFixed(2),
    diastolic: Math.sqrt(sumOfDevsSquared.diastolic / data.length).toFixed(2)
  }
}

export const isEmptyObject = obj => !!obj && Object.keys(obj).length < 1

// Checking if the entry to be deleted is the only one in the month.
export const onlyEntryOfMonth = (month, day) => 
  (month.length === 1 && day.length === 1)

// Setting the most recent month in fetched data as active month in entry list.
export const monthToSet = (monthsInData) => {
  const monthNow = formMonthObjectKey(formatDate(new Date()))
  return monthsInData.includes(monthNow)
    ? monthNow
    : Math.max(...monthsInData.map(m => Number(m))).toString()
}

// Classifying blood pressure values in kategories: < 100, < 110 etc. for statistics shown in the main view.
export const classifyData = (data) => {
  // Each key of sys and dia represents the limit under which the results are categorized:
  // for example 108 goes under 110. Values greater than the upper limit are saved in key 'rest'.
  const classifiedData = {
    totalAmount: Object.keys(data).length,
    sys: {
      100: 0,
      110: 0,
      120: 0,
      130: 0,
      140: 0,
      150: 0,
      rest: 0
    },
    dia: {
      50: 0,
      60: 0,
      70: 0,
      80: 0,
      90: 0,
      100: 0,
      rest: 0
    }
  }

  // Iterating through the received array of days. The sys and dia values of each day is 
  // rounded to the previous value divisible by ten. This represents the key of which value is increased.
  // 10 is added to sys- & diaRounded values to include them into the correct class:
  // Math.floor(113 / 10) * 10 = 110, and it should be added to category consisting of values less than 120.
  data.forEach(day => {
    const sysRounded = Math.floor(day.systolic / 10) * 10
    const diaRounded = Math.floor(day.diastolic / 10) * 10
    
    sysRounded >= 150 
      ? classifiedData.sys.rest++ 
      : sysRounded < 100
        ? classifiedData.sys[100]++ 
        : classifiedData.sys[sysRounded + 10]++
    
    diaRounded >= 100 
      ? classifiedData.dia.rest++ 
      : diaRounded < 50
        ? classifiedData.dia[50]++ 
        : classifiedData.dia[diaRounded + 10]++    
  })
  
  return classifiedData
}

// Arranging fetched data into an object.
export const buildDataObject = (rawData) => {
  const entries = {}
  
  for (let entry of rawData) {
    if (!entries[entry.monthObjectKey]) entries[entry.monthObjectKey] = {}
    if (!entries[entry.monthObjectKey][entry.date]) entries[entry.monthObjectKey][entry.date] = { readings: [] }  
    entries[entry.monthObjectKey][entry.date].readings.push(entry)
  }

  return { entries }
}
