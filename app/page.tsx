'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Preloader from '../components/Experience/Preloader'
import GameExperience from '../components/Experience/GameExperience'
import styled from 'styled-components'
import ThreeScene from '../components/Experience/ThreeScene'

const Page = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const Button = styled.button`
  color: grey;
`;
  return (
    <main>
      {isLoading && <Preloader onLoadComplete={() => setIsLoading(false)} />}
      {/* {!isLoading && <GameExperience />} */}
      {/* <audio id="myAudio" style={{ display: 'none' }} src="/media/music.mp3" /> */}
      <ThreeScene />
      hi
    </main>
  ) 
}

export default Page