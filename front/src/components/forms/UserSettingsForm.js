import React, { useState, useEffect } from 'react'
import Button from '../Button'
import Select from 'react-select'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateLoggedUser } from '../../reducers/loginReducer'
import { useDialog } from '../../hooks/useDialog'
import userService from '../../services/userService'
import Loader from '../Loader'

// A form component for changing user settings.
const UserSettings = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({})
  const { showDialog } = useDialog()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const texts = useLanguage()
  
  useEffect(() => {
    userService.getOne(user.id)
      .then(user => {
        user.height = user.height ? user.height : ''
        user.weight = user.weight ? user.weight : ''
        user.medInput = ''
        setInitialValues(user)
        setLoading(false)
      })
      .catch(err => {
        showDialog(err.response.data.error, 'message', 'error')
        navigate(-1)
      })
  }, [])
  
  // Content for birth year options field.
  const optionsBirthYear = () => {
    const options = []
    options.push(<option label={texts.forms.settings.birthSelect} key='default' ></option>)
    const yearNow = new Date().getFullYear()

    for (let i = yearNow; i >= 1900; i--) {
      options.push(<option value={i} key={i}>{i}</option>)
    }
    return options
  }
  
  // A method for adding medicines to list.
  const addMedicine = (props) => {
    const medName = props.values.medInput
      .substring(0, 1)
      .toUpperCase()
      .concat(props.values.medInput.substring(1))

    if (props.values.medInput !== '') {
      props.setFieldValue('medList', [...props.values.medList, medName])
      props.setFieldValue('medInput', '')      
    }     
  }

  // Submitting the updated user info to the server via userService.
  const onSubmit = async values => {
    try {
      const updatedUser = await userService.update(values)
      dispatch(updateLoggedUser(updatedUser))
      showDialog(texts.forms.settings.notification, 'message')
      navigate(-1)
    } catch (exception) {
      console.log('expection in UserPage', exception)
    }
  }
  
  if (loading) return <Loader />

  return (
    <div className='data-container'>
      <Formik 
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {(props) => {
          return (
            <Form className='form'>
              <div>
                <label htmlFor='firstName'>{texts.forms.settings.first}</label>
                <Field className='formField' type='text' id='firstName' name='firstName'/>
                <ErrorMessage name='firstName' component='div' className='formik_error'/>
              </div>
              <div>
                <label htmlFor='lastName'>{texts.forms.settings.last}</label>
                <Field className='formField' type='text' id='lastName' name='lastName' />
                <ErrorMessage name='lastName' component='div' className='formik_error'/>
              </div>
              <div>
                <label htmlFor='birthYear'>{texts.forms.settings.birth}</label>
                <Field className='formField' as='select' id='birthYear' name='birthYear'>
                  {optionsBirthYear()}
                </Field>
                <ErrorMessage name='birthYear' component='div' className='formik_error'/>
              </div>
              <div>
                <label htmlFor='height'>{texts.forms.settings.height}</label>
                <Field className='formField' type='number' id='height' name='height' />
              </div>
              <div>
                <label htmlFor='weight'>{texts.forms.settings.weight}</label>
                <Field className='formField' type='number' id='weight' name='weight' />
              </div>
              <div>
                <label htmlFor='medList'>{texts.forms.settings.medList}</label>
                <Field
                  placeholder={texts.forms.settings.medListPlaceholder}
                  onKeyPress={e => {
                    if (e.which === 13) {
                      e.preventDefault()
                      addMedicine(props)
                    }
                  }}
                  name='medInput'
                />
                <Button
                  style={{ marginLeft: '1em' }}
                  className='util-btn'
                  type='button'
                  text={texts.forms.settings.add}
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
                    if (window.confirm(texts.forms.settings.remConf)) {
                      props.setFieldValue('medList', data.map(obj => obj.value))
                    }
                  }}
                  onClick={({ target }) => {
                    props.setFieldValue('medSelect', target.value)}
                  }
                />          
              </div>
              <div className='link-group'>
                <Button text={texts.forms.settings.submit} type='submit' className='button'/>
                <Button text={texts.forms.settings.cancel} type='button' onClick={() => navigate(-1)} className='button'/>  
              </div>
            </Form>
          )}}     
      </Formik>      
    </div>
  )
}

export default UserSettings