import { createSlice } from '@reduxjs/toolkit'
import { setTheme } from '../util/helpers'
import entryService from '../services/entryService'
import userService from '../services/userService'

// The reducer for user related operations.

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    setLoggedUser(state, action) {
      return action.payload
    },
    clearLoggedUser(state, action) {
      return null
    },
  },
  extraReducers: {}
})

// Action creators
export const login = (user) => {
  return async dispatch => {
    try {
      dispatch(setLoggedUser(user))
      window.localStorage.setItem('bplogUser', JSON.stringify(user))
      entryService.setToken(user.token)
      userService.setToken(user.token)      
      setTheme(user.lightTheme)
    } catch (exception) {
      console.log('login error')
    }
  }  
}

// If a user is found in local storage, users token is read from the object and set to Axios service files.
// Also setting the visual theme according to the boolean value included in the user object.
// Finally a dispatch is launched to save the user object to Redux state.
export const initUser = (setLoading) => {
  return async dispatch => {
    try {
      const userJSON = localStorage.getItem('bplogUser')
      if (userJSON) {
        const user = JSON.parse(userJSON)
        entryService.setToken(user.token)
        userService.setToken(user.token)
        setTheme(user.lightTheme)
        dispatch(setLoggedUser(user))
        return
      }
      setLoading(false)
    } catch (exception) {
      console.log('login error', exception)
    }
  }
}

// If user data is modified from user settings, the new information is updated into
// local storage and Redux state.
export const updateLoggedUser = (updatedUser) => {
  return async dispatch => {
    try {
      updatedUser.token = JSON.parse(localStorage.getItem('bplogUser')).token
      window.localStorage.setItem('bplogUser', JSON.stringify(updatedUser))
      setTheme(updatedUser.lightTheme)
      dispatch(setLoggedUser(updatedUser))
    } catch (exception) {
      console.log('Error while updating user: ', exception)
    }
  }
}

export const logout = () => {
  return async dispatch => {
    window.localStorage.removeItem('bplogUser')
    document.body.classList.remove('light')
    entryService.setToken(null)
    userService.setToken(null)
    dispatch(clearLoggedUser())
  }
}

export const { setLoggedUser, clearLoggedUser } = loginSlice.actions
export default loginSlice.reducer