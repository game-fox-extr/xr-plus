import React, { useEffect, useState } from "react";
import "../styles/loading-animation.css";

const Loader: React.FC = () => {
  const [isFading, setIsFading] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fadeOutLoader = () => {
      const fadeInterval = setInterval(() => {
        setOpacity((prev) => {
          const newOpacity = Math.max(prev - 0.05, 0);
          if (newOpacity <= 0.05) {
            setIsFading(true);
            clearInterval(fadeInterval);
          }
          return newOpacity;
        });
      }, 50); // Adjust fade-out speed
    };

    window.addEventListener("load", fadeOutLoader);

    return () => {
      window.removeEventListener("load", fadeOutLoader);
    };
  }, []);

  if (isFading) return null;

  return (
    <div
      className="loader-background"
      style={{ opacity: opacity, transition: "opacity 0.1s ease-in-out" }}
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
            <div className="loading-text">Loading...</div>
          </div>
          <img
            id="powered-by-loader"
            src="logo.avif"
            alt="Powered By Strategy Fox"
            className="powered-by-loader"
          />
        </div>
        <div className="loading-line"></div>
      </div>
    </div>
  );
};

export default Loader;
