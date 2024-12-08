import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

const Skybox = () => {
  const { scene } = useThree();
  // Use useMemo to cache the texture
  const texture = useMemo(() => {
    const loader = new THREE.CubeTextureLoader();
    return loader.load([
      "/textures/skybox/px.webp",
      "/textures/skybox/nx.webp",
      "/textures/skybox/py.webp",
      "/textures/skybox/ny.webp",
      "/textures/skybox/pz.webp",
      "/textures/skybox/nz.webp",
    ]);
  }, []);

  // Set the scene background to the memoized texture
  scene.background = texture;
  return null;
};

export default Skybox;