import { PointerLockControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
//import EcctrlJoystickControls from "./JoyStickControls";
import axios from "axios";
import DraggableCube from "./Cube";
import Scene from "./Scene";
import Skybox from "./Skybox";
import { DM_Sans } from "next/font/google";
import RayCaster from "./Raycaster";
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const LoadingScreen = () => {
  const { progress, active } = useProgress();

  if (!active) return null;

  return (
    <div
      style={{
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
      }}
    >
      <div
        style={{
          width: "256px",
          height: "16px",
          backgroundColor: "#374151",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#f6523b",
            transition: "all 300ms",
          }}
        />
      </div>
      <div
        className={dmSans.className}
        style={{
          marginTop: "16px",
          fontSize: "1.125rem",
          fontWeight: 300,
        }}
      >
        Loading... {progress.toFixed(0)}%
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

const ThreeScene = ({
  onCubeClick,
  // isPointerLocked,
}: {
  onCubeClick: () => void;
  // isPointerLocked: boolean;
}) => {
  console.count("threesceen.tsx");
  const [isSceneReady, setIsSceneReady] = useState(false);

  useEffect(() => {
    setIsSceneReady(true);
  }, []);

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
        // onPointerDown={(e) => {
        //   if (e.pointerType === "mouse") {
        //     (e.target as HTMLCanvasElement).requestPointerLock();
        //   }
        // }}
      >
        <Suspense fallback={null}>
          {/* <RayCaster /> */}
          <Skybox />
          {isSceneReady && (
            <>
              <Scene />
              <DraggableCube
                position={[2.89, -0.57, -28.56]}
                productId="product1"
                onClick={onCubeClick}
                // isPointerLocked={isPointerLocked}
              />
              <DraggableCube
                position={[8.23, -0.73, -29.52]}
                productId="product1"
                onClick={onCubeClick}
                // isPointerLocked={isPointerLocked}
              />
            </>
          )}
        </Suspense>
        <PointerLockControls />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
