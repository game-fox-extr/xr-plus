import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  Fisheye,
  Gltf,
  KeyboardControls,
  OrbitControls,
} from "@react-three/drei";
import Player from "../Experience/World/Player/Player";
import Model from "./Model";
import { Physics, RigidBody } from "@react-three/rapier";
import { CatmullRomCurve3, CubeTextureLoader } from "three";
// import Environment from './World/Environment'
import Ecctrl, { EcctrlAnimation } from "ecctrl";

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
const animationSet = {
  idle: "Idle",
  walk: "Walk",
  run: "Run",
  jump: "Jump_Start",
  jumpIdle: "Jump_Idle",
  jumpLand: "Jump_Land",
  fall: "Climbing", // This is for falling from high sky
  // Currently support four additional animations
  action1: "Wave",
  action2: "Dance",
  action3: "Cheer",
  action4: "Attack(1h)", // This is special action which can be trigger while walking or running
};
const Scene = () => {
  return (
    <mesh>
      <OrbitControls />
      <SkyBox />
      <directionalLight
        intensity={0.7}
        castShadow
        shadow-bias={-0.0004}
        position={[-20, 20, 20]}
      >
        <perspectiveCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>
      <ambientLight intensity={0.2} />
      <Physics timeStep="vary">
        <KeyboardControls map={keyboardMap}>
          {/* <EcctrlAnimation
              characterURL={characterURL} // Must have property
              animationSet={animationSet} // Must have property
            >
             
            </EcctrlAnimation> */}

          <Ecctrl animated>
  
            <Model />
          </Ecctrl>
        </KeyboardControls>

        <RigidBody type="fixed" colliders="trimesh">
          <Gltf
            castShadow
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.5}
            src="fantasy_game_inn2-transformed.glb"
          />
        </RigidBody>
      </Physics>
    </mesh>
  );
};
export default Scene;

//TODO: - plane mesh, collider property.
// 1- environment yes
// 2 - model
// 3 - movements / fpv
// 4 - placing products
// 5 - add to cart -> product detail modal
// - add to czrt / wishist
// - checkout
// -
