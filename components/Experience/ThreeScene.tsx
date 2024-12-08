import { PointerLockControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
//import EcctrlJoystickControls from "./JoyStickControls";
import axios from "axios";
import Environment from "./Environment";
import Skybox from "./Skybox";
import { useSceneStabilityStore } from "../../store/useSceneStabilityStore";
import RayCaster from "./Raycaster";
import DraggableMannequin from "./Mannequin";


// const fetchData = async () => {
//   const res = await axios.get(
//     "http://localhost:5000/api/shopify/products/9658662388005"
//   );
//   return { "status-code": res.status, product: res.data.product };
// };

const ThreeScene = ({
  onCubeClick,
}: // isPointerLocked,
{
  onCubeClick: () => void;
  // isPointerLocked: boolean;
}) => {
  const { isLoading, sceneKey } = useSceneStabilityStore();
  console.count("threesceen.tsx");

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
        // onPointerDown={(e) => {
        //   if (e.pointerType === "mouse") {
        //     (e.target as HTMLCanvasElement).requestPointerLock();
        //   }
        // }}
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
        </Suspense>
        <PointerLockControls />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
