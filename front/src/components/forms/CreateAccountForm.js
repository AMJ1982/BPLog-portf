import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch } from 'react-redux'
import { login } from '../../reducers/loginReducer'
import Select from 'react-select'
import Button from '../Button'
import userService from '../../services/userService'
import loginService from '../../services/loginService'

// A form component for creating an user account consisting of 2 pages.
const CreateAccountForm = ({ closeModal }) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [showNextPage, setShowNextPage] = useState(false)
  const dispatch = useDispatch()
  const texts = useLanguage()

  // Initializing empty fields to the form.
  const initialValues = {
    firstName: '',
    lastName: '',
    birthYear: '',
    username: '',
    password: '',
    passwordConf: '',
    medInput: '',
    height: '',
    weight: '',
    medList: []
  }

  // Submitting the validated form to the server. User is also logged in when the account is created.
  const onSubmit = async values => {
    try {      
      await userService.create(values)
      const user = await loginService.login({ username: values.username, password: values.password })
      dispatch(login(user))
      setErrorMessage(null)
      closeModal()
    } catch (exception) {
      setErrorMessage(
        `${texts.forms.createAccount.err.nameTaken[0]}${values.username}${texts.forms.createAccount.err.nameTaken[1]}`)
    }
  }

  // Error validation for Formik. All fields of the form are run through, and if empty, added to 'errors' object
  const validate = values => {
    const errors = {}
    const notValidated = ['medList', 'medInput', 'medSelect', 'height', 'weight']
    
    for (let value in values) {
      // Looping through the fields. If the current field isn't included on the notValidated array,
      // and the field has no input, an error message is saved to errors object with the name of the
      // empty field as the key.
      if (!notValidated.includes(value) && !values[value]) errors[value] = texts.forms.err.empty
    }

    if (values.password !== '' && values.password.length < 6) {
      errors.password = texts.forms.createAccount.err.pwdShort
    }

    if (values.password !== values.passwordConf) {
      errors.passwordConf = texts.forms.createAccount.err.pwdConf
    }
    
    return errors
  }

  // Content for birth selection options field.
  const optionsBirthYear = () => {
    const options = []
    options.push(<option label={texts.forms.createAccount.birthSelect} key='default' ></option>)
    const yearNow = new Date().getFullYear()

    for (let i = yearNow; i >= 1900; i--) {
      options.push(<option value={i} key={i}>{i}</option>)
    }
    return options
  }

  const addMedicine = (props) => {
    if (props.values.medInput !== '') {
      const medName = props.values.medInput
        .substring(0, 1)
        .toUpperCase()
        .concat(props.values.medInput.substring(1))
      props.setFieldValue('medList', [...props.values.medList, medName])
      props.setFieldValue('medInput', '')
    }     
  }

  // Styles for both parts of the form. When page changes, another set of fields is shown.
  const first = { display: showNextPage ? 'none' : '' }
  const second = { display: showNextPage ? '' : 'none' }

  // To apply styles, component prop for ErrorMessage is needed
  return (
    <Formik 
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {(props) =>
        <Form className='form'>
          <div style={first}>
            <div>
              <label htmlFor='firstName'>{texts.forms.createAccount.first}</label>
              <Field className='formField' type='text' id='firstName' name='firstName' autoFocus/>
              <ErrorMessage name='firstName' component='div' className='formik_error'/>
            </div>
            <div>
              <label htmlFor='lastName'>{texts.forms.createAccount.last}</label>
              <Field className='formField' type='text' id='lastName' name='lastName' />
              <ErrorMessage name='lastName' component='div' className='formik_error'/>
            </div>
            <div>
              <label htmlFor='birthYear'>{texts.forms.createAccount.birth}</label>
              <Field className='formField' as='select' id='birthYear' name='birthYear'>
                {optionsBirthYear()}
              </Field>
              <ErrorMessage name='birthYear' component='div' className='formik_error'/>
            </div>
            <div>
              <label htmlFor='username'>{texts.forms.createAccount.user}</label>
              <Field className='formField' type='text' id='username' name='username' />
              <ErrorMessage name='username' component='div' className='formik_error'/>
            </div>
            <div>
              <label htmlFor='password'>{texts.forms.createAccount.pwd}</label>
              <Field className='formField' type='password' id='password' name='password' />
              <ErrorMessage name='password' component='div' className='formik_error'/>
            </div>
            <div>
              <label htmlFor='passwordConf'>{texts.forms.createAccount.pwdConf}</label>
              <Field className='formField' type='password' id='passwordConf' name='passwordConf' />
              <ErrorMessage name='passwordConf' component='div' className='formik_error'/>
            </div>
            <div className='flex-cont' style={{ padding: 0,  justifyContent: 'flex-end' }} onClick={() => {
              // Validation is executed when advancing to next page. Fields containing errors are manually 
              // set touched; otherwise Formik won't register the errors.
              props.validateForm()
                .then(errors => {
                  const possibleErrors = Object.keys(errors) 
                  if (possibleErrors.length === 0) {
                    setShowNextPage(!showNextPage)
                  } else {
                    console.log('touched: ', props.touched)
                    props.setTouched({ /*...props.touched,*/ ...errors })
                  }                  
                })                              
            }}><div className='icon-div'><FontAwesomeIcon icon={faArrowRight}/></div>
            </div>
          </div>
          <div style={second}>            
            <div className='flex-cont' style={{ padding: 0, justifyContent: 'flex-start' }} onClick={() => setShowNextPage(!showNextPage)}>
              <div className='icon-div'><FontAwesomeIcon icon={faArrowLeft}/></div>
            </div>
            <div>
              <label htmlFor='height'>{texts.forms.createAccount.height}</label>
              <Field className='formField' type='number' id='height' name='height'/>
            </div>
            <div>
              <label htmlFor='weight'>{texts.forms.createAccount.weight}</label>
              <Field className='formField' type='number' id='weight' name='weight'/>
            </div>
            <div className='instruction'>
              <p><i>{texts.forms.createAccount.instr}</i></p>              
            </div>
            <div>
              <label htmlFor='medList'>{texts.forms.createAccount.medList}</label>
              <Field
                placeholder={texts.forms.createAccount.medListPlaceholder}
                onKeyPress={e => {
                  if (e.which === 13) {
                    e.preventDefault()
                    addMedicine(props)
                  }
                }}
                name='medInput'
              />
              <Button
                style={{ marginLeft: '1em',  }}
                className='util-btn'
                type='button'
                text={texts.forms.createAccount.add}
                disabled={props.values.medInput === '' ? true : false}
                onClick={() => addMedicine(props)}
              />
              <Field
                className='formField medSelect'
                placeholder={texts.forms.select.placeHolder}
                component={Select}
                name='medSelect'
                isMulti
                value={props.values.medList.map(med => { return { value: med, label: med } })}
                onChange={data => {
                  if (window.confirm(texts.forms.createAccount.remConf)) {
                    props.setFieldValue('medList', data.map(obj => obj.value))
                  }
                }}
                onClick={({ target }) => {
                  props.setFieldValue('medSelect', target.value)}
                }
              />          
            </div>              
            <Button className='button' text={texts.forms.createAccount.submit} type='submit' disabled={!showNextPage && true} />
            {errorMessage && <div name='credentials' component='div' className='formik_error'>{errorMessage}</div>}
          </div>
        </Form>
      }      
    </Formik>
  )
}

export default CreateAccountForm