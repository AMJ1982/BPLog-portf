import { createSlice } from '@reduxjs/toolkit'
import { formMonthObjectKey, onlyEntryOfMonth, monthToSet } from '../util/helpers'
import { logout } from './loginReducer'
import { setMonth } from './viewReducer'
import entryService from '../services/entryService'

// The reducer for data related operations.

// Action creators

// Fetching users data from the server.
export const initializeData = (setLoading) => {
  return async dispatch => {
    try {
      const data = await entryService.getAll()
      if (data) {
        // Getting month object keys from fetched data. If current month contains entries, it's set as the initial
        // month. If not, the latest month containing entries is chosen instead. The setMonth action resides in
        // viewReducer.      
        const monthsInData = Object.keys(data.entries)
        dispatch(setMonth(monthToSet(monthsInData)))
        // Setting the data into Redux state.
        dispatch(initData(data))        
        return
      }
    } catch (exception) {
      console.log('Data fetching error: ', exception)
    } finally {
      setLoading(false)
    }
  }
}

// Actions for updating, deleting and creating entries.
export const updateEntry = (entry) => {
  return async dispatch => {
    const updatedEntry = await entryService.update(entry)
    dispatch(modifyEntry(updatedEntry))
  }
}

export const deleteEntry = (dayObject, data) => {
  return async dispatch => {
    try {
      await entryService.remove(dayObject.id)
      dispatch(removeEntry(dayObject))
    } catch (exception) {
      console.log('Error removing data', exception)
    }
  }
}

export const createEntry = (entry) => {
  return async dispatch => {
    entry.pulse = entry.pulse || '-'
    try {
      const savedEntry = await entryService.create(entry)
      dispatch(newEntry(savedEntry))
    } catch (exception) {

      if (exception.response.data.error === 'token expired') {
        alert('Token expired.')
      }

      if (exception.response.data.error === 'Authorization failed') {
        alert('User does not exist.')
      }
      dispatch(logout())
    }
  }
}

// Slice for data management.
const dataSlice = createSlice({
  name: 'data',
  initialState: {},
  reducers: {
    initData(_state, action) {
      return action.payload
    },
    newEntry(state, action) {
      const { date, monthObjectKey } = action.payload
      // Create a month object to store the entry in if doesn't exist. Otherwise push entry to corresponding object.
      if (!state.entries[monthObjectKey]) {        
        state.entries[monthObjectKey] = {}
        state.entries[monthObjectKey][date] = { 
          readings: [action.payload]
        }
        return state
      }
      
      if (!state.entries[monthObjectKey][date]) {
        state.entries[monthObjectKey][date] = { readings: [] }
      }

      state.entries[monthObjectKey][date] = {
        readings: [
          ...state.entries[monthObjectKey][date].readings,
          action.payload
        ]
      }      
    },
    // The return values of next two reducers could be simplified since newer versions of Redux are using Immer.
    modifyEntry(state, action) {
      const { id, date } = action.payload
      const monthObjectKey = formMonthObjectKey(date)
      
      return {
        ...state,
        entries: {
          ...state.entries,
          [monthObjectKey]: {
            ...state.entries[monthObjectKey],
            [date]: {
              ...state.entries[monthObjectKey][date],
              readings: state.entries[monthObjectKey][date].readings.map((r) => {
                return r.id === id ? action.payload : r
              })
            }
          }
        }
      }
    },    
    removeEntry(state, action) {
      // Removing entry by id. Also receiving the date of the entry to form key to the object containing the entry.
      const { date, id, monthObjectKey } = action.payload
      const month = Object.keys(state.entries[monthObjectKey])
      const day = state.entries[monthObjectKey][date].readings
            
      // If the entry to be removed is the last one in the month, corresponding monthObjectKey is deleted from the object.
      if (onlyEntryOfMonth(month, day)) {
        delete state.entries[monthObjectKey]
        return state
      }

      // Removing date array from month object if there's only 1 entry left.
      if (state.entries[monthObjectKey][date].readings.length === 1) {
        delete state.entries[monthObjectKey][date]
        return state
      }
      
      return {
        ...state,
        entries: {
          ...state.entries,
          [monthObjectKey]: {
            ...state.entries[monthObjectKey],
            [date]: {
              ...state.entries[monthObjectKey][date],
              readings: state.entries[monthObjectKey][date].readings.filter(e => e.id !== id)
            }
          }
        }
      }
    }
  },
  extraReducers: {}
})

export const { initData, newEntry, modifyEntry, removeEntry } = dataSlice.actions
export default dataSlice.reducer