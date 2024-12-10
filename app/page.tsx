"use client";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState, useEffect } from "react";
import CenteredDot from "../components/Experience/CenteredDot";
import "./styles/defaults/reset.scss";
import React from "react";
import Modal from "../components/Experience/Modal";
import { useModalStore } from "../store/useModalStore";
import Loader from "../components/Experience/Loader";

const ThreeScene = dynamic(
  () => import("../components/Experience/ThreeScene"),
  { ssr: false }
);
const MemoizedThreeScene = React.memo(ThreeScene);

const Page = () => {
  const mainRef = useRef(null);
  const { modals, closeModal, openModal } = useModalStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Tracks loader visibility

  useEffect(() => {
    const handleLoad = () => {
      // Delay hiding the loader by 4 seconds after the page loads
      setTimeout(() => {
        setIsLoaded(true);
        setTimeout(() => setIsVisible(false), 5000); // Delay hiding the loader visually
      }, 0); // Start delay immediately after page load
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  const handleProductClick = useCallback((data?: any) => {
    openModal("product");
  }, [openModal]);

  const handleModalClose = useCallback(() => {
    closeModal("product");
  }, [closeModal]);

  return (
    <>
      {isVisible && <Loader />} 
      <main ref={mainRef} className="w-full h-screen relative">
        {!modals.product && <CenteredDot />}
        <MemoizedThreeScene onCubeClick={handleProductClick} />
        <Modal isOpen={modals.product} onClose={handleModalClose} />
      </main>
    </>
  );
};

export default Page;