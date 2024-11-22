import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import Scene from "./Scene";

function SkyBox() {
  const { scene } = useThree();
  const loader = new THREE.CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    "/textures/skybox/nx.webp",
    "/textures/skybox/ny.webp",
    "/textures/skybox/nz.webp",
    "/textures/skybox/px.webp",
    "/textures/skybox/py.webp",
    "/textures/skybox/pz.webp",
  ]);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
}


const ThreeScene: React.FC = () => {

  return (
    <Canvas>
      <SkyBox />
     <Scene/>
    </Canvas>
  );
};
export default ThreeScene;
