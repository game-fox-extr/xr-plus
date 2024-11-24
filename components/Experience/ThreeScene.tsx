import { Canvas } from "@react-three/fiber";
import { EcctrlJoystick } from "ecctrl";
import React, { Suspense, useEffect, useState } from "react";
import Scene from "./Scene";
import Skybox from "./Skybox";
import { Html } from "@react-three/drei";

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
  // const Cart = () => {
  //   return (
  //     <Html center>
  //       <div
  //         onClick={() => alert("Center pointer clicked!")}
  //         style={{
  //           position: "absolute",
  //           top: "50%",
  //           left: "50%",
  //           width: "10px",
  //           height: "10px",
  //           backgroundColor: "red",
  //           borderRadius: "50%",
  //           transform: "translate(-50%, -50%)",
  //           pointerEvents: "auto", // Ensures this is clickable
  //         }}
  //       />
  //     </Html>
  //   );
  // };
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
        {/* <Cart /> */}
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
