import { FC, useState } from "react";

const FeatureButton: FC<{ image_url: string, top?: string, onClick?: () => void }> = ({ image_url, top, onClick}) => {
  const hoveredStyle = {
    cursor: "pointer",
    opacity: 0.8
  };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <img
      src={image_url}
      style={{
        position: "fixed", top: top || "min(1vw,1vh)", right: "min(1vw,1vh)",
        width: "min(10vh,10vw)", height: "auto",
        ...(isHovered ? hoveredStyle : {})
      }}
      onMouseEnter={() => { setIsHovered(true) }}
      onMouseLeave={() => { setIsHovered(false) }}
      onClick={onClick}
    />
  );
};

export default FeatureButton;