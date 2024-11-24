import React, { useRef } from "react";
import * as THREE from 'three'

const Light = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  
  return (
    <>
      <directionalLight
        intensity={0.7}
        castShadow
        shadow-bias={0.0004}
        position={[0, 10, 0]}
        ref={directionalLightRef}
      ></directionalLight>
      <ambientLight color={"white"} intensity={5} />
    </>
  );
};

export default Light;
