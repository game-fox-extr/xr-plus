import React from "react";
const LazyMannequin = React.lazy(() => import("./Mannequin"));

// Define types for the mannequin data
interface MannequinData {
  position: [number, number, number];
  modelPath: string;
  scale: number;
}

interface ProductsProps {
  onCubeClick: () => void;
}

const mannequinData: MannequinData[] = [
  { position: [-2, -10.8, -24], modelPath: "/models/finalastro.glb", scale: 1.2 },
  { position: [0, -10.8, -24], modelPath: "/models/men.glb", scale: 1 },
  { position: [2, -10.8, -24], modelPath: "/models/inter_elem1.glb", scale: 1.2 },
  { position: [4, -10.8, -24], modelPath: "/models/inter_elem2.glb", scale: 1.2 },
  { position: [6, -10.8, -24], modelPath: "/models/inter_elem.glb", scale: 1.2 },
  { position: [8, -10.8, -24], modelPath: "/models/women.glb", scale: 0.35 },
  { position: [10, -10.8, -24], modelPath: "/models/final_girl.glb", scale: 0.25 },
  { position: [12, -10.8, -24], modelPath: "/models/finalblack_suit.glb", scale: 0.3 },
  { position: [14, -10.8, -24], modelPath: "/models/final_women_gym.glb", scale: 0.22 },
  { position: [16, -10.8, -24], modelPath: "/models/final_sports.glb", scale: 0.35 },
  { position: [18, -10.8, -24], modelPath: "/models/final_women_top.glb", scale: 0.25 },
  { position: [20, -10.8, -24], modelPath: "/models/final_hoodie.glb", scale: 0.36 },
  { position: [22, -10.8, -24], modelPath: "/models/final_studio_men.glb", scale: 0.25 },
];

const Products: React.FC<ProductsProps> = ({ onCubeClick }) => {
  return (
    <>
      {mannequinData.map((data, index) => (
        <LazyMannequin
          key={index}
          position={data.position}
          modelPath={data.modelPath}
          onClick={onCubeClick}
          scale={data.scale}
        />
      ))}
    </>
  );
};

export default Products;
