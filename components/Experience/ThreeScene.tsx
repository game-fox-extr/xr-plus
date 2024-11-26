import { PivotControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import CenteredDot from "./CenteredDot";
import EcctrlJoystickControls from "./JoyStickControls";
import RayCaster from "./Raycaster";
import Scene from "./Scene";
import Skybox from "./Skybox";

const DraggableCube = ({
  position = [0, 0, 0],
}: {
  position: [x: number, y: number, z: number];
}) => {
  return (
    <PivotControls anchor={[0, 0, 0]} scale={1}>
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </PivotControls>
  );
};

const ThreeScene: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <EcctrlJoystickControls />
      <div style={{ position: "absolute", zIndex: 100, right: "1" }}>hello</div>
      <Canvas
        shadows
        camera={{
          fov: 65,
          near: 0.1,
          far: 1000,
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") {
            (e.target as HTMLCanvasElement).requestPointerLock();
          }
        }}
      >
        <Suspense fallback={"Loading..."}>
          <RayCaster />
          <Skybox />
          <Scene />
          <DraggableCube position={[2.89, -0.57, -28.56]} />
          <DraggableCube position={[8.23, -0.73, -29.52]} />
        </Suspense>
      </Canvas>
      <CenteredDot />
    </div>
  );
};

export default ThreeScene;
