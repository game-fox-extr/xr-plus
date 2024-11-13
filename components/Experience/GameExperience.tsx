'use client'

import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import Experience from '../Experience/Experience'

const GameExperience = () => {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const socketUrl = new URL('/', window.location.href)
    const chatSocket = io(socketUrl.toString() + 'chat')
    const updateSocket = io(socketUrl.toString() + 'update')
    
    const experience = new Experience(canvasRef.current, updateSocket, chatSocket)
    
    return () => {
      chatSocket.disconnect()
      updateSocket.disconnect()
    }
  }, [])

  return (
    <div className="experience-wrapper">
      <canvas ref={canvasRef} className="experience-canvas" />
      <div className="crosshair" />
      <img id="lensImage" src="/Ar Icon.svg" alt="Lens Icon" className="lens-icon" />
      <img src="/Bot Icon.svg" alt="Chatbot Icon" className="chatbot-icon" />
      <img src="/ChatWithOthers.svg" alt="Chat With other icon" className="chat-with-other-icon" />
      <img src="/images/camera.svg" alt="Change View Icon" className="change-view-icon" />
    //TODO:
      {/* Add other UI elements */}
    </div>
  )
}

export default GameExperience