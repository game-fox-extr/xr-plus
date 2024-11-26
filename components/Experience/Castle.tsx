import React, { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
// Define proper TypeScript types for the GLTF model
interface CastleGLTF {
  nodes: {
    Plane_1: THREE.Mesh;
    Plane_2: THREE.Mesh;
    Plane_3: THREE.Mesh;
    Plane_4: THREE.Mesh;
  };
  materials: {
    "Material.001": THREE.Material;
    "Material.002": THREE.Material;
    "Material.003": THREE.Material;
    "Material.004": THREE.Material;
  };
}

interface CastleProps {
  position?: [number, number, number];
  scale?: number | [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
}

// Loading component to show while model loads
const LoadingCastle = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" wireframe />
  </mesh>
);

// Main Castle component with optimizations
export const Castle: React.FC<CastleProps> = (props) => {
  const { nodes, materials } = useGLTF("/Castle28mb.glb") as unknown as  CastleGLTF;

  const castle = (
    <group {...props} dispose={null}>
      <group position={[9.78, 0, 62.55]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_1.geometry}
          material={materials["Material.004"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_2.geometry}
          material={materials["Material.002"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_3.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_4.geometry}
          material={materials["Material.003"]}
        />
      </group>
    </group>
  );

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <Suspense fallback={<LoadingCastle />}>{castle}</Suspense>
    </RigidBody>
  );
};

// Preload the model
useGLTF.preload("/Castle28mb.glb");

// Optional: Cleanup when component unmounts
Castle.displayName = "Castle";