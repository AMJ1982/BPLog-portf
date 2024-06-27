import { configureStore } from '@reduxjs/toolkit'
import viewReducer from './reducers/viewReducer'
import dataReducer from './reducers/dataReducer'
import loginReducer from './reducers/loginReducer'
import languageReducer from './reducers/languageReducer'

// All reducers are wrapped into single object using configureStore.
export default configureStore({
  reducer: {
    view: viewReducer,
    data: dataReducer,
    login: loginReducer,
    lan: languageReducer
  }
})