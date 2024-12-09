import { styled } from "@mui/material/styles";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import DOMPurify from "dompurify";
import {
  Box,
  Button,
  CardContent,
  IconButton,
  Typography,
  Card,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// const ModalBackground = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 999; /* Ensure it's above other content */
// `;

const CanvasContainer = styled(Box)(({ theme }) => ({
  color: 'darkslategray',
  [theme.breakpoints.up('xs')]: {
  width: "100%",
  },
  [theme.breakpoints.up('lg')]: {
  width: "50%",
  },
  position: "relative",
  overflow: "hidden",
  padding: "2px",
  objectFit: "cover",
  borderRadius: "10px",
}));

// const CanvasContainer = styled(Box)({
//   position: "absolute",
//   width: { xs: "100%", lg: "50%" },
//   borderRadius: "10px",
//   overflow: "hidden",
//   objectFit: "cover",
//   padding: "2px",
// });

// const ModalContent = styled.div`
//   background: rgb(0 0 0 / 15%); /* Semi-transparent white */
//   backdrop-filter: blur(10px); /* Blur effect for content */
//   border-radius: 10px;
//   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
//   max-width: 800px;
//   width: 90%;
//   padding: 20px;
//   z-index: 1000; /* Ensure content is above background */
//   text-align: center;
//   color: white;
//   display: flex;
//   flex-direction: column;
//   position: relative;
// `;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   background-color: transparent;
//   border: none;
//   color: white;
//   font-size: 24px;
//   cursor: pointer;
// `;

interface ModalProps {
  isOpen: boolean;
  onClose: any;
  data: any;
  modelUrl: string;
}

const Model = ({ modelUrl }: { modelUrl: string }) => {
  console.log("Function called");
  const gltf = useLoader(GLTFLoader, modelUrl, (loader) => {
    console.log(loader);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // Path to Draco decoder
    loader.setDRACOLoader(dracoLoader);
  });

  console.log({ gltf: gltf });
  return (
    <group position={[0, -3, 0]} scale={3}>
      <primitive object={gltf.scene} />
    </group>
  );
};

const Modal: React.FC<ModalProps> = (props) => {
  if (!props.isOpen) return null;

  const [view, setView] = useState("3dModel");
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "https://cdn.shopify.com/s/files/1/0901/2222/3909/files/Open_jacket1.png?v=1729603533",
    "https://cdn.shopify.com/s/files/1/0901/2222/3909/files/Open_jacket2.png?v=1729603533",
  ];

  // Sanitizing the html using dompurify
  const sanitizedHtml = DOMPurify.sanitize(props.data["body_html"]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % images.length);
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Card
        sx={{
          position: "fixed",
          top: { lg: "5%" },
          left: { lg: "25%" },
          display: "flex",
          flexDirection: "column",
          maxWidth: { xs: "80vw", md: "60vw", lg: "50vw", xl: "50vw" },
          gap: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent white
          backdropFilter: "blur(10px)", // Blur effect for glass morphism
          borderRadius: "10px",
          padding: 3,
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Subtle shadow
          border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border
          zIndex: 999,
          overflowY: { xs: "auto" }, // Enable vertical scrolling
          scrollbarWidth: { xs: "none" }, // Firefox - hide scrollbar
          "&::-webkit-scrollbar": {
            display: { xs: "none" }, // Chrome, Safari, Edge - hide scrollbar
          },
        }}
      >
        {/* Header Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="text"
              size="small"
              onClick={() => setView("photos")}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                borderRadius: "50px 50px 50px 50px", // Rounded right side
                padding: "6px 16px",
              }}
            >
              Photos
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => setView("3d")}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                borderRadius: "50px 50px 50px 50px", // Rounded right side
                padding: "6px 16px",
              }}
            >
              3D Model
            </Button>
          </Box>
          <IconButton
            size="small"
            sx={{
              marginLeft: "auto",
              zIndex: 1001,
              backgroundColor: "lightgrey",
              borderRadius: "50%", // Circular button
              width: "40px", // Ensure the button is square
              height: "40px",
            }}
          >
            <CloseIcon onClick={props.onClose} />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            margin: { lg: "auto" },
            boxShadow: "3",
            flexDirection: "row",
          }}
        >
          {/* Left Side: Photos or 3D Model */}
          <CanvasContainer>
            {view === "photos" ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  borderRadius: "10px",
                  height: "100%",
                }}
              >
                <img
                  src={images[currentIndex]}
                  alt={`Carousel ${currentIndex}`}
                  style={{
                    borderRadius: "10px",
                    width: "350px",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Carousel Navigation */}
                <IconButton
                  onClick={prevImage}
                  sx={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1002,
                  }}
                >
                  {"<"}
                </IconButton>
                <IconButton
                  onClick={nextImage}
                  sx={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1002,
                  }}
                >
                  {">"}
                </IconButton>
              </Box>
            ) : (
              <Canvas camera={{ position: [0, 0, 10] }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                  />
                  <Model modelUrl="https://cdn.shopify.com/3d/models/o/b5b1e778e0d8207a/open_jacket.glb" />
                  <OrbitControls enableZoom={false} enablePan={false} />
                  <Environment preset="warehouse" blur={2} />
                </Suspense>
              </Canvas>
            )}
          </CanvasContainer>

          {/* Right Side: Description */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <CardContent sx={{ zIndex: 1000 }}>
              <Typography
                sx={{
                  fontSize: "1.5rem", // Adjust the size as needed
                  color: "white", // Set the color to white
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Dragon Tee
              </Typography>
              {/* Quantity Picker */}

              <Select
                defaultValue={1}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "5px",
                  padding: "0 8px",
                  width: { xs: "100%", lg: "100%" },
                  zIndex: "1000",
                }}
              >
                {[1, 2, 3, 4, 5].map((quantity) => (
                  <MenuItem key={quantity} value={quantity}>
                    {quantity}
                  </MenuItem>
                ))}
              </Select>

              {/* Sizes Selector */}
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <Box sx={{ display: "flex", gap: 1, flexWrap: { xs: "wrap" } }}>
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <Button
                      key={size}
                      variant="outlined"
                      size="small"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        borderColor: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.4)",
                        },
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </Box>
              </Box>
              <br />
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "white",
                  fontSize: "1.5rem",
                }}
              >
                Description
              </Typography>
              <Box
                sx={{
                  backgroundColor: "rgba(0 0 0 / 15%)",
                  borderRadius: 1,
                  padding: 1,
                  marginTop: 1,
                  backdropFilter: "blur(10px)",
                  maxHeight: "300px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                  overflowY: "auto", // Enable vertical scrolling
                  scrollbarWidth: "none", // Firefox - hide scrollbar
                  "&::-webkit-scrollbar": {
                    display: "none", // Chrome, Safari, Edge - hide scrollbar
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "white",
                  }}
                >
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using 'Content
                  here, content here', making it look like readable English.
                  Many desktop publishing packages and web page editors now use
                  Lorem Ipsum as their default model text, and a search for
                  'lorem ipsum' will uncover many web sites still in their
                  infancy. Various versions have evolved over the years,
                  sometimes by accident, sometimes on purpose (injected humour
                  and the like). It is a long established fact that a reader
                  will be distracted by the readable content of a page when
                  looking at its layout. The point of using Lorem Ipsum is that
                  it has a more-or-less normal distribution of letters, as
                  opposed to using 'Content here, content here', making it look
                  like readable English. Many desktop publishing packages and
                  web page editors now use Lorem Ipsum as their default model
                  text, and a search for 'lorem ipsum' will uncover many web
                  sites still in their infancy. Various versions have evolved
                  over the years, sometimes by accident, sometimes on purpose
                  (injected humour and the like).
                </Typography>
              </Box>
            </CardContent>
          </Box>
        </Box>

        {/* Footer Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: 2,
            paddingTop: 2,
          }}
        >
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#ffffff19",
              color: "white",
              borderRadius: "50px 50px 50px 50px", // Rounded right side
              padding: "6px 16px",
              "&:hover": {
                backgroundColor: "#ffffff09",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            ADD TO CART
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "rgba(28, 28, 28, 0.404)",
              color: "white",
              borderRadius: "50px 50px 50px 50px", // Rounded right side
              padding: "6px 16px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.45)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            CHECKOUT
          </Button>
        </Box>
      </Card>
    </div>
  );
};

export default Modal;

// <ModalBackground>
//   <ModalContent>
//     <CloseButton onClick={props.onClose}>
//       &times; {/* Unicode character for 'X' */}
//     </CloseButton>
//     <div
//       style={{ display: "flex", justifyContent: "center", padding: "10px" }}
//     >
//       <div style={{ padding: "5px" }}>Photos</div>
//       <div style={{ padding: "5px" }}>3D Model</div>
//     </div>
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "row-reverse",
//         justifyContent: "space-around",
//       }}
//     >
//       <div
//         style={{
//           background: "rgba(255, 255, 255, .2)",
//           backdropFilter: "blur(10px)",
//           padding: "20px",
//           boxShadow: "0 0 10px #0000004d",
//           width: "50%",
//         }}
//       >
//         <div
//           style={{
//             background: "rgba(0, 0, 0, 0.5)" /* Semi-transparent black */,
//             backdropFilter: "blur(10px)" /* Blur effect */,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             padding: "5px",
//           }}
//         >
//           <h1>{props.data["title"]}</h1>
//           <div style={{ display: "flex" }}>
//             <span>Price :</span> <div>{props.data.variants[0].price}</div>
//           </div>
//         </div>
//         <h1>Description</h1>
//         <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-evenly",
//             alignItems: "center",
//             width: "100%",
//             padding: "15px",
//           }}
//         >
//           <button>Add to Cart</button>
//           <button>Checkout</button>
//         </div>
//       </div>

//       <CanvasContainer>
//         <Canvas>
//           <Suspense fallback={null}>
//             <ambientLight intensity={0.5} />
//             <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
//             <Model modelUrl={props.modelUrl} />
//             <OrbitControls enableZoom={false} />
//             <Environment preset="warehouse" blur={2} />
//           </Suspense>
//         </Canvas>
//       </CanvasContainer>
//     </div>
//   </ModalContent>
// </ModalBackground>

// my own code

{
  /* <div
      style={{
        position: "fixed",
        top: "15%",
        left: "25%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        maxWidth: "50vw",
        gap: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        zIndex: 999,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 1,
        }}
      >
        <Button
          variant="text"
          size="small"
          sx={{ marginRight: "10px" }}
          onClick={() => setView("photos")}
        >
          Photos
        </Button>
        <Button
          variant="text"
          size="small"
          sx={{ marginRight: "10px" }}
          onClick={() => setView("3dModel")}
        >
          3D Model
        </Button>
        <div style={{ display: "flex", flexGrow: 1 }}>
          <IconButton size="small" sx={{ marginLeft: "auto", zIndex: 1000 }}>
            <CloseIcon onClick={props.onClose} />
          </IconButton>
        </div>
      </Box>
      <div
        style={{
          display: "flex",
          margin: "auto",
          boxShadow: "3",
          flexDirection: "row",
        }}
      >
        {view === "3dModel" && (
          <CanvasContainer>
            <Canvas camera={{ position: [0, 0, 10] }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <Model modelUrl="https://cdn.shopify.com/3d/models/o/b5b1e778e0d8207a/open_jacket.glb" />
                <OrbitControls enableZoom={false} />
                <Environment preset="warehouse" blur={2} />
              </Suspense>
            </Canvas>
          </CanvasContainer>
        )}

        {view == "photos" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              height: "300px",
              backgroundColor: "#f0f0f0",
              borderRadius: "10px",
            }}
          >
            <img
              src={images[currentIndex]}
              alt={`Carousel ${currentIndex}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: "10px",
              }}
            />
            {/* Carousel Navigation Buttons */
}
//     <IconButton
//       onClick={prevImage}
//       sx={{
//         position: "absolute",
//         left: "10px",
//         top: "50%",
//         transform: "translateY(-50%)",
//         zIndex: 1,
//       }}
//     >
//       {"<"}
//     </IconButton>
//     <IconButton
//       onClick={nextImage}
//       sx={{
//         position: "absolute",
//         right: "10px",
//         top: "50%",
//         transform: "translateY(-50%)",
//         zIndex: 1,
//       }}
//     >
//       {">"}
//     </IconButton>
//   </Box>
// )}

//   {/* Right Side - Content */}
//   <Box
//     sx={{
//       display: "flex",
//       flexDirection: "column",
//       flex: 1,
//       padding: 2,
//     }}
//   >
//     <CardContent sx={{ zIndex: 1000 }}>
//       <Typography variant="overline" color="text.secondary">
//         Dragon Tee
//       </Typography>
//       {/* Description with Light Grey Background */}
//       <Box
//         sx={{
//           borderRadius: 1,
//           padding: 1,
//           marginTop: 1,
//           backgroundColor:
//             "rgba(0 0 0 / 15%)" /* Semi-transparent white */,
//           backdropFilter: "blur(10px)" /* Blur effect for content */,
//           boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
//         }}
//       >
//         <Typography variant="body2" color="text.secondary">
//           Our signature piece, The Dragon, ignites with fiery energy,
//           draped in a crimson pool with dynamic features that create a
//           mysterious vortex in the wake of the beast. Product Description
//           - Oversized drop shoulder t-shirt. Please check the size chart
//           image to find your ideal size.
//         </Typography>
//       </Box>
//     </CardContent>
//   </Box>
// </div>
// <Box
//   sx={{
//     display: "flex",
//     justifyContent: "center",
//     gap: "10px",
//     padding: 2,
//     paddingTop: 2,
//   }}
// >
//   <Button variant="outlined" size="small">
//     Add to List
//   </Button>
//   <Button variant="contained" size="small">
//     Explore
//   </Button>
// </Box>
// </div> */}
