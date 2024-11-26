import { PivotControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import CenteredDot from "./CenteredDot";
//import EcctrlJoystickControls from "./JoyStickControls";
import RayCaster from "./Raycaster";
import Scene from "./Scene";
import Skybox from "./Skybox";

const DraggableCube = ({
  position = [0, 0, 0],
  onClick,
}: {
  position: [x: number, y: number, z: number];
  onClick: () => void;
}) => {
  return (
    <PivotControls anchor={[0, 0, 0]} scale={1}>
      <mesh position={position} onClick={onClick}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </PivotControls>
  );
};

const Modal = ({ isOpen, onClose } : any) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <h2>Modal Content</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const ThreeScene: React.FC = () => {
  // const { camera } = useThree();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);

  useEffect(() => {
    setIsSceneReady(true);
  }, []);

  const handleCubeClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* <EcctrlJoystickControls /> */}
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
          {isSceneReady && (
            <>
              <Scene />
              <DraggableCube position={[2.89, -0.57, -28.56]} onClick={handleCubeClick} />
              <DraggableCube position={[8.23, -0.73, -29.52]} onClick={handleCubeClick} />
            </>
          )}
        </Suspense>
      </Canvas>
      <CenteredDot />
      <Modal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default ThreeScene;