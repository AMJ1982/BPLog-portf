import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLanguage } from '../../hooks/useLanguage'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { login } from '../../reducers/loginReducer'
import loginService from '../../services/loginService'
import Button from '../Button'

// A form component for logging in.
const LoginForm = ({ closeModal }) => {
  // State for showing error message if the credentials are wrong.
  const [errorMessage, setErrorMessage] = useState(null)
  const dispatch = useDispatch()
  const texts = useLanguage()
  
  const initialValues = {
    username: '',
    password: ''
  }

  // Submitting the user inputs to the server via loginService.
  const onSubmit = async credentials => {
    try {
      const user = await loginService.login(credentials)
      dispatch(login(user))
      setErrorMessage(null)
      closeModal()
    } catch (exception) {
      console.log('virhe', exception)
      setErrorMessage(texts.forms.login.err)
    }
  }

  const validate = values => {
    const errors = {}
    
    for (let value in values) {
      if (!values[value]) errors[value] = texts.forms.err.empty
    }

    return errors
  }
  
  // To apply styles, component prop for ErrorMessage is needed.
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
      <Form className='form'>
        <div>
          <label htmlFor='username'>{texts.forms.login.user}</label>
          <Field className='formField' type='text' id='username' name='username' autoFocus/>
          <ErrorMessage name='username' component='div' className='formik_error'/>
        </div>
        <div>
          <label htmlFor='password'>{texts.forms.login.pwd}</label>
          <Field className='formField' type='password' id='password' name='password' />
          <ErrorMessage name='password' component='div' className='formik_error'/>
        </div>
        {errorMessage && <div name='credentials' component='div' className='formik_error'>{errorMessage}</div>}
        <Button className='button' text={texts.forms.login.log} type='submit' />
      </Form>
    </Formik>
  )
}

export default LoginForm