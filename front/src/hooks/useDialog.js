import React from 'react'

// A custom hook for showing toast-like message dialogs to the user.

// A variable to save resolve()-function created by Promise
let resolveCallback
export const useDialog = () => {
  // Opening the dialog by adding class 'visible', and setting text in the p-element inside the dialog.
  const open = (elem, text) => {    
    elem.classList.add('visible')
    elem.childNodes[0].innerText = text
  }

  const close = (elem) => {
    elem.classList.remove('visible')
  }

  // A Promise is created, and the pending resolve object is saved to variable resolveCallback outside the hook function.
  const confirm = async (elem, text, type) => {
    open(elem, text, type)
    return new Promise((resolve) => {
      resolveCallback = resolve
    })
  }
  // Determining the border color of message dialog: error = red, otherwise green.
  // setTimeout() calls the close()-function, which closes the dialog after given time.
  const message = (elem, text, type, error) => {
    elem.style.borderColor = error ? '#f84f31' : '#3f7e51'
    open(elem, text, error)
    setTimeout(() => {
      close(elem)
    }, 3000)
  }
  
  // Functions to set on button click callbacks in confimation dialog.
  const onConfirm = () => {
    resolveCallback(true)
  }
  const onCancel = () => {
    resolveCallback(false)
  }

  const showDialog = async (text, type, error = null) => {
    const elem = document.getElementById(type)
    if (type === 'confirm') {
      const confirmed = await confirm(elem, text, type)
      close(elem)
      return confirmed
    }
    message(elem, text, type, error)
  }
  return { showDialog, onConfirm, onCancel }
}
