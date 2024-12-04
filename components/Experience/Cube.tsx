import { PivotControls } from "@react-three/drei";
import React, { useState } from "react";

const DraggableCube = ({
  position = [0, 0, 0],
  productId,
  onClick,
  // isPointerLocked,
}: {
  position: [x: number, y: number, z: number];
  // isPointerLocked: boolean;
  productId?: string;
  onClick?: (productId?: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (event: any) => {
    // Only handle click if not pointer locked or explicitly allowed
    // if (!isPointerLocked) {
    //   event.stopPropagation();

      if (onClick) {
        onClick(productId);
      }
    // }
  };

  const handlePointerEnter = () => {
    // Only change hover state if not pointer locked
    // if (!isPointerLocked) {
    //   setIsHovered(true);
    // }
  };

  const handlePointerLeave = () => {
    // Only change hover state if not pointer locked
    // if (!isPointerLocked) {
    //   setIsHovered(false);
    // }
  };

  return (
    <PivotControls anchor={[0, 0, 0]} scale={1}>
      <mesh
        position={position}
        onClick={handleClick}
        onPointerDown={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          // color={isHovered && !isPointerLocked ? "red" : "orange"} 
        />
      </mesh>
    </PivotControls>
  );
};

export default DraggableCube;
