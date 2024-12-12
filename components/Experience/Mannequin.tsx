import { PivotControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { useSceneStabilityStore } from "../../store/useSceneStabilityStore";

const DraggableMannequin = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0], // Default rotation in degrees
  scale = 1,
  productId,
  modelPath,
  onClick,
  model,
}: {
  model: GLTF;
  onClick: (productId: string) => void;
  position: [x: number, y: number, z: number];
  productId?: any;
  rotation?: [x: number, y: number, z: number]; // Rotation in degrees
  scale?: number | [x: number, y: number, z: number];
  modelPath?: string;
}) => {
  const computedScale =
    typeof scale === "number" ? [scale, scale, scale] : scale;

  const computedRotation = rotation.map((deg) => (deg * Math.PI) / 180);

  const { sceneKey, playerPosition } = useSceneStabilityStore();
  const physicsProps = useMemo(
    () => ({
      timeStep: "vary" as const,
      interpolate: true,
    }),
    []
  );

  return (
    <RigidBody type="fixed" >
      <PivotControls
        anchor={[0, 0, 0]}
        scale={1}
        activeAxes={[false, false, false]}
      >
        <primitive
          object={model.scene}
          position={position}
          rotation={computedRotation} // Apply computed rotation
          scale={computedScale}
          onClick={(e: any) => onClick(productId!)}
          castShadow  
          receiveShadow  
        />
      </PivotControls>
    </RigidBody>
  );
};

export default DraggableMannequin;
