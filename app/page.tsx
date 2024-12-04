"use client";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import CenteredDot from "../components/Experience/CenteredDot";
import "./styles/defaults/reset.scss";
import React from "react";
import Modal from "../components/Experience/Modal";
import { useModalStore } from "../store/useModalStore";

const ThreeScene = dynamic(
  () => import("../components/Experience/ThreeScene"),
  { ssr: false }
);
const MemoizedThreeScene = React.memo(ThreeScene);

const Page = () => {
  const mainRef = useRef(null);
  const { modals, closeModal, openModal } = useModalStore();

  const handleProductClick = useCallback((data?: any) => {
    openModal("product");
  }, [openModal]);

  const handleModalClose = useCallback(() => {
    closeModal("product");
  }, [closeModal]);

  return (
    <main ref={mainRef} className="w-full h-screen relative">
      {!modals.product && <CenteredDot />}
      <MemoizedThreeScene onCubeClick={handleProductClick} />
      <Modal
        isOpen={modals.product}
        onClose={handleModalClose}
      />
    </main>
  );
};

export default Page;