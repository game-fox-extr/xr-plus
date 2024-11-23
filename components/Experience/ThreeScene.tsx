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
    <div
    style={{
      position: "relative", // Ensures child elements are positioned correctly
      width: "100vw", // Full viewport width
      height: "100vh", // Full viewport height
      overflow: "hidden", // Prevents scrollbars
    }}
  >
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
   
      {/* Crosshair */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "8px",
          height: "8px",
          backgroundColor: "white", 
          borderRadius: "50%", 
          pointerEvents: "none", 
          zIndex: 100, 
        }}
      ></div>
     </div>
  );
};
export default ThreeScene;
