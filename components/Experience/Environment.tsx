import { KeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlProps } from "ecctrl";
import React, { forwardRef, Suspense, useMemo, useRef } from "react";
import { useSceneStabilityStore } from "../../store/useSceneStabilityStore";
import Light from "./Light";
import Products from "./Products";

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
    const { resetScene, setPlayerPosition, playerPosition } =
      useSceneStabilityStore();

    const combinedRef = (ref || localRef) as React.RefObject<RapierRigidBody>;

    useFrame(() => {
      if (combinedRef.current) {     
        const currentPos = combinedRef.current.translation();
        if (currentPos.y < -15) {
          try {
            combinedRef.current.setTranslation(
              {
                x: initialPosition[0],
                y: initialPosition[1],
                z: initialPosition[2],
              },
              true
            );
            combinedRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            // setPlayerPosition(initialPosition);
          } catch (error) {
            console.error("Failed to respawn player:", error);
          }
        }
      }
    });
    return (
      <Ecctrl ref={combinedRef} position={initialPosition} {...props} />
    );
  }
);

const Environment = React.memo(
  ({ onCubeClick }: { onCubeClick: () => void }) => {
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
        maxVelLimit: 4,
        fallingGravityScale: 2.5,
        fallingMaxVel: -20,
        jumpVel: 3,
        position: playerPosition,
        camCollision: false,
        camZoomSpeed: 0,
        camInitDis: -0.01,
        camMinDis: -0.01,
        capsuleHalfHeight: 0.55, //Height of character
        camFollowMult: 10000,
        camLerpMult: 10000,
        turnVelMultiplier: 1,
        turnSpeed: 200,
        mode: "CameraBasedMovement",
        wakeUpDelay: 200,
        accDeltaTime: 10,
        followLightPos: { x: 20, y: 30, z: 10 },
        capsuleRadius: 0.3,
        rayLength: 5.3, // Ray length
        rayDir: { x: 0, y: -1, z: 0 },
        springK: 1.2, // Spring constant
        rayOrigin: { x: 0, y: 0, z: 0 }, // Center of the screen
        raycastType: "center", // Custom prop to indicate center screen raycasting
        raycastOffset: {
          x: 0, // No horizontal offset
          y: 0, // No vertical offset from center
          z: 0  // No depth offset
        },
        // Optional: Add more precise raycasting parameters
        raycastPrecision: 0.1, // Adjust based on your game's scale
        raycastCollisionMask: -1, // Collide with all layers
      }),
      [playerPosition]
    );

    return (
      <KeyboardControls map={KEYBOARD_MAP}>
        <Suspense fallback={null}>
          <Physics key={sceneKey} {...physicsProps}>
            <Light />
            <CustomEcctrl {...ecctrlProps} />
            <LazyCastle
              position={[0, -0.55, -5]}
              scale={1}
              castShadow
              receiveShadow
            />
            <Products onCubeClick={onCubeClick} />
          </Physics>
        </Suspense>
      </KeyboardControls>
    );
  }
);

Environment.displayName = "Environment";

export default Environment;
