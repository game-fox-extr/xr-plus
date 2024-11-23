import { Canvas } from "@react-three/fiber";
import React from "react";
import Scene from "./Scene";
import Skybox from "./Skybox";

const ThreeScene: React.FC = () => {

  return (
    <Canvas>
     <Skybox/>
     <Scene/>
    </Canvas>
  );
};
export default ThreeScene;
