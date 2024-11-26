import { PivotControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import CenteredDot from "./CenteredDot";
//import EcctrlJoystickControls from "./JoyStickControls";
import RayCaster from "./Raycaster";
import Scene from "./Scene";
import Skybox from "./Skybox";
import axios from "axios";
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  
  if (!active) return null;
  
  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
      color: "white",
      zIndex: 1001,
    }}>
      <div style={{
        width: "256px",
        height: "16px",
        backgroundColor: "#374151",
        borderRadius: "9999px",
        overflow: "hidden"
      }}>
        <div 
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#f6523b",
            transition: "all 300ms"
          }}
        />
      </div>
      <div className={dmSans.className} style={{
        marginTop: "16px",
        fontSize: "1.125rem",
        fontWeight: 300,
        
      }}>
        Loading... {progress.toFixed(0)}%
      </div>
    </div>
  );
};

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

const Modal = ({ isOpen, onClose, data }: any) => {
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
        {data && (
          <>
            <p>Status Code: {data["status-code"]}</p>
            <p>Product Title: {data.product.title}</p>
            <p>Product ID: {data.product.id}</p>
          </>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const fetchData = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/shopify/products/9658662388005"
  );
  return { "status-code": res.status, product: res.data.product };
};

const ThreeScene: React.FC = () => {
  // const { camera } = useThree();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [modalData, setModalData] = useState<{
    "status-code": number;
    product: any;
  } | null>(null);
 

  useEffect(() => {
    setIsSceneReady(true);
  }, []);

  const handleCubeClick = async () => {
    try {
      const data = await fetchData();
      setModalData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setModalData(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalData(null);
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
      
      <LoadingScreen />
      
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
        <Suspense fallback={null}>
          <RayCaster />
          <Skybox />
          {isSceneReady && (
            <>
              <Scene />
              <DraggableCube
                position={[2.89, -0.57, -28.56]}
                onClick={handleCubeClick}
              />
              <DraggableCube
                position={[8.23, -0.73, -29.52]}
                onClick={handleCubeClick}
              />
            </>
          )}
        </Suspense>
      </Canvas>
      <CenteredDot />
      <Modal isOpen={isModalOpen} onClose={handleModalClose} data={modalData} />
    </div>
  );
};

export default ThreeScene;
