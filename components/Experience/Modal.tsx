import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Ensure it's above other content */
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 50%;
  height: 400px; /* Adjust the height as needed */
  border-radius: 10px;
  overflow: hidden;
`;

const ModalContent = styled.div`
  background: rgb(0 0 0 / 15%); /* Semi-transparent white */
  backdrop-filter: blur(10px); /* Blur effect for content */
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  width: 90%;
  padding: 20px;
  z-index: 1000; /* Ensure content is above background */
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const Model = () => {
  const gltf = useLoader(
    GLTFLoader,
    "models/asian_female_animated.glb",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // Path to Draco decoder
      loader.setDRACOLoader(dracoLoader);
    }
  );
  return (
    <group position={[0, -2, 0]} scale={3}>
      <primitive object={gltf.scene} />
    </group>
  );
};

const Modal = ({ isOpen, onClose, data }: any) => {
  if (!isOpen) return null;

  return (
    <ModalBackground>
      <ModalContent>
        <CloseButton onClick={onClose}>
          &times; {/* Unicode character for 'X' */}
        </CloseButton>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "10px" }}
        >
          <div style={{ padding: "5px" }}>tab1</div>
          <div style={{ padding: "5px" }}>tab2</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, .2)",
              backdropFilter: "blur(10px)",
              padding: "20px",
              boxShadow: "0 0 10px #0000004d",
              width: "50%",
            }}
          >
            <div
              style={{
                background: "rgba(0, 0, 0, 0.5)" /* Semi-transparent black */,
                backdropFilter: "blur(10px)" /* Blur effect */,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "5px",
              }}
            >
              <h1>Five Star Chocolate</h1>
              <div style={{ display: "flex" }}>
                <span>Quantity :</span> <div>2</div>
              </div>
            </div>
            <h1>Description</h1>
            <p>
              This is a Cadbury 5 Star chocolate bar, featuring its classic
              golden-yellow packaging with bold red and white lettering. The
              wrapper highlights the "New Softer Bar" feature, emphasizing an
              improved texture for an even more indulgent experience. The
              product image showcases the chocolate's signature combination of
              caramel and nougat coated in rich, creamy Cadbury milk chocolate,
              promising a delightful blend of flavors and softness in every
              bite. Perfect for those seeking a sweet, satisfying treat.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
                padding : '15px'
              }}
            >
              <button>Add to Cart</button>
              <button>Checkout</button>
            </div>
          </div>

          <CanvasContainer>
            <Canvas>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <Model />
                <OrbitControls enableZoom={false} />
                <Environment preset="sunset" />
              </Suspense>
            </Canvas>
          </CanvasContainer>
        </div>
      </ModalContent>
    </ModalBackground>
  );
};

export default Modal;
