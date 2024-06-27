import React from 'react'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { updateEntry, createEntry } from '../../reducers/dataReducer'
import { setMonth } from '../../reducers/viewReducer'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import { formatDate, formatTime, formMonthObjectKey } from '../../util/helpers'
import { useDialog } from '../../hooks/useDialog'
import Button from '../Button'
import 'react-datepicker/dist/react-datepicker.css'

// A form component for creating and modifying readings.
const NewRecordForm = ({ closeModal, initialValues }) => {
  const { showDialog } = useDialog()
  const userMeds = useSelector(state => state.login.medList)
  const dispatch = useDispatch()
  const texts = useLanguage()
  const date = new Date()
  
  // If initialValues === null (meaning this isn't a case of modifying existing entry), create new object.
  initialValues = !initialValues 
    ? {
      date: formatDate(date),
      time: formatTime(date),
      systolic: '',
      diastolic: '',
      pulse: '',
      meds: [],
    }
    : { ...initialValues, time: initialValues.time.substring(0, 5) }
  
  const onSubmit = values => {
    // If the object has field 'id', an existing entry is being modified. Otherwise a new entry is created.
    if ('id' in values) {
      if (values.pulse === 0 || values.pulse === '') values.pulse = '-'
      dispatch(updateEntry(values))
      showDialog(texts.forms.update.updated, 'message')
    } else {
      values.monthObjectKey = formMonthObjectKey(values.date)      
      dispatch(createEntry(values))
      dispatch(setMonth(values.monthObjectKey))
    }
    closeModal()
  }

  const medOptions = userMeds
    ? userMeds.map(med => { return { value: med, label: med } })
    : []
  
  const validate = values => {
    const errors = {}
    
    // Checking fields for empty values
    for (let value in values) {
      if (value !== 'notes' && value !== 'meds' && value !== 'pulse') {
        if (!values[value]) errors[value] = texts.forms.err.empty
      }
    }
    // Checking pressure value ranges
    if (Number(values['systolic']) < 90 || Number(values['systolic']) > 250) {
      errors['systolic'] = `${texts.forms.err.outOfBounds}(90-250)`
    }

    if (Number(values['diastolic']) < 40 || Number(values['diastolic']) > 120) {
      errors['diastolic'] = `${texts.forms.err.outOfBounds}(40-120)`
    }
    return errors
  }

  // Using initialValues.time to determine how to render the form. If the prop it exists, DatePicker is disabled and a field 
  // for changing the time is shown instead.
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
      {({ values, setFieldValue }) => (
        <Form className='form'>
          <div>
            <label htmlFor='date'>{texts.forms.newRecord.date}</label>
            <DatePicker
              className='formField'
              id='date'
              name='date'
              dateFormat='dd/MM/yy'
              selected={new Date(values.date)}
              onChange={date => setFieldValue('date', formatDate(date))}
              disabled={initialValues.id}
            />
          </div>          
          <div>
            <label htmlFor='date'>{texts.forms.newRecord.time}</label>
            <Field className='formField' type='time' id='time' name='time'/>
          </div>          
          <div>
            <label htmlFor='systolic'>{texts.forms.newRecord.sys}</label>
            <Field className='formField' type='number' min='90' max='250' id='systolic' name='systolic' autoFocus/>
            <ErrorMessage name='systolic' component='div' className='formik_error'/>
          </div>
          <div>
            <label htmlFor='diastolic'>{texts.forms.newRecord.dia}</label>
            <Field className='formField' type='number' min='40' max='120' id='diastolic' name='diastolic' />
            <ErrorMessage name='diastolic' component='div' className='formik_error'/>
          </div>
          <div>
            <label htmlFor='pulse'>{texts.forms.newRecord.pul}</label>
            <Field className='formField' type='number' id='pulse' name='pulse' />
            <ErrorMessage name='pulse' component='div' className='formik_error'/>
          </div>
          <label htmlFor='meds'>{texts.forms.newRecord.meds}</label>     
          <Field 
            className='formField'
            placeholder={texts.forms.select.placeHolder}
            component={Select}
            id='meds'
            isMulti
            isSearchable={false}
            options={medOptions}
            name='meds'
            defaultValue={initialValues.meds.map(m => {
              /* Setting meds in initialValues as defaultValues, and forming labels from values by converting 
                the first letter into upper case. */
              return { value: m, label: m[0].toUpperCase().concat(m.substring(1)) }
            })}
            onChange={(data) => {
              /* onChange gets an array of objects (for every selection): { value: 'text', label: 'Text }.
                Iterating through the objects and mapping their values to Formik's values object, which is defined 
                as an array (initialValues.meds). */
              values.meds = data.map(obj => obj.value)
            }}
          />
          <div>
            <label htmlFor='notes'>{texts.forms.newRecord.notes}</label>
            <Field 
              className='formField'
              as='textarea'
              id='notes'
              name='notes'
            />
          </div>
          <Button className='button' text={texts.forms.newRecord.submit} type='submit' />
        </Form>
      )}
    </Formik>
  )
}

export default NewRecordForm