import { Html, KeyboardControls, useProgress } from "@react-three/drei";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlProps } from "ecctrl";
import React, { forwardRef, Suspense, useEffect, useMemo, useRef } from "react";
import Light from "./Light";
import { useSceneStabilityStore } from "../../store/useSceneStabilityStore";

interface CustomEcctrlProps extends EcctrlProps {
  initialPosition?: [number, number, number];
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
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

const LazyCastle = React.lazy(() => import("./Castle"));

const CustomEcctrl = forwardRef<RapierRigidBody, CustomEcctrlProps  >(
  ({ initialPosition = [10, 10, 0], ...props }, ref) => {
    const localRef = useRef<RapierRigidBody>(null);
    const { resetScene, setPlayerPosition, playerPosition } = useSceneStabilityStore();

    const combinedRef = (ref || localRef) as React.RefObject<RapierRigidBody>;

    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && combinedRef.current) {
          try {
            combinedRef.current.setTranslation(
              { 
                x: initialPosition[0], 
                y: initialPosition[1], 
                z: initialPosition[2] 
              }, 
              true
            );
            combinedRef.current.setLinvel(
              { x: 0, y: 0, z: 0 }, 
              true
            );

            // global state
            // setPlayerPosition(playerPosition);
            resetScene();
          } catch (error) {
            console.error('Failed to reset character position:', error);
          }
        }
      };

      const handleWindowResize = () => {
        if (combinedRef.current) {
          try {
            // Reset position on window resize
            combinedRef.current.setTranslation(
              { x: initialPosition[0], y: initialPosition[1], z: initialPosition[2] }, 
              true
            );
            combinedRef.current.setLinvel(
              { x: 0, y: 0, z: 0 }, 
              true
            );

            setPlayerPosition(initialPosition);
            resetScene();
          } catch (error) {
            console.error('Failed to reset character position on resize:', error);
          }
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('resize', handleWindowResize);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleWindowResize);
      };
    }, [initialPosition, resetScene, setPlayerPosition]);

    return (
      <Ecctrl
        ref={combinedRef}
        position={initialPosition}
        {...props}
      />
    );
  }
);

CustomEcctrl.displayName = 'CustomEcctrl';

const Environment = React.memo(() => {
  const { sceneKey, playerPosition } = useSceneStabilityStore();
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
      capsuleHalfHeight: 0.55, //Height of character
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
    <KeyboardControls map={KEYBOARD_MAP}>
      <Physics key={sceneKey} {...physicsProps}>
        <Light />
         <CustomEcctrl {...ecctrlProps} />
        <RigidBody type="fixed" colliders="trimesh">
          <LazyCastle
            position={[0, -0.55, -5]}
            scale={1}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </Physics>
    </KeyboardControls>

  );
});

Environment.displayName = "Environment";

export default Environment;
