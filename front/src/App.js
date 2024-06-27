import React, { useEffect, useState, lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Main from './components/Main'
import Loader from './components/Loader'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { initUser } from './reducers/loginReducer'
import { initializeData } from './reducers/dataReducer'
import { clickHandler } from './util/helpers'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useModal } from './hooks/useModal'
const UserPage = lazy(() => import('./components/UserPage'))
const View = lazy(() => import('./components/View'))
const Message = lazy(() => import('./components/Message'))
const Confirm = lazy(() => import('./components/Confirm'))

// If a dropdown activator is clicked, the dropdown menu under that activator is shown. 
document.addEventListener('click', clickHandler)

// Context for showing modals. Shared to be used in all components of the application.
export const ModalContext = React.createContext()

const App = () => {
  const [loading, setLoading] = useState(true)
  const [user, data] = useSelector(state => [state.login, state.data], shallowEqual)
  const { formWithModal, openModal, closeModal } = useModal()
  const dispatch = useDispatch()
  
  // Calling action initUser in loginReducer. Checking if there's a logged in user in the local storage.
  useEffect(() => {
    dispatch(initUser(setLoading))
  }, [])
  
  // If a logged in user was found, fetching their data using initializeData in dataReducer.
  useEffect(() => {
    if (user) dispatch(initializeData(setLoading))
  }, [user])
  
  // Showing loading animation while user and related data are loaded.
  if (loading) return <Loader />

  return (
    <div>
      <Suspense fallback={<Loader />}>
        <ModalContext.Provider value={[openModal, closeModal]}>
          <Router>
            {formWithModal()}
            <Nav user={user}/>
            <Routes>
              <Route path='/' element={<Main user={user} data={data} />} exact/>            
              <Route path='/view' element={<View />} />
              <Route path='/user' element={<UserPage user={user} />} />
            </Routes>
          </Router>          
          <Message />
          <Confirm />
        </ModalContext.Provider>
      </Suspense>      
    </div>
  )
}

export default App
