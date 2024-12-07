import { PivotControls, useGLTF } from "@react-three/drei";
import React from "react";

const DraggableMannequin = ({
  position = [0, 0, 0],
  scale = 1,
  productId,
  modelPath,
  onClick,
}: {
  position: [x: number, y: number, z: number];
  scale?: number | [x: number, y: number, z: number];
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

  // Ensure scale is formatted correctly (either uniform or xyz scaling)
  const computedScale =
    typeof scale === "number" ? [scale, scale, scale] : scale;

  return (
    <PivotControls anchor={[0, 0, 0]} scale={1} activeAxes={[false,false,false]}>
      <primitive
        object={scene}
        position={position}
        scale={computedScale}
        onClick={handleClick}
        onPointerDown={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
    </PivotControls>
  );
};

export default DraggableMannequin;
