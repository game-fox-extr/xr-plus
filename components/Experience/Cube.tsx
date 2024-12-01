import { PivotControls } from '@react-three/drei';
import React from 'react'

const DraggableCube = ({
    position = [0, 0, 0],
    productId,
    onClick,
  }: {
    position: [x: number, y: number, z: number];
    productId?: string;
    onClick?: (productId?: string) => void;
  }) => {
    const handleClick = (event: any) => {
      // Stop the event from propagating to parent objects
      // event.stopPropagation();
      
      // Call the onClick prop if provided
      if (onClick) {
        onClick(productId);
      }
    };
  
    return (
      <PivotControls anchor={[0, 0, 0]} scale={1}>
        <mesh
          position={position}
          onClick={handleClick}
          onPointerDown={handleClick}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </PivotControls>
    );
  };

export default DraggableCube
