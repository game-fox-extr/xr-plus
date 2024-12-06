import { PivotControls, useGLTF } from "@react-three/drei";
import React from "react";

const DraggableAsset = ({
  position = [0, 0, 0],
  productId,
  modelPath,
  onClick,
}: {
  position: [x: number, y: number, z: number];
  modelPath: string;
  productId?: string;
  onClick?: (productId?: string) => void;
}) => {
  // Load your GLTF model using useGLTF hook
  const { scene } = useGLTF(modelPath);

  const handleClick = (event: any) => {
    console.log("Model clicked!");
    if (onClick) {
      onClick(productId);
    }
  };

  const handlePointerEnter = () => {
    console.log("Pointer entered!");
  };

  const handlePointerLeave = () => {
    console.log("Pointer left!");
  };

  return (
    <PivotControls anchor={[0, 0, 0]} scale={1}>
      <primitive
        object={scene}
        position={position}
        onClick={handleClick}
        onPointerDown={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
    </PivotControls>
  );
};

const Scene = () => {
  return (
    <>
      {/* Model 1 */}
      <DraggableAsset position={[4, -0.5, -24]} modelPath="/models/inter_elem1.glb" />

      {/* Model 2 */}
      <DraggableAsset position={[6, -0.5, -24]} modelPath="/models/inter_elem2.glb" />

      {/* Model 3 */}
      <DraggableAsset position={[8, -0.5, -24]} modelPath="/models/inter_elem.glb" />
    </>
  );
};

export default Scene;