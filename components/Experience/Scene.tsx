import {
  Gltf,
  KeyboardControls,
  OrbitControls,
  useGLTF,
  FirstPersonControls,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { CubeTextureLoader } from "three";
import Ecctrl from "ecctrl";
function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  const texture = loader.load([
    "/textures/skybox/px.webp",
    "/textures/skybox/nx.webp",
    "/textures/skybox/py.webp",
    "/textures/skybox/ny.webp",
    "/textures/skybox/pz.webp",
    "/textures/skybox/nz.webp",
  ]);

  scene.background = texture;
  return null;
}

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

type CastleProps = JSX.IntrinsicElements["group"];

export const Castle: React.FC<CastleProps> = (props) => {
  const { nodes, materials } = useGLTF("/Castle28mb.glb") as any; // Replace `any` with generated GLTF types if available
  return (
    <group {...props} dispose={null}>
      <group position={[9.78, 0, 62.55]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_1.geometry}
          material={materials["Material.004"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_2.geometry}
          material={materials["Material.002"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_3.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_4.geometry}
          material={materials["Material.003"]}
        />
      </group>
    </group>
  );
};
useGLTF.preload("/Castle28mb.glb");

const Scene = () => {
  return (
    <mesh>
      {/* SkyBox for environment */}
      <SkyBox />

      {/* Lights */}
      <directionalLight
        intensity={0.7}
        castShadow
        shadow-bias={0.0004}
        position={[0, 1, 0]}
      >
        <perspectiveCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>
      <ambientLight color={'white'} intensity={1} />
      <ambientLight color={'white'} intensity={1} />
      <ambientLight color={'white'} intensity={1} />
      <Physics timeStep="vary">
        <RigidBody type="fixed" colliders="trimesh">
          <Castle position={[0, -0.55, -5]} scale={1} castShadow receiveShadow/>
        </RigidBody>

        {/* Keyboard controls for interaction */}
        <KeyboardControls map={keyboardMap}>
        <RigidBody type="fixed" colliders="trimesh">
          <Ecctrl
            camCollision={false} // disable camera collision detect (useless in FP mode)
            camInitDis={-0.01} // camera intial position
            camMinDis={-0.01} // camera zoom in closest position
            camFollowMult={1000} // give a big number here, so the camera follows the target (character) instantly
            camLerpMult={1000} // give a big number here, so the camera lerp to the followCam position instantly
            turnVelMultiplier={1} // Turning speed same as moving speed
            turnSpeed={100} // give it big turning speed to prevent turning wait time
            mode="CameraBasedMovement" // character's rotation will follow camera's rotation in this mode>
          ></Ecctrl>
          </RigidBody>
        </KeyboardControls>
      </Physics>

      {/* First-person camera controls */}
      <FirstPersonControls
        lookSpeed={0.1} // Adjust look sensitivity
        movementSpeed={5} // Adjust movement speed
        autoForward={false} // Disable automatic forward movement
        activeLook={true} // Enable mouse look
      />
    </mesh>
  );
};

export default Scene;
