import { Html, KeyboardControls, useProgress } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import Ecctrl from "ecctrl";
import { useState ,useEffect } from "react";
import React, { Suspense, useMemo } from "react";
import Light from "./Light";
import { useSceneStabilityStore } from "../../store/useSceneStabilityStore";
import "../styles/loading-animation.css";


function Loader() {
  const { progress } = useProgress();
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (progress >= 90) {
      const timer = setTimeout(() => setIsFading(true), 300); 
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [progress]);

  return (
    <Html center>
      <div className={`loader-background ${isFading ? "fade-out" : ""}`}>
        <div className="loader-container-container">
          <div className="loader-container" id="loaderContainer">
            <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="loading-text-container">
              <div className="loading-text typewriter">Delta XR</div>
              <div className="loading-text">{progress.toFixed(0)}% loaded</div>
            </div>
            <img
              id="powered-by-loader"
              src="logo.avif"
              alt="Powered By Strategy Fox"
              className="powered-by-loader"
            />
          </div>
          <div
            className="loading-line"
            style={{ transform: `scaleX(${progress / 100})` }}
          ></div>
        </div>
      </div>
    </Html>
  );
}


// Memoized keyboard map to prevent recreation
const KEYBOARD_MAP = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "action1", keys: ["1"] },
  { name: "action2", keys: ["2"] },
  { name: "action3", keys: ["3"] },
  { name: "action4", keys: ["KeyF"] },
];

// Lazy loaded Castle component
const LazyCastle = React.lazy(() => import("./Castle"));

const Environment = React.memo(() => {
   const { sceneKey, playerPosition, resetScene } = useSceneStabilityStore();
  // const { setLoading } = useSceneStabilityStore();
  const physicsProps = useMemo(
    () => ({
      timeStep: "vary" as const,
      interpolate: true,
    }),
    []
  );

  const ecctrlProps = useMemo(
    () => ({
      maxVelLimit: 2.5,
      fallingGravityScale: 2.5,
      fallingMaxVel: -20,
      jumpVel: 3,
      position: playerPosition,
      camCollision: false,
      camInitDis: -0.01,
      camMinDis: -0.01,
      camFollowMult: 10000,
      camLerpMult: 10000,
      turnVelMultiplier: 1,
      turnSpeed: 200,
      mode: "CameraBasedMovement",
      wakeUpDelay: 200,
      accDeltaTime: 8,
      followLightPos: { x: 20, y: 30, z: 10 },
    }),
    [playerPosition]
  );
 
  return (
    <Suspense fallback={<Loader />}>
      <KeyboardControls map={KEYBOARD_MAP}>
        <Physics key={sceneKey}  {...physicsProps}>
          <Light />
          <RigidBody type="fixed" colliders="trimesh">
            <LazyCastle
              position={[0, -0.55, -5]}
              scale={1}
              castShadow
              receiveShadow
            />
          </RigidBody>
          <RigidBody type="fixed" colliders="trimesh">
            {/* //TODO: reset screen implementation along with controls? */}
            <Ecctrl {...ecctrlProps} />
          </RigidBody>
        </Physics>
      </KeyboardControls>
    </Suspense>
  );
});

Environment.displayName = "Environment";

export default Environment;
