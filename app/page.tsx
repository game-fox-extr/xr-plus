"use client";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import CenteredDot from "../components/Experience/CenteredDot";
import "./styles/defaults/reset.scss";
import React from "react";
import Modal from "../components/Experience/Modal";
import { useModalStore } from "../store/useModalStore";
import ChatbotModal from "../components/Experience/ChatBot";
import { useSceneStabilityStore } from "../store/useSceneStabilityStore";

const ThreeScene = dynamic(
  () => import("../components/Experience/ThreeScene"),
  { ssr: false }
);
const MemoizedThreeScene = React.memo(ThreeScene);

const Page = () => {
  const mainRef = useRef(null);
  const { modals, closeModal, openModal, openChatbotModal, closeChatbotModal } =
    useModalStore();
  const { removeJoyStick } = useSceneStabilityStore();
  const [modalData, setModalData] = useState({});
  const [modelUrl, setModelUrl] = useState("");

  const handleProductClick = useCallback(
    async (data?: any) => {
      try {
        const response1 = await fetch(
          "https://strategy-fox-go-bked.com/api/shopify/products/9658662388005",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response1.ok) {
          console.error("Failed to fetch product details in first call");
          return;
        }

        const result1 = await response1.json();
        console.log({ result1: result1 });
        console.log("First API Response:", result1.product);

        setModalData(result1.product);

        // Second API call
        const response2 = await fetch(
          `https://strategy-fox-go-bked.com/api/shopify/products/9658662388005/model`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response2.ok) {
          console.error("Failed to fetch product details in second call");
          return;
        }

        const result2 = await response2.json();
        console.log({ result2: result2 });
        console.log("Second API Response:", result2.data);

        setModelUrl(
          result2["data"]["product"]["media"]["edges"][2]["node"]["sources"][0][
            "url"
          ]
        );
        openModal("product"); // Open modal only after second call
      } catch (error) {
        console.error("Error during API calls:", error);
      }
    },
    [openModal]
  );

  const handleModalClose = useCallback(() => {
    closeModal("product");
  }, [closeModal]);

  console.log({ "Modal Product": modals.product });

  return (
    <main ref={mainRef} className="w-full h-screen relative">
      {!modals.product && <CenteredDot />}
      <MemoizedThreeScene onCubeClick={handleProductClick} />
      <img
        src="/Bot Icon.svg"
        alt="BotIcon"
        style={{ position: "fixed", top: "1.5%", right: "1.5%", zIndex: 999 }}
        onClick={() => {
          openChatbotModal("chatbot");
          removeJoyStick(true);
        }}
      />
      <Modal
        isOpen={modals.product}
        onClose={handleModalClose}
        data={modalData}
        modelUrl={modelUrl}
      />
      <ChatbotModal
        isChatbotModalOpen={modals.chatbot}
        onChatbotModalClose={() => {
          closeChatbotModal("chatbot");
          removeJoyStick(false);
        }}
      />
    </main>
  );
};

export default Page;
