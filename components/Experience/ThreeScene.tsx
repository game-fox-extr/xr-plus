import { PointerLockControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
//import EcctrlJoystickControls from "./JoyStickControls";
import axios from "axios";
import { DM_Sans } from "next/font/google";
import Environment from "./Environment";
import Skybox from "./Skybox";
import { useSceneStabilityStore } from "../../store/useSceneStabilityStore";
import RayCaster from "./Raycaster";
import DraggableMannequin from "./Mannequin";
import Television from "./Television";

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

const LoadingOverlay: React.FC = () => {
  const { loadingProgress, isLoading } = useSceneStabilityStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-300" 
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      <p className="mt-4 text-white">
        Loading... {loadingProgress.toFixed(0)}%
      </p>
    </div>
  );
};

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
      {/* <LoadingScreen /> */}
      <Canvas
        key={sceneKey}
        shadows
        camera={{
          fov: 65,
          near: 0.1,
          far: 1000,
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Suspense fallback={null}>
          <RayCaster />
          <Skybox />
          <Environment />
          <DraggableMannequin
            position={[4, -0.5, -24]}
            modelPath="/models/inter_elem1.glb"
            onClick={onCubeClick}
            scale={1.2}
          />

          {/* Model 2 */}
          <DraggableMannequin
            position={[6, -0.5, -24]}
            modelPath="/models/inter_elem2.glb"
            onClick={onCubeClick}
            scale={1.2}
          />

          {/* Model 3 */}
          <DraggableMannequin
            position={[8, -0.5, -24]}
            modelPath="/models/inter_elem.glb"
            onClick={onCubeClick}
            scale={1.2}
          />
          <Television
            videoPath="/media/backhome.mp4"
            scale={[0.9,0.9,0.9]}
            position={[5, 14.8, -33.5]}
            rotation={[0, -82.79, 0]} 
          />
        </Suspense>
        <PointerLockControls />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
