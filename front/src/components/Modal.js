import React, { useState, useImperativeHandle, lazy } from 'react'
const NewRecordForm = lazy(() => import('../components/forms/NewRecordForm'))
const CreateAccountForm = lazy(() => import('../components/forms/CreateAccountForm'))
const LoginForm = lazy(() => import('../components/forms/LoginForm'))

// The modal component. This is utilized with customized useModal hook.
const Modal = React.forwardRef(( props, ref ) => {
  const [visible, setVisible] = useState(false)
  const [formType, setFormType] = useState(null)
  const [initialValues, setInitialValues] = useState(null)

  // Returning the relevant form determined by formType. The type is set in the useModal hook using
  // the toggleVisibility method which is defined here and forwarded to the useModal hook.
  const formToRender = (initialValues) => {
    switch (formType) {
    case 'createRecord':
      return <NewRecordForm closeModal={closeModal} />
    case 'modifyRecord':
      return <NewRecordForm closeModal={closeModal} initialValues={initialValues} />
    case 'createAccount':
      return <CreateAccountForm closeModal={closeModal} />
    case 'login':
      return <LoginForm closeModal={closeModal} />
    default:
      return null
    }
  }

  // The methods shared to useModal hook to control the visibility of the modal.
  const toggleVisibility = (formType, values) => {
    if (values) setInitialValues(values)
    setFormType(formType)
    setVisible(prev => !prev)
  }
  
  const closeModal = () => {
    toggleVisibility()
    setFormType('')
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility, closeModal }
  })
  
  // If formType isn't specified, a confirmation dialog is opened and closing button isn't shown.
  return (
    <div className='modal' style={{ display: visible ? '' : 'none'}}>
      <div className='modal-content'>
        {formType && <div className='close-modal' onClick={() => closeModal()}>&times;</div>}
        {formToRender(initialValues)}
      </div>      
    </div>
  )
})

Modal.displayName = 'Modal'
export default Modal