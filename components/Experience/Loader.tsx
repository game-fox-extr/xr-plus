import { Html, useProgress } from "@react-three/drei";
import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import "../styles/loading-animation.css";

const Loader: React.FC = () => {
  const { progress } = useProgress();
  const [isFading, setIsFading] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useFrame(() => {
    if (progress >= 100 && opacity > 0) {
      setOpacity((prev) => Math.max(prev - 0.05, 0)); // Gradually fade out
      if (opacity <= 0.05) setIsFading(true);
    }
  });

  if (isFading) return null; // Remove the loader completely once faded out

  return (
    <Html center>
      <div
        className="loader-background"
        style={{ opacity: opacity, transition: "opacity 0.1s" }}
      >
        <div className="loader-container-container">
          <div className="loader-container" id="loaderContainer">
            <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="loading-text-container">
              <div className="loading-text typewriter">Delta XR</div>
              <div className="loading-text">{progress.toFixed(0)}% loaded</div>
            </div>
            <img
              id="powered-by-loader"
              src="logo.avif"
              alt="Powered By Strategy Fox"
              className="powered-by-loader"
            />
          </div>
          <div
            className="loading-line"
            style={{ transform: `scaleX(${progress / 100})` }}
          ></div>
        </div>
      </div>
    </Html>
  );
};

export default Loader;
