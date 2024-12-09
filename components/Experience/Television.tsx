import React, { useEffect } from 'react';
import { useGLTF, useVideoTexture } from '@react-three/drei';
import { Mesh, Material } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Define a custom GLTF type for the TV model
interface TVModelGLTF extends GLTF {
  nodes: {
    'monitor-screen': Mesh;
    tv_frame: Mesh;
  };
  materials: {
    phong15: Material;
  };
}

interface TelevisionProps {
  videoPath: string;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Television({
  videoPath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: TelevisionProps) {
  const { nodes, materials } = useGLTF('/models/tv_modified.glb') as unknown as TVModelGLTF;
  const videoTexture = useVideoTexture(videoPath, {
    crossOrigin: 'anonymous',
    loop: true,
    muted: true,
    playsInline: true,
  });

  useEffect(() => {
    if (videoTexture) {
      videoTexture.flipY = false; // Correct the orientation for the texture
    }
  }, [videoTexture]);

  return (
    <group
      dispose={null}
      scale={scale}
      position={position}
      rotation={rotation.map((r) => r * (Math.PI / 180)) as [number, number, number]} // Convert to radians
    >
      <group
        position={[-0.577, 0.192, -0.479]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.004, 16, 9]}
      >
        {/* Monitor Screen with Video Texture */}
        <mesh castShadow receiveShadow geometry={nodes['monitor-screen'].geometry}>
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        </mesh>

        {/* TV Frame */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.tv_frame.geometry}
          material={materials.phong15}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/models/tv_modified.glb');
