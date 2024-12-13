import { Box } from "@mui/material";
import { FC, useState } from "react";

const FeatureButton: FC<{ image_url: string, top?: string, onClick?: () => void }> = ({ image_url, top, onClick}) => {
  const hoveredStyle = {
    cursor: "pointer",
    opacity: 0.8
  };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      sx={{
        width: { xs: "min(20vw, 20vh)", sm: "min(15vw, 15vh)", md: "min(10vw, 10vh)", lg: "min(10vw, 10vh)", xl: "min(10vw, 10vh)" },
        height: { xs: "min(20vw, 20vh)", sm: "min(15vw, 15vh)", md: "min(10vw, 10vh)", lg: "min(10vw, 10vh)", xl: "min(10vw, 10vh)" },
        position: "fixed", 
        top: top || {xs: "min(5vw, 5vh)", sm: "min(3vw, 3vh)", md: "min(1vw, 1vh)", lg: "min(1vw, 1vh)", xl: "min(1vw, 1vh)" }, 
        right: {xs: "min(5vw, 5vh)", sm: "min(3vw, 3vh)", md: "min(1vw, 1vh)", lg: "min(1vw, 1vh)", xl: "min(1vw, 1vh)" },
      }}
    >
      <img
        src={image_url}
        style={{
          width: "100%", height: "100%",
          ...(isHovered ? hoveredStyle : {})
        }}
        onMouseEnter={() => { setIsHovered(true) }}
        onMouseLeave={() => { setIsHovered(false) }}
        onClick={onClick}
      />
    </Box>
  );
};

export default FeatureButton;