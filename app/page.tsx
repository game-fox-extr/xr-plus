"use client";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import CenteredDot from "../components/Experience/CenteredDot";
import "./styles/defaults/reset.scss";
import React from "react";
import Modal from "../components/Experience/Modal";

// Dynamically import ThreeScene with no SSR
const ThreeScene = dynamic(
  () => import("../components/Experience/ThreeScene"),
  { ssr: false }
);
const MemoizedThreeScene = React.memo(ThreeScene);

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalData, setModalData] = useState<{
  //   "status-code": number;
  //   product: any;
  // } | null>(null);
  // Memoized click handler
  const handleCubeClick = useCallback(() => {
    setIsModalOpen(true);
  }, []); // No dependencies, so function remains the same

  let modalData: any[] = [];

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  console.count("page.tsx");
  return (
    <main className="w-full h-screen">
     {!isModalOpen && <CenteredDot />}
      <MemoizedThreeScene onCubeClick={handleCubeClick} />
      <Modal isOpen={isModalOpen} onClose={handleModalClose} data={modalData} />
    </main>
  );
};

export default Page;

// TODO: pointer lock controls from page 