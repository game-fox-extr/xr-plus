import { PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
//import EcctrlJoystickControls from "./JoyStickControls";
import { EcctrlJoystick } from "ecctrl";
import { useSceneStabilityStore } from "../../store/useSceneStabilityStore";
import Environment from "./Environment";
import RayCaster from "./Raycaster";
import Skybox from "./Skybox";
import Television from "./Television";
import React from "react";

// Utility function to detect mobile or tablet
const isMobileOrTablet = () => {
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
    navigator.userAgent
  );
};

const yeah: number = 10;

const LazyEnvironment = React.lazy(()=> import('./Environment'))
const LazyTelevision = React.lazy(()=> import('./Television'))
const LazyMannequin = React.lazy(()=> import('./Mannequin'))

const ThreeScene = ({
  onCubeClick,
}: // isPointerLocked,
{
  onCubeClick: () => void;
  // isPointerLocked: boolean;
}) => {
  const { isLoading, sceneKey, loadingProgress } = useSceneStabilityStore();

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
      {isMobileOrTablet() && <EcctrlJoystick />}

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
          <LazyEnvironment />
          <LazyMannequin
            position={[4, -10.5, -24]}
            modelPath="/models/inter_elem1.glb"
            onClick={onCubeClick}
            scale={1.2}
          />

          {/* Model 2 */}
          <LazyMannequin
            position={[6, -10.5, -24]}
            modelPath="/models/inter_elem2.glb"
            onClick={onCubeClick}
            scale={1.2}
          />

          {/* Model 3 */}
          <LazyMannequin
            position={[8, -10.5, -24]}
            modelPath="/models/inter_elem.glb"
            onClick={onCubeClick}
            scale={1.2}
          />
          <LazyTelevision
            videoPath="/media/backhome.mp4"
            scale={[0.9, 0.9, 0.9]}
            position={[5, 4.8, -33.5]}
            rotation={[0, -82.79, 0]}
          />
        </Suspense>
        <PointerLockControls />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
