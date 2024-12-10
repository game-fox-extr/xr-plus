import { FC, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// Interfaces
interface ProductOptions {
  color: string;
  size: string;
  fabric: string;
  price: number;
}

interface CartProduct {
  variantId: number;
  productId: number;
  name: string;
  imageUrl: string;
  productOptions: ProductOptions;
  quantity: number;
}

interface ModalProduct {
  productId: number;
  variants: { [key: number]: ProductOptions };
  name: string;
  vendor: string;
  imageUrl: string;
  cdnModelUrl: string;
  quantity: number;
}

// Conversion function
function convertModalProductToCartProduct(modalProduct: ModalProduct, variantId: number): CartProduct {
  return {
    variantId: variantId,
    productId: modalProduct.productId,
    name: modalProduct.name,
    imageUrl: modalProduct.imageUrl,
    productOptions: modalProduct.variants[variantId],
    quantity: modalProduct.quantity,
  };
}

// Props Interface
interface ProductCardsProps {
  products?: Map<number, CartProduct>; // Optional, handle accordingly
}

// Conversion function from array to props
function convertCartProductsToProps(products: Array<CartProduct>): ProductCardsProps {
  return {
    products: products.reduce((acc, product) => {
      acc.set(product.variantId, product);
      return acc;
    }, new Map<number, CartProduct>()),
  };
}

// Cart Component
const Cart: FC<ProductCardsProps> = ({ products }): JSX.Element => {
  // Initialize state with products prop or an empty Map
  const [state, setState] = useState<Map<number, CartProduct>>(
    products ? new Map(products) : new Map<number, CartProduct>()
  );

  const increaseQuantity = (variantId: number) => {
    setState((prevState) => {
      const newState = new Map(prevState);
      const oldProduct = newState.get(variantId);
      if (oldProduct) {
        const updatedProduct: CartProduct = { ...oldProduct, quantity: oldProduct.quantity + 1 };
        newState.set(variantId, updatedProduct);
      }
      return newState;
    });
  };

  const decreaseQuantity = (variantId: number) => {
    setState((prevState) => {
      const newState = new Map(prevState);
      const oldProduct = newState.get(variantId);
      if(oldProduct?.quantity == 0) return newState;
      if (oldProduct && oldProduct.quantity > 1) {
        const updatedProduct: CartProduct = { ...oldProduct, quantity: oldProduct.quantity - 1 };
        newState.set(variantId, updatedProduct);
      }
      return newState;
    });
  };

  const handleQuantityChange = (variantId: number, newQuantity: number) => {
    setState((prevState) => {
      const newState = new Map(prevState);
      const oldProduct = newState.get(variantId);
      if (oldProduct && newQuantity > 0) {
        const updatedProduct: CartProduct = { ...oldProduct, quantity: newQuantity };
        newState.set(variantId, updatedProduct);
      } else if (oldProduct && newQuantity < 0) {
        const updatedProduct: CartProduct = { ...oldProduct, quantity: 1 };
        newState.set(variantId, updatedProduct);
      }
      return newState;
    });
  };

  const handleDelete = (variantId: number) => {
    setState((prevState) => {
      const newState = new Map(prevState);
      newState.delete(variantId);
      return newState;
    });
  };

  return (
    <Box component="section" sx={{ minHeight: "100vh", backgroundColor: "#eee" }}>
      <Container sx={{ py: 5 }}>
        <Box display="flex" justifyContent="center" alignItems="flex-start" sx={{ minHeight: "100%" }}>
          <Box sx={{ width: { xs: "100%", md: "80%" } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h3" sx={{ fontWeight: "normal", mb: 0 }}>
                Shopping Cart
              </Typography>
              <Box>
                <Typography component="p" sx={{ mb: 0 }}>
                  <span style={{ color: "#6c757d" }}>Sort by: </span>
                  <Link href="#!" sx={{ color: "text.primary", textDecoration: "none" }}>
                    price <ArrowDropDownIcon sx={{ verticalAlign: "middle" }} />
                  </Link>
                </Typography>
              </Box>
            </Box>

            {[...state].map(([variantId, product]) => (
              <Card key={variantId} variant="outlined" sx={{ borderRadius: 3, mb: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ gap: 2 }}>
                    <Box sx={{ width: { xs: "100%", sm: "16.666%" } }}>
                      <CardMedia
                        component="img"
                        image={product.imageUrl}
                        alt={product.name}
                        sx={{ borderRadius: 3, width: "100%" }}
                      />
                    </Box>
                    <Box sx={{ width: { xs: "100%", sm: "25%" } }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2">
                        <span style={{ color: "#6c757d" }}>Size: </span>
                        {product.productOptions.size}{" "}
                        <span style={{ color: "#6c757d" }}>Color: </span>
                        {product.productOptions.color}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-around" sx={{ width: { xs: "100%", sm: "25%" } }}>
                      <IconButton
                        sx={{ p: 1 }}
                        onClick={() => decreaseQuantity(variantId)}
                        aria-label="decrease quantity"
                      >
                        <RemoveIcon />
                      </IconButton>

                      <TextField
                        type="number"
                        value={product.quantity}
                        size="small"
                        onChange={(e) => {
                          console.log(e.target.value);
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value)) {
                            handleQuantityChange(variantId, value);
                          }else if(e.target.value == ""){
                            handleQuantityChange(variantId, 0);
                          }
                        }}
                      />

                      <IconButton
                        sx={{ p: 1 }}
                        onClick={() => increaseQuantity(variantId)}
                        aria-label="increase quantity"
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ width: { xs: "100%", sm: "16.666%" }, mt: { xs: 2, sm: 0 } }}>
                      <Typography variant="h5" sx={{ mb: 0 }}>
                        ₹{(product.productOptions.price * product.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" sx={{ width: { xs: "100%", sm: "8.333%" } }}>
                      <IconButton
                        color="error"
                        aria-label="delete item"
                        onClick={() => handleDelete(variantId)}
                      >
                        <DeleteIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {state.size === 0 && (
              <Typography variant="h6" align="center" color="text.secondary">
                Your cart is empty.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// Exporting everything at the end
export {
  convertModalProductToCartProduct,
  convertCartProductsToProps,
  Cart,
};

export type {
  ProductOptions,
  CartProduct,
  ModalProduct,
};
