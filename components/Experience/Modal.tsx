import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense, useEffect, useState } from "react";
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
import { useCart } from "@shopify/hydrogen-react";

const CanvasContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: "100%", sm: "45%", md: "50%", lg: "50%", xl: "50%" }, // Adjust width for responsiveness manually in your layout
        borderRadius: "10px",
        overflow: "hidden",
        objectFit: "cover",
        padding: "2px",
      }}
    >
      {children}
    </Box>
  );
};

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

  return (
    <group position={[0, -3, 0]} scale={3}>
      <primitive object={gltf.scene} />
    </group>
  );
};

const Modal: React.FC<ModalProps> = (props) => {
  if (!props.isOpen) return null;

  const sizes: string[] = [];
  const images: string[] = [];

  const [view, setView] = useState("3dModel");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const sanitizedHtml = DOMPurify.sanitize(props.data["body_html"]);

  const { linesAdd, checkoutUrl } = useCart();

  useEffect(() => {
    console.log("Cart Lines:", linesAdd); // Updated cart lines
    console.log("Checkout URL:", checkoutUrl); // Updated checkout URL
  }, [linesAdd, checkoutUrl]);

  props.data.options.forEach((option: any) => {
    if (option.name.toLowerCase() === "size") {
      sizes.push(...option.values.map((value: string) => value.toUpperCase()));
    }
  });

  props.data.images.forEach((image: any) => {
    images.push(image.src);
  });

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setQuantity(event.target.value as number);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const selectedVariant = props.data.variants.find((variant: any) => {
      return variant.option2.toUpperCase() === selectedSize;
    });

    if (!selectedVariant) {
      alert("Selected size variant not found.");
      return;
    }

    // Add the selected variant to the cart
    try {
      const result = await linesAdd([
        {
          merchandiseId: selectedVariant.admin_graphql_api_id,
          quantity,
        },
      ]);
      console.log(result, checkoutUrl);
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("Checkout session not initialized. Please try again.");
    }
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
          top: { xs: "5%", sm: "10%", md: "5%", lg: "15%", xl: "7%" },
          left: { xs: "10%", sm: "15%", md: "25%", lg: "25%", xl: "25%" },
          display: "flex",
          flexDirection: "column",
          maxWidth: {
            xs: "80vw",
            sm: "70%",
            md: "60vw",
            lg: "50vw",
            xl: "50vw",
          },
          gap: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent white
          backdropFilter: "blur(10px)", // Blur effect for glass morphism
          borderRadius: "10px",
          padding: 2,
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Subtle shadow
          border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border
          zIndex: 999,
          overflowY: { xs: "auto" }, // Enable vertical scrolling
          scrollbarWidth: { xs: "none" }, // Firefox - hide scrollbar
          "&::-webkit-scrollbar": {
            display: { xs: "none" }, // Chrome, Safari, Edge - hide scrollbar
          },
          maxHeight: { xs: "90vh", md: "none" },
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
              flexGrow: 1,
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
                fontFamily: "'Poppins', sans-serif",
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
                fontFamily: "'Poppins', sans-serif",
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
            flexDirection: {
              xs: "column",
              sm: "row",
              md: "row",
              lg: "row",
              xl: "row",
            },
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
                  <Model modelUrl={props.modelUrl} />
                  <OrbitControls enableZoom={false} />
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
                  fontSize: { md: "1rem", lg: "1.5rem", xl: "1.5rem" }, // Adjust the size as needed
                  color: "white", // Set the color to white
                  fontFamily: "'Poppins', sans-serif",
                  paddingBottom: 1,
                }}
              >
                {props.data.title}
              </Typography>
              {/* Quantity Picker */}

              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "white",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Quantity:
              </Typography>

              <Select
                value={quantity}
                onChange={handleQuantityChange}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "5px",
                  padding: { md: "0 4px ", lg: "0 8px" },
                  width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
                  zIndex: "1000",
                }}
              >
                {[1, 2, 3, 4, 5].map((quantity) => (
                  <MenuItem key={quantity} value={quantity}>
                    {quantity}
                  </MenuItem>
                ))}
              </Select>
              <Typography
                sx={{
                  fontSize: { md: "1rem", lg: "1.5rem" },
                  color: "white",
                  fontFamily: "'Poppins', sans-serif",
                  paddingTop: 1,
                }}
              >
                ₹ {props.data.variants[0].price}
              </Typography>

              {/* Sizes Selector */}
              <Box
                sx={{ display: "flex", alignItems: "center", paddingTop: 1 }}
              >
                <Box sx={{ display: "flex", gap: 1, flexWrap: { xs: "wrap" } }}>
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant="outlined"
                      size="small"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        backgroundColor:
                          selectedSize === size
                            ? "black"
                            : "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        borderColor: "white",
                      }}
                      onClick={() => handleSizeClick(size)}
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
                  fontSize: {
                    xs: "1.5rem",
                    sm: "1.5rem",
                    md: "1rem",
                    lg: "1.5rem",
                    xl: "1.5rem",
                  },
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
                  maxHeight: {
                    xs: "225px",
                    sm: "210px",
                    md: "225px",
                    lg: "250px",
                    xl: "225px",
                  },
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
                  <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
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
              fontFamily: "'Poppins', sans-serif",
            }}
            onClick={handleAddToCart}
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
              fontFamily: "'Poppins', sans-serif",
            }}
            onClick={handleCheckout}
          >
            CHECKOUT
          </Button>
        </Box>
      </Card>
    </div>
  );
};

export default Modal;
