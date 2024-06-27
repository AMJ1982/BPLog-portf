import { createSlice } from '@reduxjs/toolkit'
import { formatDate, formMonthObjectKey } from '../util/helpers'

// The reducer for time selection management. The currently selected month is saved to Redux state and
// used for showing the blood pressure readings in that month. Also the currently shown slide in Swiper
// component is determined by the selected month.

const viewSlice = createSlice({
  name: 'view',
  initialState: {
    timePeriod: 31,
  },
  reducers: {
    selectTimePeriod(state, action) {
      switch (action.payload) {
      case 'month':
        state.timePeriod = 31
        break
      case 'week':
        state.timePeriod = 7
        break
      case 'day':
        state.timePeriod = 1
        break
      default:
        state.timePeriod
      }
    },
    /* Setting monthObjectKey directly. It assumes the payload is a correctly formatted string, so no helper 
       functions are needed. */
    setMonth(state, action) {
      state.month = action.payload
    },
    initialize(state, action) {
      state.month = formMonthObjectKey(formatDate(new Date()))
    }
  }
})

export const { selectTimePeriod, prevMonth, nextMonth, setMonth, initialize } = viewSlice.actions
export default viewSlice.reducer