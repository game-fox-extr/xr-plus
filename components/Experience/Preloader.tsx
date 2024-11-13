'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import gsap from 'gsap'

const Preloader = ({ onLoadComplete }: any) => {
  const [loading, setLoading] = useState(0)
  const [userName, setUserName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [showNameForm, setShowNameForm] = useState(true)
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [showAvatarSelect, setShowAvatarSelect] = useState(false)
  
  useEffect(() => {
    // Initialize socket connection
    const socketUrl = new URL('/', window.location.href)
    const socket = io(socketUrl.toString() + 'update')
    
    // Animation timeline
    const tl = gsap.timeline()
    
    // Update loading progress
    let counter = 0
    const interval = setInterval(() => {
      if (counter < 100) {
        counter += 1
        setLoading(counter)
      } else {
        clearInterval(interval)
      }
    }, 50)
    
    return () => {
      clearInterval(interval)
      socket.disconnect()
    }
  }, [])

  const handleNameSubmit = ({e} : any) => {
    // e.preventDefault()
    console.log({e});
    
    // if (!userName) return
    
    // setShowNameForm(false)
    // setShowRoomForm(true)
  }
  
  const handleRoomCreate = () => {
    // Socket emit create room
    setShowRoomForm(false)
    setShowAvatarSelect(true) 
  }
  
  const handleRoomJoin = () => {
    if (!roomCode) return
    // Socket emit join room
    setShowRoomForm(false)
    setShowAvatarSelect(true)
  }
  
  const handleAvatarSelect = ({type}: any) => {
    // Socket emit avatar selection
    onLoadComplete()
  }

  return (
    <div className="preloader">
      {/* Loading Screen */}
      {loading < 100 && (
        <div className="preloader-wrapper">
          <img src="/Symbol Transparent PNG.png" className="svgLogo" alt="MainFoxLogo" />
          <div className="progress-bar-container">
            <div className="progress-bar" style={{width: `${loading}%`}} />
          </div>
          <div className="progress-wrapper">
            <span>{loading}%</span>
          </div>
          <h1 className="preloader-title fade-in-out">Your XR experience is loading</h1>
        </div>
      )}

  {/*  TODO: Name Form
      {loading === 100 && showNameForm && (
        <div className="name-form-wrapper">
          <h2 className="welcome-title">Welcome to Game Fox</h2>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="What should we call you?"
              required
            />
            <button type="submit">Continue</button>
          </form>
        </div>
      )} */}

      {/* Room Form */}
      {showRoomForm && (
        <div className="room-form-wrapper">
          <button onClick={handleRoomCreate}>Create Room</button>
          <div className="join-wrapper">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Room Code"
              minLength={6}
              maxLength={6}
            />
            <button onClick={handleRoomJoin}>Join</button>
          </div>
        </div>
      )}

      {/* Avatar Selection */}
      {showAvatarSelect && (
        <div className="avatar-selection">
          <h2>Choose your avatar:</h2>
          <div className="avatar-wrapper">
            <img
              src="/images/asian_male_head.png"
              alt="Male Avatar"
              onClick={() => handleAvatarSelect('male')}
            />
            <img
              src="/images/asian_female_head.png" 
              alt="Female Avatar"
              onClick={() => handleAvatarSelect('female')}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Preloader
