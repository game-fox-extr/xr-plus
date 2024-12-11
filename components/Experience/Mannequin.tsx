import { PivotControls, useGLTF } from "@react-three/drei";

const DraggableMannequin = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0], // Default rotation in degrees
  scale = 1,
  productId,
  modelPath,
  onClick,
}: {
  onClick: (productId: string) => void;
  position: [x: number, y: number, z: number];
  productId?: any;
  rotation?: [x: number, y: number, z: number]; // Rotation in degrees
  scale?: number | [x: number, y: number, z: number];
  modelPath: string;
}) => {
  // Load your GLTF model using useGLTF hook
  const { scene } = useGLTF(modelPath);

  // Ensure scale is formatted correctly (either uniform or xyz scaling)
  const computedScale =
    typeof scale === "number" ? [scale, scale, scale] : scale;

  // Convert rotation from degrees to radians
  const computedRotation = rotation.map((deg) => (deg * Math.PI) / 180);

  return (
    <PivotControls
      anchor={[0, 0, 0]}
      scale={1}
      activeAxes={[false, false, false]}
    >
      <primitive
        object={scene}
        position={position}
        rotation={computedRotation} // Apply computed rotation
        scale={computedScale}
        onClick={(e: any) => onClick(productId!)}
      />
    </PivotControls>
  );
};

export default DraggableMannequin;
