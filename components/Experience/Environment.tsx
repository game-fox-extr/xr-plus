import { KeyboardControls } from "@react-three/drei";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlProps } from "ecctrl";
import React, { forwardRef, Suspense, useEffect, useMemo, useRef } from "react";
import { useSceneStabilityStore } from "../../store/useSceneStabilityStore";
import Light from "./Light";
import Products from "./Products";
import Castle from "./Castle";

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

    // Store the previous player position to avoid unnecessary updates
    const prevPositionRef = useRef<[number, number, number]>([
      initialPosition[0],
      initialPosition[1],
      initialPosition[2],
    ]);

    const resetKeys = () => {
      dispatchEvent(new KeyboardEvent("keyup", { code: "KeyW" }));
      dispatchEvent(new KeyboardEvent("keyup", { code: "KeyS" }));
      dispatchEvent(new KeyboardEvent("keyup", { code: "KeyA" }));
      dispatchEvent(new KeyboardEvent("keyup", { code: "KeyD" }));
      dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowUp" }));
      dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowDown" }));
      dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowLeft" }));
      dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowRight" }));
      dispatchEvent(new KeyboardEvent("keyup", { code: "Space" }));
      dispatchEvent(new KeyboardEvent("keyup", { code: "Shift" }));
      // console.log("Keys reset");
    };

    useEffect(() => {
      let animationFrameId: number;
      let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible" && combinedRef.current) {
          const currentPos = combinedRef.current.translation();
          if (
            currentPos.x !== prevPositionRef.current[0] ||
            currentPos.y !== prevPositionRef.current[1] ||
            currentPos.z !== prevPositionRef.current[2]
          ) {
            try {
              combinedRef.current.setTranslation(
                {
                  x: currentPos.x,
                  y: currentPos.y,
                  z: currentPos.z,
                },
                true
              );
              combinedRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
              setPlayerPosition([currentPos.x, currentPos.y, currentPos.z]);
              prevPositionRef.current = [
                currentPos.x,
                currentPos.y,
                currentPos.z,
              ];
            } catch (error) {
              console.error("Failed to reset character position:", error);
            }
          }
        }
      };

      const handleWindowResize = () => {
        if (combinedRef.current) {
          const currentPos = combinedRef.current.translation();
          if (
            currentPos.x !== prevPositionRef.current[0] ||
            currentPos.y !== prevPositionRef.current[1] ||
            currentPos.z !== prevPositionRef.current[2]
          ) {
            try {
              combinedRef.current.setTranslation(
                { x: currentPos.x, y: currentPos.y, z: currentPos.z },
                true
              );
              combinedRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
              setPlayerPosition([currentPos.x, currentPos.y, currentPos.z]);
              prevPositionRef.current = [
                currentPos.x,
                currentPos.y,
                currentPos.z,
              ];
            } catch (error) {
              console.error(
                "Failed to reset character position on resize:",
                error
              );
            }
          }
        }
      };

      const respawnPlayer = () => {
        if (combinedRef.current) {
          const currentPos = combinedRef.current.translation();
          if (currentPos.y < -15) {
            if (debounceTimeout) {
              clearTimeout(debounceTimeout);
            }
            debounceTimeout = setTimeout(() => {
              try {
                combinedRef?.current!.setTranslation(
                  {
                    x: initialPosition[0],
                    y: initialPosition[1],
                    z: initialPosition[2],
                  },
                  true
                );
                combinedRef?.current!.setLinvel({ x: 0, y: 0, z: 0 }, true);
                setPlayerPosition(initialPosition);
              } catch (error) {
                console.error("Failed to respawn player:", error);
              }
            }, 500); // Debounce the respawn logic
          }
        }
      };

      const checkRespawn = () => {
        respawnPlayer();
        animationFrameId = requestAnimationFrame(checkRespawn);
      };
      animationFrameId = requestAnimationFrame(checkRespawn);

      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("visibilitychange", resetKeys);
      window.addEventListener("blur", resetKeys);
      window.addEventListener("resize", handleWindowResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        document.removeEventListener("visibilitychange", resetKeys);
        window.removeEventListener("blur", resetKeys);
        window.removeEventListener("resize", handleWindowResize);
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
      };
    }, [initialPosition, resetScene, setPlayerPosition]);

    return <Ecctrl ref={combinedRef} position={initialPosition} {...props} />;
  }
);

CustomEcctrl.displayName = "CustomEcctrl";

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
        accDeltaTime: 8,
        followLightPos: { x: 20, y: 30, z: 10 },
      }),
      [playerPosition]
    );

    return (
      <KeyboardControls map={KEYBOARD_MAP}>
        <Suspense fallback={null}>
          <Physics key={sceneKey} {...physicsProps}>
            <Light />
            <CustomEcctrl {...ecctrlProps} />
            <Castle
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
