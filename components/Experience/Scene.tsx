import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Player from '../Experience/World/Player/Player'
// import Environment from './World/Environment'

export default function Scene() {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      {/* <Player /> */}
      {/* <Environment /> */}
    </Canvas>
  )
}
