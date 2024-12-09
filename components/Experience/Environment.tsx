import { Html, KeyboardControls, useKeyboardControls } from "@react-three/drei";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlProps } from "ecctrl";
import React, { forwardRef, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Light from "./Light";
import { useSceneStabilityStore } from "../../store/useSceneStabilityStore";
import Loader from "./Loader";

interface CustomEcctrlProps extends EcctrlProps {
  initialPosition?: [number, number, number];
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

const CustomEcctrl = forwardRef<RapierRigidBody, CustomEcctrlProps>(
  ({ initialPosition = [10, 10, 0], ...props }, ref) => {
    const localRef = useRef<RapierRigidBody>(null);
    const { resetScene, setPlayerPosition, playerPosition } = useSceneStabilityStore();

    const combinedRef = (ref || localRef) as React.RefObject<RapierRigidBody>;

    const resetKeys = () => {
        dispatchEvent(new KeyboardEvent('keyup', {code: 'KeyW'}));
        dispatchEvent(new KeyboardEvent('keyup', {code: 'KeyS'}));
        dispatchEvent(new KeyboardEvent('keyup', {code: 'KeyA'}));
        dispatchEvent(new KeyboardEvent('keyup', {code: 'KeyD'}));
        dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowUp'}));
        dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowDown'}));
        dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowLeft'}));
        dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowRight'}));
        dispatchEvent(new KeyboardEvent('keyup', {code: 'Space'}));
        dispatchEvent(new KeyboardEvent('keyup', {code: 'Shift'}));
        console.log("Keys reset");
    };

    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && combinedRef.current) {
          const currentPos = combinedRef.current.translation();
          try {
            combinedRef.current.setTranslation(
              { 
                x: currentPos.x, 
                y: currentPos.y, 
                z: currentPos.z
              }, 
              true
            );
            combinedRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

            // resetScene();
          } catch (error) {
            console.error('Failed to reset character position:', error);
          }
        }
      };

      const handleWindowResize = () => {
        if (combinedRef.current) {
          const currentPos = combinedRef.current.translation();
          try {
            combinedRef.current.setTranslation(
              { x: currentPos.x, y: currentPos.y, z: currentPos.z}, 
              true
            );
            combinedRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

            setPlayerPosition([currentPos.x, currentPos.y, currentPos.z]);
            // resetScene();
          } catch (error) {
            console.error('Failed to reset character position on resize:', error);
          }
        }
      };

      const respawnPlayer = () => {
        if (combinedRef.current) {
          const currentPos = combinedRef.current.translation();
          if (currentPos.y < -15) {
            try {
              combinedRef.current.setTranslation(
                { x: initialPosition[0], y: initialPosition[1], z: initialPosition[2] }, 
                true
              );
              combinedRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

              setPlayerPosition(initialPosition);
              console.log('Player respawned at initial position');
            } catch (error) {
              console.error('Failed to respawn player:', error);
            }
          }
        }
      };

      const intervalId = setInterval(respawnPlayer, 100); // Check every 100ms

      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('visibilitychange', resetKeys);
      window.addEventListener('blur', resetKeys);
      window.addEventListener('resize', handleWindowResize);

      return () => {
        clearInterval(intervalId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('visibilitychange', resetKeys);
      window.removeEventListener('blur', resetKeys);
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
    <Suspense fallback={<Loader />}>
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
    </Suspense>
  );
});

Environment.displayName = "Environment";

export default Environment;
