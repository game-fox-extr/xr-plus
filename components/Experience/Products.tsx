import { useLoader } from "@react-three/fiber";
import React, { Suspense } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const LazyMannequin = React.lazy(() => import("./Mannequin"));

// Define types for the mannequin data
interface MannequinData {
  id: number;
  position: [number, number, number];
  modelPath: any;
  scale: number;
}

interface ProductsProps {
  onCubeClick: (productId: number) => void;
}

const mannequinData: MannequinData[] = [
  {
    id: 9658662388005,
    position: [-2, -10.8, -24],
    modelPath: "/models/finalastro.glb",
    scale: 1.2,
  },
  {
    id: 9658662420773,
    position: [0, -10.8, -24],
    modelPath: "/models/men.glb",
    scale: 1,
  },
  {
    id: 9658662322469,
    position: [2, -10.8, -24],
    modelPath: "/models/inter_elem1.glb",
    scale: 1.2,
  },
  {id : 9658662060325 ,position: [4, -10.8, -24], modelPath: "/models/inter_elem2.glb", scale: 1.2 },
  {id : 9658662060325 ,position: [6, -10.8, -24], modelPath: "/models/inter_elem.glb", scale: 1.2 },
  {id : 9658662060325 ,position: [8, -10.8, -24], modelPath: "/models/women.glb", scale: 0.35 },
  {id : 9658662060325 ,position: [45.76, -11.05, 40.64], modelPath: "/models/final_girl.glb", scale: 0.25 },
  {id : 9658662060325 ,position: [-21.19, -10, 7.86], modelPath: "/models/finalblack_suit.glb", scale: 0.3 },
  {id : 9658662060325 ,position: [-17.57, -9.8, 33.33], modelPath: "/models/final_women_gym.glb", scale: 0.22 },
  {id : 9658662060325 ,position: [23.78, -10.8, 38.54], modelPath: "/models/final_sports.glb", scale: 0.35 },
  {id : 9658662060325 ,position: [0.44, -10.8, 20.13], modelPath: "/models/final_women_top.glb", scale: 0.25 },
  {id : 9658662060325 ,position: [9.99, -10.8, 8.13], modelPath: "/models/final_hoodie.glb", scale: 0.36 },
  {id : 9658662060325 ,position: [23.47, -10.8, 5.4], modelPath: "/models/final_studio_men.glb", scale: 0.25 },
];
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/');
gltfLoader.setDRACOLoader(dracoLoader);

const Products: React.FC<ProductsProps> = ({ onCubeClick }) => {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      {mannequinData.map((data, index) => (
        <ModelWrapper
          key={index}
          modelPath={data.modelPath}
          position={data.position}
          scale={data.scale}
          onClick={() => onCubeClick(data.id)}
        />
      ))}
    </Suspense>
  );
};

const ModelWrapper: React.FC<{
  modelPath: string;
  position: [number, number, number];
  scale: number;
  onClick: () => void;
}> = ({ modelPath, position, scale, onClick }) => {
  const gltf = useLoader(GLTFLoader, modelPath, (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });

  return (
    <LazyMannequin
      position={position}
      modelPath={modelPath}
      onClick={onClick}
      scale={scale}
      model={gltf}
    />
  );
};

const LoadingIndicator: React.FC = () => {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="lightblue" />
      </mesh>
    </group>
  );
};


export default Products;
