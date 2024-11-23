import {
  Gltf,
  KeyboardControls,
  OrbitControls
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { CubeTextureLoader } from "three";
import Model from "./Model";
// import Environment from './World/Environment'
import Ecctrl from "ecctrl";

function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    "/textures/skybox/px.webp",
    "/textures/skybox/nx.webp",
    "/textures/skybox/py.webp",
    "/textures/skybox/ny.webp",
    "/textures/skybox/pz.webp",
    "/textures/skybox/nz.webp",
  ]);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
}
let characterURL = "./Demon.glb";
console.log({ characterURL });

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  // Optional animation key map
  { name: "action1", keys: ["1"] },
  { name: "action2", keys: ["2"] },
  { name: "action3", keys: ["3"] },
  { name: "action4", keys: ["KeyF"] },
];

const Scene = () => {
  return (
    <mesh>
      <OrbitControls />
      <SkyBox />
      <directionalLight
        intensity={0.7}
        castShadow
        shadow-bias={0.0004}
        position={[ 0, 1, 0 ]}
      >
        <perspectiveCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>
      <ambientLight color={'0xffffff'} intensity={1} />
      <Physics timeStep="vary">
        <RigidBody type="fixed" colliders="trimesh">
          <Gltf
          
            castShadow
            receiveShadow
            // rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.55, -5]}
            scale={1}
            src="Castle28mb.glb"
            // src="/fantasy_game_inn2-transformed.glb"
          />
        </RigidBody>
        <KeyboardControls map={keyboardMap}>
          <Ecctrl animated>
            <Model />
          </Ecctrl>
        </KeyboardControls>
      </Physics>
    </mesh>
  );
};
export default Scene;