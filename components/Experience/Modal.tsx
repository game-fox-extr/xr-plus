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

const CanvasContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: { md: "50%", lg: "50%" }, // Adjust width for responsiveness manually in your layout
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

  console.log({ gltf: gltf });
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
  // const images = [
  //   "https://cdn.shopify.com/s/files/1/0901/2222/3909/files/Open_jacket1.png?v=1729603533",
  //   "https://cdn.shopify.com/s/files/1/0901/2222/3909/files/Open_jacket2.png?v=1729603533",
  // ];

  // Sanitizing the html using dompurify
  const sanitizedHtml = DOMPurify.sanitize(props.data["body_html"]);

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

  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Card
        sx={{
          position: "fixed",
          top: { md: "1%", lg: "0.75%" },
          left: { md: "25%", lg: "25%" },
          display: "flex",
          flexDirection: "column",
          maxWidth: { xs: "80vw", md: "60vw", lg: "50vw", xl: "50vw" },
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
        }}
      >
        {/* Header Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
                  fontSize: { md: "1rem", lg: "1.5rem" }, // Adjust the size as needed
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
                defaultValue={1}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "5px",
                  padding: { md: "0 4px ", lg: "0 8px" },
                  width: { md: "100%", lg: "100%" },
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
                  maxHeight: { md: "200px", lg: "300px" },
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

// {
//   "product": {
//     "id": 9658662388005,
//     "title": "Leather Jacket with Front Zipper",
//     "body_html": "\u003Ch3 class=\"product-facts-title\"\u003EProduct details\u003C/h3\u003E\n\u003Cdiv class=\"a-fixed-left-grid product-facts-detail\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-inner\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-col a-col-left\"\u003E\n\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003E\u003Cstrong\u003EMaterial composition\u003C/strong\u003E                  \u003C/span\u003E\u003C/span\u003E\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003E100% Leather\u003C/span\u003E\u003C/span\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003Cdiv class=\"a-fixed-left-grid product-facts-detail\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-inner\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-col a-col-left\"\u003E\n\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003E\u003Cstrong\u003EStyle\u003C/strong\u003E                                               \u003C/span\u003E\u003C/span\u003E\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003EJacket\u003C/span\u003E\u003C/span\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003Cdiv class=\"a-fixed-left-grid product-facts-detail\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-inner\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-col a-col-left\"\u003E\n\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003E\u003Cstrong\u003EFit type\u003C/strong\u003E                                          \u003C/span\u003E\u003C/span\u003E\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003ERegular\u003C/span\u003E\u003C/span\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003Cdiv class=\"a-fixed-left-grid product-facts-detail\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-inner\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-col a-col-left\"\u003E\n\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003E\u003Cstrong\u003ELength\u003C/strong\u003E                                           \u003C/span\u003E\u003C/span\u003E\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003EStandard Length                        \u003C/span\u003E\u003C/span\u003E\n\u003C/div\u003E\n\u003Cdiv class=\"a-fixed-left-grid-col a-col-left\"\u003E\n\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003E\u003Cstrong\u003ENeck style\u003C/strong\u003E                                     \u003C/span\u003E\u003C/span\u003E\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003ECollared Neck\u003C/span\u003E\u003C/span\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003Cdiv class=\"a-fixed-left-grid product-facts-detail\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-inner\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-col a-col-left\"\u003E\n\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003E\u003Cstrong\u003EPattern\u003C/strong\u003E                                          \u003C/span\u003E\u003C/span\u003E\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003EPlain\u003C/span\u003E\u003C/span\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003Cdiv class=\"a-fixed-left-grid product-facts-detail\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-inner\"\u003E\n\u003Cdiv class=\"a-fixed-left-grid-col a-col-left\"\u003E\n\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003E\u003Cstrong\u003ECountry of Origin\u003C/strong\u003E                        \u003C/span\u003E\u003C/span\u003E\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003EIndia\u003C/span\u003E\u003C/span\u003E\n\u003C/div\u003E\n\u003Cdiv class=\"a-fixed-left-grid-col a-col-left\"\u003E\u003Cspan\u003E\u003Cspan class=\"a-color-base\"\u003E----------------------------------------------------------------------------------------------------\u003C/span\u003E\u003C/span\u003E\u003C/div\u003E\n\u003Cdiv class=\"a-fixed-left-grid-col a-col-left\"\u003E\n\u003Ch3 class=\"product-facts-title\"\u003EAbout this item\u003C/h3\u003E\n\u003Cp\u003E\u003Cstrong\u003E- Fabric:                                       \u003C/strong\u003E100% Pure Leather  \u003Cbr\u003E\u003Cstrong\u003E- Style:                                        \u003C/strong\u003E Biker Jacket  \u003Cbr\u003E\u003Cstrong\u003E- Pattern:\u003C/strong\u003E                                     Solid  \u003Cbr\u003E\u003Cstrong\u003E- Fit:\u003C/strong\u003E                                             Regular fit  \u003Cbr\u003E\u003Cstrong\u003E- Sleeve Length:\u003C/strong\u003E                         Long sleeves  \u003Cbr\u003E\u003Cstrong\u003E- Closure \u003C/strong\u003E:                                   Zip  \u003Cbr\u003E\u003Cstrong\u003E- Length:                                   \u003C/strong\u003E Regular  \u003Cbr\u003E\u003Cstrong\u003E- Pockets:                                   \u003C/strong\u003E3  \u003Cbr\u003E\u003Cstrong\u003E- Occasion:                               \u003C/strong\u003E Casual  \u003Cbr\u003E\u003Cstrong\u003E- Wash Care:                             \u003C/strong\u003EDry clean only  \u003Cbr\u003E\u003Cstrong\u003E- Size Guide: \u003C/strong\u003ERefer to size chart; e.g., for 39-40 inch chest, select size “Medium”  \u003C/p\u003E\n\u003C/div\u003E\n\u003C/div\u003E\n\u003C/div\u003E",
//     "vendor": "Lee Store",
//     "product_type": "Clothes",
//     "created_at": "2024-10-22T18:55:33+05:30",
//     "handle": "leather-jacket-with-front-zipper",
//     "updated_at": "2024-10-23T19:26:43+05:30",
//     "published_at": "2024-10-22T18:55:30+05:30",
//     "template_suffix": null,
//     "published_scope": "global",
//     "tags": "",
//     "status": "active",
//     "admin_graphql_api_id": "gid://shopify/Product/9658662388005",
//     "variants": [
//       {
//         "id": 49806209679653,
//         "product_id": 9658662388005,
//         "title": "brown / xl / leather",
//         "price": "3599.00",
//         "position": 1,
//         "inventory_policy": "deny",
//         "compare_at_price": null,
//         "option1": "brown",
//         "option2": "xl",
//         "option3": "leather",
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "taxable": true,
//         "barcode": "",
//         "fulfillment_service": "manual",
//         "grams": 0,
//         "inventory_management": "shopify",
//         "requires_shipping": true,
//         "sku": "",
//         "weight": 0,
//         "weight_unit": "kg",
//         "inventory_item_id": 51846107201829,
//         "inventory_quantity": 56,
//         "old_inventory_quantity": 56,
//         "admin_graphql_api_id": "gid://shopify/ProductVariant/49806209679653",
//         "image_id": null
//       },
//       {
//         "id": 49806209712421,
//         "product_id": 9658662388005,
//         "title": "brown / 2xl / leather",
//         "price": "3599.00",
//         "position": 2,
//         "inventory_policy": "deny",
//         "compare_at_price": null,
//         "option1": "brown",
//         "option2": "2xl",
//         "option3": "leather",
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "taxable": true,
//         "barcode": "",
//         "fulfillment_service": "manual",
//         "grams": 0,
//         "inventory_management": "shopify",
//         "requires_shipping": true,
//         "sku": "",
//         "weight": 0,
//         "weight_unit": "kg",
//         "inventory_item_id": 51846107234597,
//         "inventory_quantity": 67,
//         "old_inventory_quantity": 67,
//         "admin_graphql_api_id": "gid://shopify/ProductVariant/49806209712421",
//         "image_id": null
//       },
//       {
//         "id": 49806209745189,
//         "product_id": 9658662388005,
//         "title": "brown / 3xl / leather",
//         "price": "3599.00",
//         "position": 3,
//         "inventory_policy": "deny",
//         "compare_at_price": null,
//         "option1": "brown",
//         "option2": "3xl",
//         "option3": "leather",
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "taxable": true,
//         "barcode": "",
//         "fulfillment_service": "manual",
//         "grams": 0,
//         "inventory_management": "shopify",
//         "requires_shipping": true,
//         "sku": "",
//         "weight": 0,
//         "weight_unit": "kg",
//         "inventory_item_id": 51846107267365,
//         "inventory_quantity": 18,
//         "old_inventory_quantity": 18,
//         "admin_graphql_api_id": "gid://shopify/ProductVariant/49806209745189",
//         "image_id": null
//       },
//       {
//         "id": 49806209777957,
//         "product_id": 9658662388005,
//         "title": "black / xl / leather",
//         "price": "3599.00",
//         "position": 4,
//         "inventory_policy": "deny",
//         "compare_at_price": null,
//         "option1": "black",
//         "option2": "xl",
//         "option3": "leather",
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "taxable": true,
//         "barcode": "",
//         "fulfillment_service": "manual",
//         "grams": 0,
//         "inventory_management": "shopify",
//         "requires_shipping": true,
//         "sku": "",
//         "weight": 0,
//         "weight_unit": "kg",
//         "inventory_item_id": 51846107300133,
//         "inventory_quantity": 159,
//         "old_inventory_quantity": 159,
//         "admin_graphql_api_id": "gid://shopify/ProductVariant/49806209777957",
//         "image_id": null
//       },
//       {
//         "id": 49806209810725,
//         "product_id": 9658662388005,
//         "title": "black / 2xl / leather",
//         "price": "3599.00",
//         "position": 5,
//         "inventory_policy": "deny",
//         "compare_at_price": null,
//         "option1": "black",
//         "option2": "2xl",
//         "option3": "leather",
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "taxable": true,
//         "barcode": "",
//         "fulfillment_service": "manual",
//         "grams": 0,
//         "inventory_management": "shopify",
//         "requires_shipping": true,
//         "sku": "",
//         "weight": 0,
//         "weight_unit": "kg",
//         "inventory_item_id": 51846107332901,
//         "inventory_quantity": 126,
//         "old_inventory_quantity": 126,
//         "admin_graphql_api_id": "gid://shopify/ProductVariant/49806209810725",
//         "image_id": null
//       },
//       {
//         "id": 49806209843493,
//         "product_id": 9658662388005,
//         "title": "black / 3xl / leather",
//         "price": "3599.00",
//         "position": 6,
//         "inventory_policy": "deny",
//         "compare_at_price": null,
//         "option1": "black",
//         "option2": "3xl",
//         "option3": "leather",
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "taxable": true,
//         "barcode": "",
//         "fulfillment_service": "manual",
//         "grams": 0,
//         "inventory_management": "shopify",
//         "requires_shipping": true,
//         "sku": "",
//         "weight": 0,
//         "weight_unit": "kg",
//         "inventory_item_id": 51846107365669,
//         "inventory_quantity": 52,
//         "old_inventory_quantity": 52,
//         "admin_graphql_api_id": "gid://shopify/ProductVariant/49806209843493",
//         "image_id": null
//       },
//       {
//         "id": 49806209876261,
//         "product_id": 9658662388005,
//         "title": "tan / xl / leather",
//         "price": "3599.00",
//         "position": 7,
//         "inventory_policy": "deny",
//         "compare_at_price": null,
//         "option1": "tan",
//         "option2": "xl",
//         "option3": "leather",
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "taxable": true,
//         "barcode": "",
//         "fulfillment_service": "manual",
//         "grams": 0,
//         "inventory_management": "shopify",
//         "requires_shipping": true,
//         "sku": "",
//         "weight": 0,
//         "weight_unit": "kg",
//         "inventory_item_id": 51846107398437,
//         "inventory_quantity": 66,
//         "old_inventory_quantity": 66,
//         "admin_graphql_api_id": "gid://shopify/ProductVariant/49806209876261",
//         "image_id": null
//       },
//       {
//         "id": 49806209909029,
//         "product_id": 9658662388005,
//         "title": "tan / 2xl / leather",
//         "price": "3599.00",
//         "position": 8,
//         "inventory_policy": "deny",
//         "compare_at_price": null,
//         "option1": "tan",
//         "option2": "2xl",
//         "option3": "leather",
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "taxable": true,
//         "barcode": "",
//         "fulfillment_service": "manual",
//         "grams": 0,
//         "inventory_management": "shopify",
//         "requires_shipping": true,
//         "sku": "",
//         "weight": 0,
//         "weight_unit": "kg",
//         "inventory_item_id": 51846107431205,
//         "inventory_quantity": 54,
//         "old_inventory_quantity": 54,
//         "admin_graphql_api_id": "gid://shopify/ProductVariant/49806209909029",
//         "image_id": null
//       },
//       {
//         "id": 49806209941797,
//         "product_id": 9658662388005,
//         "title": "tan / 3xl / leather",
//         "price": "3599.00",
//         "position": 9,
//         "inventory_policy": "deny",
//         "compare_at_price": null,
//         "option1": "tan",
//         "option2": "3xl",
//         "option3": "leather",
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "taxable": true,
//         "barcode": "",
//         "fulfillment_service": "manual",
//         "grams": 0,
//         "inventory_management": "shopify",
//         "requires_shipping": true,
//         "sku": "",
//         "weight": 0,
//         "weight_unit": "kg",
//         "inventory_item_id": 51846107463973,
//         "inventory_quantity": 43,
//         "old_inventory_quantity": 43,
//         "admin_graphql_api_id": "gid://shopify/ProductVariant/49806209941797",
//         "image_id": null
//       }
//     ],
//     "options": [
//       {
//         "id": 12064588464421,
//         "product_id": 9658662388005,
//         "name": "Color",
//         "position": 1,
//         "values": [
//           "brown",
//           "black",
//           "tan"
//         ]
//       },
//       {
//         "id": 12064588497189,
//         "product_id": 9658662388005,
//         "name": "Size",
//         "position": 2,
//         "values": [
//           "xl",
//           "2xl",
//           "3xl"
//         ]
//       },
//       {
//         "id": 12064588529957,
//         "product_id": 9658662388005,
//         "name": "Fabric",
//         "position": 3,
//         "values": [
//           "leather"
//         ]
//       }
//     ],
//     "images": [
//       {
//         "id": 48346052591909,
//         "alt": null,
//         "position": 1,
//         "product_id": 9658662388005,
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "admin_graphql_api_id": "gid://shopify/ProductImage/48346052591909",
//         "width": 611,
//         "height": 408,
//         "src": "https://cdn.shopify.com/s/files/1/0901/2222/3909/files/Open_jacket1.png?v=1729603533",
//         "variant_ids": []
//       },
//       {
//         "id": 48346052624677,
//         "alt": null,
//         "position": 2,
//         "product_id": 9658662388005,
//         "created_at": "2024-10-22T18:55:33+05:30",
//         "updated_at": "2024-10-22T18:55:33+05:30",
//         "admin_graphql_api_id": "gid://shopify/ProductImage/48346052624677",
//         "width": 453,
//         "height": 470,
//         "src": "https://cdn.shopify.com/s/files/1/0901/2222/3909/files/Open_jacket2.png?v=1729603533",
//         "variant_ids": []
//       }
//     ],
//     "image": {
//       "id": 48346052591909,
//       "alt": null,
//       "position": 1,
//       "product_id": 9658662388005,
//       "created_at": "2024-10-22T18:55:33+05:30",
//       "updated_at": "2024-10-22T18:55:33+05:30",
//       "admin_graphql_api_id": "gid://shopify/ProductImage/48346052591909",
//       "width": 611,
//       "height": 408,
//       "src": "https://cdn.shopify.com/s/files/1/0901/2222/3909/files/Open_jacket1.png?v=1729603533",
//       "variant_ids": []
//     }
//   }
// }
