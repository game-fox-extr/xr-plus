"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CenteredDot from "../components/Experience/CenteredDot";
import Loader from "../components/Experience/Loader";
import Modal from "../components/Experience/Modal";
import { useModalStore } from "../store/useModalStore";
import { usePointerStore } from "../store/usePointerStore";
import { useSceneStabilityStore } from "../store/useSceneStabilityStore";
import "./styles/defaults/reset.scss";
import { ProductService } from "../api/shopifyAPIService";
import { useProductsStore } from "../store/useProductStore";

const ThreeScene = dynamic(
  () => import("../components/Experience/ThreeScene"),
  { ssr: false }
);
const MemoizedThreeScene = React.memo(ThreeScene);

const Page = () => {
  const mainRef = useRef(null);
  const {
    modals,
    closeModal,
    openModal,
    openChatbotModal,
    closeChatbotModal,
    toggleModal,
  } = useModalStore();
  const { setLock, pointerLocked } = usePointerStore();
  const { removeJoyStick } = useSceneStabilityStore();
  const {
    products,
    setProducts,
    selectProduct,
    selectedProduct,
    selectedProductGLB,
    setProductGLb,
  } = useProductsStore();
  const [isVisible, setIsVisible] = useState(true); // Tracks loader visibility

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await ProductService.getAllProducts();
        setProducts(response.products);
      } catch (err) {
        console.error(err);
      }
    }
    const handleLoad = () => {
      // Delay hiding the loader by 4 seconds after the page loads
      setTimeout(() => {
        // setIsLoaded(true);
        setTimeout(() => setIsVisible(false), 5000); // Delay hiding the loader visually
      }, 0); // Start delay immediately after page load
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }
    fetchProducts();
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  const listedProducts = [...products];

  function findProductById(products: any, productId: any) {
    return products.find((product: any) => product.id === productId);
  }

  const handleProductClick = useCallback(
    async (productID?: any) => {
      const clickedProduct = await findProductById(listedProducts, productID);
      selectProduct(clickedProduct);
      //only for the 3d model url
      const result2 = await ProductService.getProductModel(productID);

      const glbUrl = result2.data.product.media
        .edges!.find((edge: any) => edge.node.mediaContentType === "MODEL_3D")
        ?.node.sources.find((source: any) => source.format === "glb")?.url;

      setProductGLb(glbUrl);

      openModal("product");

      removeJoyStick(true);
    },
    [findProductById, openModal, removeJoyStick]
  );

  const handleModalClose = useCallback(() => {
    closeModal("product");
    removeJoyStick(false);
    setLock(true);
  }, [closeModal]);
  return (
    <>
      {isVisible && <Loader />}
      <main ref={mainRef} className="w-full h-screen relative">
        {!modals.product && <CenteredDot />}
        <MemoizedThreeScene onCubeClick={handleProductClick} />
        <Modal
          isOpen={modals.product}
          onClose={handleModalClose}
          data={selectedProduct}
          modelUrl={selectedProductGLB}
        />

        {/* NOTE: Commenting this part for future implementations
         <img
          src="/Bot Icon.svg"
          alt="BotIcon"
          style={{ position: "fixed", top: "1.5%", right: "1.5%", zIndex: 999 }}
          onClick={() => {
            openChatbotModal("chatbot");
            removeJoyStick(true);
          }}
        />
        <ChatbotModal
          isChatbotModalOpen={modals.chatbot}
          onChatbotModalClose={() => {
            closeChatbotModal("chatbot");
            removeJoyStick(false);
          }}
        /> */}
      </main>
    </>
  );
};

export default Page;
