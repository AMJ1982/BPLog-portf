// Used in generateData() and NewRecordForm.js/DatePicker to convert Date object to string format.
const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'  
  })
}
    
// Returns the amount of days in given month. 0 as the day gives the last day of previous month, so 
// passing 1 as month returns the last day of January.
const daysInMonth = (year, month) => (new Date(year, month, 0).getDate())
  
// Entries contain date field, which is used to form a key to the month object containing the 
// requested entry. The key is used in dataReducer.js.
const formMonthObjectKey = (dateStr) => dateStr.slice(-4).concat(dateStr.substring(0, 2))
  
// Generates dummy data for charts and lists. Needed only for testing.
const generateData = () => {
  const user = {
    username: 'testman',
    password: 'Secret',
    firstName: 'Test',
    lastName: 'Man',
    age: Math.floor(Math.random() * 90),
    entries: (() => {
      let object = {}
      // Creating 24 dummy months for example data
      for (let i = 0, id = 0; i < 24; i++) {
        const now = new Date(2022, (7 + i), 1)
        let key = formMonthObjectKey(formatDate(now))
        object[key] = []
        // Creating days for months
        for (let j = 1; j <= (daysInMonth(now.getFullYear(), now.getMonth() + 1)); j++) {
          object[key].push({
            id: ++id,
            date: formatDate(new Date(now.getFullYear(), now.getMonth(), j)),
            systolic: Math.floor(Math.random() * (150 - 110) + 110),
            diastolic: Math.floor(Math.random() * (90 - 70) + 70),
            pulse: Math.floor(Math.random() * (100 - 50) + 50),
            notes: Math.random() > 0.5 ? 'Notes concerning the blood pressure reading.' : '',
            meds: ['burana', 'xanor', 'diapam']
          })
        lastId = id
        }
      }
        
        return object
    })()
  }
  return user
}

module.exports = { generateData, formatDate }