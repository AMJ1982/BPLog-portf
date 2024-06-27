import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ModalContext } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteEntry } from '../reducers/dataReducer'
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons'
import { useDialog } from '../hooks/useDialog'

// This content is shown in expanded ListItems. Readings within the same day are listed
// separately, and tools for deleting and modifying readings are provided.
const Entry = ({ content, texts }) => {
  const [openModal, closeModal] = useContext(ModalContext)
  const { showDialog } = useDialog()
  const data = useSelector(state => state.data)
  const dispatch = useDispatch()

  // A confirmation dialog is opened as a modal
  const handleDelete = async (event) => {
    event.stopPropagation()
    // Confirmation of deletion invokes handleFormTypeChange in App component, which sets formType as 'confirm'. 
    // Since 'confirm' doesn't match to any form type in switch statement in useModal, null is returned, and an 
    // empty modal opens. At the same time Confirm is set visible in useDialog.
    openModal(event)

    if (await showDialog(texts.view.listItem.entry.confirm, 'confirm')) {
      dispatch(deleteEntry(content, data))
    }
    closeModal()
  }

  return (
    <div className='item-field-bp-cont entry'>
      <div className='item-field-bp-cont-inner'>
        <div className='item-field-bp-cont'>
          <div className='item-field-bp'>
            <div className='guide-text'>{content.time.substring(0, 5)}</div>
          </div>
          <div className='item-field-bp'>
            <div className='item-bp sys'>{content.systolic}&nbsp;/&nbsp;</div>
            <div className='item-bp dia'>{content.diastolic}&nbsp;/&nbsp;</div>          
            <div className='item-bp pul'>{content.pulse}</div>
          </div>
          <div className='tool-bar item-field-bp'>
            <div className='icon-div' data-form-type='modifyRecord' onClick={(event) => openModal(event, content)}>
              <FontAwesomeIcon className='icon' icon={faPencil} />
            </div>
            <div className='icon-div' onClick={(event) => handleDelete(event)}>
              <FontAwesomeIcon className='icon' icon={faTrashCan} />
            </div>
          </div>
        </div>
        {content.meds.length > 0 && 
          <div className='guide-text item-field-bp'>
            {texts.view.listItem.entry.meds} {content.meds.map(m => m.substring(0, 1).toUpperCase().concat(m.substring(1))).join(', ')}
          </div>}
        {content.notes && <div className='guide-text item-field-bp'>{texts.view.listItem.entry.notes} {content.notes}</div>}
      </div>
      
    </div>
  )
}

export default Entry