import { FC } from "react";
import { Box, Button, Card, Typography } from "@mui/material";

interface CartProps {
  isOpen: boolean,
  onClose: () => void
}

const Cart: FC<CartProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <Card
        sx={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", // Center the Cart
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", // Flex display
          width: { xs: "80vw", md: "60vw", lg: "50vw", xl: "50vw" }, height: { xs: "90vh", lg: "90vh", xl: "90vh" }, // Size
          backgroundColor: "rgba(255, 255, 255, 0.33)", backdropFilter: "blur(10px)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Background Effects
          borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.2)", // Border
          overflow: "none"
        }}
      >
        <Typography
          sx={{
            minHeight: "15%",
            fontSize: 36, fontFamily: "'Poppins', sans-serif", fontWeight: "bolder",
            color: "rgba(255, 255, 255, 1)",
            display: "flex", alignItems: "center"
          }}
        >
          Your Cart
        </Typography>

        <Box
          sx={{
            width: { xs: "90%", sm: "90%", md: "85%", lg: "85%", xl: "80%" }, height: "70%",
            padding: "2.5%", gap: "2.5%",
            display: "flex", flexDirection: "column", alignItems: "center",
            borderRadius: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.08)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)", 
            overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": { display: "none" }
          }}
        >
          <Box
            sx={{
              width: "100%", height: "25%",
              display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",
              borderRadius: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.26)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", 
            }}
          >
            <img
              src="images/asian_female_head.png" 
              style={{
                height: "80%", aspectRatio : "1 / 1",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%"
              }}
            />
            <Typography
              sx={{
                width: "25%",
                fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                color: "rgba(255, 255, 255, 0.83)",
                textAlign: "Center",
                overflow: "hidden",
                
              }}
            >
              Jacket White Green
            </Typography>
            <Typography
              sx={{
                width: "10%",
                fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                color: "rgba(255, 255, 255, 0.83)",
                textAlign: "Center",
                overflow: "hidden",
                
              }}
            >
              XXL
            </Typography>
            <Box
              sx={{
                minWidth: "70px", width: "15%", height: "24px",
                display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"
              }}
            >
              <Button
                sx={{
                  minWidth: "20px", width: "20px", height: "20px",
                  padding: 1,
                  fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.74)", backgroundColor: "rgba(149, 149, 149, 0.21)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(149, 149, 149, 0.53)",
                    transitionDuration: "0s"
                  }
                }}
              >
                -
              </Button>
              <Typography>
                2
              </Typography>
              <Button
                sx={{
                  minWidth: "20px", width: "20px", height: "20px",
                  padding: 1,
                  fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.74)", backgroundColor: "rgba(149, 149, 149, 0.21)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(149, 149, 149, 0.53)",
                    transitionDuration: "0s"
                  }
                }}
              >
                +
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%", height: "25%",
              display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",
              borderRadius: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.26)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", 
            }}
          >
            <img
              src="images/asian_female_head.png" 
              style={{
                height: "80%", aspectRatio : "1 / 1",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%"
              }}
            />
            <Typography
              sx={{
                width: "25%",
                fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                color: "rgba(255, 255, 255, 0.83)",
                textAlign: "Center",
                overflow: "hidden",
                
              }}
            >
              Jacket White Green
            </Typography>
            <Typography
              sx={{
                width: "10%",
                fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                color: "rgba(255, 255, 255, 0.83)",
                textAlign: "Center",
                overflow: "hidden",
                
              }}
            >
              XXL
            </Typography>
            <Box
              sx={{
                minWidth: "70px", width: "15%", height: "24px",
                display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"
              }}
            >
              <Button
                sx={{
                  minWidth: "20px", width: "20px", height: "20px",
                  padding: 1,
                  fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.74)", backgroundColor: "rgba(149, 149, 149, 0.21)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(149, 149, 149, 0.53)",
                    transitionDuration: "0s"
                  }
                }}
              >
                -
              </Button>
              <Typography>
                2
              </Typography>
              <Button
                sx={{
                  minWidth: "20px", width: "20px", height: "20px",
                  padding: 1,
                  fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.74)", backgroundColor: "rgba(149, 149, 149, 0.21)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(149, 149, 149, 0.53)",
                    transitionDuration: "0s"
                  }
                }}
              >
                +
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%", height: "25%",
              display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",
              borderRadius: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.26)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", 
            }}
          >
            <img
              src="images/asian_female_head.png" 
              style={{
                height: "80%", aspectRatio : "1 / 1",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%"
              }}
            />
            <Typography
              sx={{
                width: "25%",
                fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                color: "rgba(255, 255, 255, 0.83)",
                textAlign: "Center",
                overflow: "hidden",
                
              }}
            >
              Jacket White Green
            </Typography>
            <Typography
              sx={{
                width: "10%",
                fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                color: "rgba(255, 255, 255, 0.83)",
                textAlign: "Center",
                overflow: "hidden",
                
              }}
            >
              XXL
            </Typography>
            <Box
              sx={{
                minWidth: "70px", width: "15%", height: "24px",
                display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"
              }}
            >
              <Button
                sx={{
                  minWidth: "20px", width: "20px", height: "20px",
                  padding: 1,
                  fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.74)", backgroundColor: "rgba(149, 149, 149, 0.21)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(149, 149, 149, 0.53)",
                    transitionDuration: "0s"
                  }
                }}
              >
                -
              </Button>
              <Typography>
                2
              </Typography>
              <Button
                sx={{
                  minWidth: "20px", width: "20px", height: "20px",
                  padding: 1,
                  fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.74)", backgroundColor: "rgba(149, 149, 149, 0.21)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(149, 149, 149, 0.53)",
                    transitionDuration: "0s"
                  }
                }}
              >
                +
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%", height: "25%",
              display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",
              borderRadius: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.26)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", 
            }}
          >
            <img
              src="images/asian_female_head.png" 
              style={{
                height: "80%", aspectRatio : "1 / 1",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%"
              }}
            />
            <Typography
              sx={{
                width: "25%",
                fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                color: "rgba(255, 255, 255, 0.83)",
                textAlign: "Center",
                overflow: "hidden",
                
              }}
            >
              Jacket White Green
            </Typography>
            <Typography
              sx={{
                width: "10%",
                fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                color: "rgba(255, 255, 255, 0.83)",
                textAlign: "Center",
                overflow: "hidden",
                
              }}
            >
              XXL
            </Typography>
            <Box
              sx={{
                minWidth: "70px", width: "15%", height: "24px",
                display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"
              }}
            >
              <Button
                sx={{
                  minWidth: "20px", width: "20px", height: "20px",
                  padding: 1,
                  fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.74)", backgroundColor: "rgba(149, 149, 149, 0.21)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(149, 149, 149, 0.53)",
                    transitionDuration: "0s"
                  }
                }}
              >
                -
              </Button>
              <Typography>
                2
              </Typography>
              <Button
                sx={{
                  minWidth: "20px", width: "20px", height: "20px",
                  padding: 1,
                  fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.74)", backgroundColor: "rgba(149, 149, 149, 0.21)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(149, 149, 149, 0.53)",
                    transitionDuration: "0s"
                  }
                }}
              >
                +
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%", height: "15%",
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
            gap: 2
          }}
        >
          <Button
            sx={{
              minWidth: "30%", height: "40%",
              padding: "10px",
              fontSize: 24, fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
              color: "rgb(255, 255, 255)", backgroundColor: "rgba(0, 0, 0, 0.20)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.35)",
                transitionDuration: "0.15s"
              }
            }}
            onClick={() => onClose()}
          >
            Close Cart
          </Button>
          <Button
            sx={{
              minWidth: "30%", height: "40%",
              padding: "10px",
              fontSize: 24, fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
              color: "rgba(255, 255, 255, 1)", backgroundColor: "rgba(255, 255, 255, 0.15)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                transitionDuration: "0.15s"
              }
            }}
          >
            Checkout
          </Button>
        </Box>
      </Card>
    </div>
  );
};

export default Cart;