import React, { useState, lazy } from 'react'
const Modal = lazy(() => import('../components/Modal'))

// Tools for showing a modal with a form. Possible initial values for forms are 
// set in openModal function.
export const useModal = (formType) => {
  const modalRef = React.createRef()
  const [initialValues, setInitialValues] = useState(null)
  
  const openModal = (event, values = null) => {
    if (values) setInitialValues(values)
    event.stopPropagation()
    modalRef.current.toggleVisibility(event.target.getAttribute('data-form-type'), values)
  }

  // This is only used on confirm dialogs.
  const closeModal = () => {
    modalRef.current.closeModal()
  }

  // The method to return the Modal component. This is set to the root of component hierarchy in App.js.
  const formWithModal = () => <Modal ref={modalRef} />
  
  return { openModal, closeModal, formWithModal }
}