import React from 'react'
import Button from './Button'
import { useDialog } from '../hooks/useDialog'
import { useLanguage } from '../hooks/useLanguage'

// A component for confirmation dialog.
const Confirm = () => {
  const { onConfirm, onCancel } = useDialog()
  const texts = useLanguage()
  
  return (
    <div id='confirm' className='dialog' >
      <p></p>
      <div className='link-group'>
        <Button className='button' onClick={async () => onConfirm()} text={texts.view.listItem.entry.ok} />
        <Button className='button' onClick={async () => onCancel()} text={texts.view.listItem.entry.cancel} />
      </div>
    </div>
  )
}

export default Confirm