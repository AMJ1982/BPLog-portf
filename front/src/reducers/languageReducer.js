import { createSlice } from '@reduxjs/toolkit'

// The reducer controlling language settings.
const languageSlice = createSlice({
  name: 'lan',
  initialState: () => {
    const lan = window.localStorage.getItem('bplogLan')
    return lan !== null ? lan : 'en'
  },
  reducers: {
    setLanguage(state, action) {
      return action.payload
    }
  }
})

// Action creator. Setting the selected language to Redux state and local storage.
export const setLan = (lan) => {
  return async dispatch => {
    try {
      dispatch(setLanguage(lan !== null ? lan : 'en'))
      window.localStorage.setItem('bplogLan', lan)
    } catch (exception) {
      console.log('error')
    }
  }  
}

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer