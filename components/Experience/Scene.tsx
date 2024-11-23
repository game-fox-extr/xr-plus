import { FirstPersonControls, KeyboardControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import Ecctrl from "ecctrl";
import { Castle } from "./Castle";

const keyboardMap = [
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

const Scene = () => {
  return (
    <>
      <directionalLight
        intensity={0.7}
        castShadow
        shadow-bias={0.0004}
        position={[0, 1, 0]}
      >
        {/* <perspectiveCamera attach="shadow-camera" args={[-20, 20, 20, -20]} /> */}
      </directionalLight>
      <ambientLight color={"white"} intensity={3} />
      <Physics timeStep="vary">
        <RigidBody type="fixed" colliders="trimesh">
          <Castle
            position={[0, -0.55, -5]}
            scale={1}
            castShadow
            receiveShadow
          />
        </RigidBody>

        {/* Keyboard controls for interaction */}
        <KeyboardControls map={keyboardMap}>
          <RigidBody type="fixed" colliders="trimesh">
            <Ecctrl
              maxVelLimit={2.5}
              fallingGravityScale={2.5} // Character is falling, apply higher gravity
              fallingMaxVel={-20}
              jumpVel={4}
              position={[10, 10, 0]}
              camCollision={false} // disable camera collision detect (useless in FP mode)
              camInitDis={-0.01} // camera intial position
              camMinDis={-0.01} // camera zoom in closest position
              camFollowMult={1000} // give a big number here, so the camera follows the target (character) instantly
              camLerpMult={1000} // give a big number here, so the camera lerp to the followCam position instantly
              turnVelMultiplier={1} // Turning speed same as moving speed
              turnSpeed={200} // give it big turning speed to prevent turning wait time
              mode="PointToMove" // CameraBasedMovement" | "FixedCamera" | "PointToMove | null
              wakeUpDelay={200}
              accDeltaTime={8}
              followLightPos= {{ x: 20, y: 30, z: 10 }}
            ></Ecctrl>
          </RigidBody>
        </KeyboardControls>
      </Physics>

      {/* First-person camera controls */}
      {/* <FirstPersonControls
        lookSpeed={0.5} // Adjust look sensitivity
        movementSpeed={5} // Adjust movement speed
        autoForward={false} // Disable automatic forward movement
        activeLook={true} // Enable mouse look
      /> */}
    </>
  );
};

export default Scene;
