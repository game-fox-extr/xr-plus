import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import Scene from "./Scene";
import Skybox from "./Skybox";
import { EcctrlJoystick } from "ecctrl";

const ThreeScene: React.FC = () => {
  const EcctrlJoystickControls = () => {
    const [isTouchScreen, setIsTouchScreen] = useState(false);
    useEffect(() => {
      // Check if using a touch control device, show/hide joystick
      if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
        setIsTouchScreen(true);
      } else {
        setIsTouchScreen(false);
      }
    }, []);
    return <>{isTouchScreen && <EcctrlJoystick buttonNumber={5} />}</>;
  };
  return (
    <>
      <EcctrlJoystickControls />
      <Canvas
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") {
            (e.target as HTMLCanvasElement).requestPointerLock();
          }
        }}
      >
        <Suspense fallback={"Loading..."}>
          <Skybox />
          <Scene />
        </Suspense>
      </Canvas>
    </>
  );
};
export default ThreeScene;
