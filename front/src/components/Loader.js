import React, { useRef, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'

// Component representing the loading animation.
const Loader = () => {
  const texts = useLanguage()
  const letters = texts.loader
  let text = ''  
  const canvRef = useRef(null)

  // Blocking the code for the requested time as milliseconds.
  const sleep = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time))
  }

  // The loading text is drawn letter by letter on the canvas.
  // The frameCount correlates with the amount of characters in loading text.
  const draw = (c, frameCount) => {
    text = text + letters[frameCount]
    c.font = 'small-caps 24px Monospace'
    c.fillStyle = document.body.classList.contains('light') ? '#000' : '#FFF'
    c.textAlign = 'center'
    c.clearRect(0, 0, c.canvas.width, c.canvas.height)
    c.fillText(text, c.canvas.width / 2, c.canvas.height / 2)
  }  

  // As the canvas element created in return statement is stored in a ref, it can be accessed in useEffeck. 
  // The setTimeout created in useEffect takes care of updating the canvas by draw method. After the timeout 
  // loop is started, the code never leaves render function until unmounting. On unmount the function returned 
  // from useEffect is called, and timeout is cleared.
  useEffect(() => {
    const canv = canvRef.current
    canv.width = 120
    canv.height = 30
    const c = canv.getContext('2d')
    let frameCount = 0
    let timeout
    
    const render = async () => {
      clearTimeout(timeout)
      // When all the characters in loading text have been printed, the frameCount and text are reset and a 
      // new round starts after 500 milliseconds.
      if (frameCount === letters.length) {
        await sleep(500)
        frameCount = 0
        text = ''
      }
      draw(c, frameCount)         
      frameCount++      
      timeout = setTimeout(render, 20)
    }
    timeout = setTimeout(render, 0)
    
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className='loader'>
      <canvas ref={canvRef}></canvas>
    </div>
  )
}

export default Loader