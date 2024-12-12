import { PivotControls, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { usePointerStore } from "../../store/usePointerStore";
import { EcctrlJoystick } from "ecctrl";
import React from "react";
import { useSceneStabilityStore } from "../../store/useSceneStabilityStore";
import Products from "./Products";
import RayCaster from "./Raycaster";
import Skybox from "./Skybox";

// Utility function to detect mobile or tablet
const isMobileOrTablet = () => {
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
    navigator.userAgent
  );
};

const LazyEnvironment = React.lazy(() => import("./Environment"));
const LazyTelevision = React.lazy(() => import("./Television"));

const ThreeScene = ({
  onCubeClick,
}: // isPointerLocked,
{
  onCubeClick: () => void;
  // isPointerLocked: boolean;
}) => {
  const { isLoading, sceneKey, loadingProgress, isModalOpen } =
    useSceneStabilityStore();
  const { pointerLocked } = usePointerStore();

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Render joystick only on mobile or tablet */}
      {isMobileOrTablet() && !isModalOpen && <EcctrlJoystick />}

      {/* <LoadingScreen /> */}
      <Canvas
        key={sceneKey}
        shadows
        camera={{
          fov: 65,
          near: 0.1,
          far: 1000,
          position: [5, -5, 0],
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Suspense fallback={null}>
          <RayCaster />
          <Skybox />
          <LazyEnvironment onCubeClick={onCubeClick}/>
          <LazyTelevision
            videoPath="/media/backhome.mp4"
            scale={[0.9, 0.9, 0.9]}
            position={[5, 4.8, -33.5]}
            rotation={[0, -82.79, 0]}
          />
            <LazyTelevision
              videoPath="/media/backhome.mp4"
              scale={[0.3, 0.3, 0.3]}
              position={[24, -8.42, 42.38]}
              rotation={[0, 82.79, 0]}
            />
            <LazyTelevision
              videoPath="/media/backhome.mp4"
              scale={[0.1, 0.9, 0.1]}
              position={[3.72, -8.57, 9.55]} 
              rotation={[0, -82.79, 0]}
            />
        </Suspense>
        <PointerLockControls enabled={pointerLocked} />
      </Canvas>
    </div>
  );
};
// {
//   "x": "30.54",
//   "y": "-8.07",
//   "z": "42.56"
// }
// {
//   "x": "24.77",
//   "y": "-8.42",
//   "z": "42.38"
// }
export default ThreeScene;
