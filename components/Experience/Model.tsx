import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from'three'

type GLTFModel = GLTF & {
  nodes: {
    Curve007_1: THREE.Mesh
    Curve007_2: THREE.Mesh
    // Add more nodes if needed
  }
  materials: {
    'Material.001': THREE.Material
    'Material.002': THREE.Material
    // Add more materials if needed
  }
}

export default function Model(props: any) {
  const groupRef = useRef<THREE.Group>(null)

  // Type the result of useGLTF as unknown first to avoid the KTX2Loader error
  const { nodes, materials } = useGLTF('models/asian_female_animated.glb')

  return (
    // <group ref={groupRef} {...props} dispose={null}>
    //   <mesh castShadow receiveShadow geometry={nodes.Curve007_1.geometry} material={materials['Material.001']} />
    //   <mesh castShadow receiveShadow geometry={nodes.Curve007_2.geometry} material={materials['Material.002']} />
    // </group>
    <group>
    <primitive 
      object={nodes.Scene} 
      scale={1} 
      position={[0, -0.55, 1]}
      rotation={[0, 0, 0]}
    />
  </group>
  )
}

// Preload the model for better performance
useGLTF.preload('models/asian_female_animated.glb')
