"use client";
import dynamic from "next/dynamic";
import { useCallback, useState, useRef, useEffect } from "react";
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
  // const [modalData, setModalData] = useState<any[] | null>(null);
  // const mainRef = useRef(null);
  // const { 
  //   isPointerLocked, 
  //   requestPointerLock, 
  //   exitPointerLock 
  // } = usePointerLock();

  // Memoized click handler with optional data
  const handleCubeClick = useCallback((data?: any) => {
    setIsModalOpen(true);
    // if (data) {
    //   setModalData(Array.isArray(data) ? data : [data]);
    // }
  }, []);

  // Memoized modal close handler
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    // setModalData(null);
  }, []);

  // Toggle pointer lock
  // const handleTogglePointerLock = useCallback(() => {
  //   if (mainRef.current) {
  //     if (!isPointerLocked) {
  //       // Request pointer lock on the main element
  //       requestPointerLock(mainRef.current);
  //     } else {
  //       // Exit pointer lock
  //       exitPointerLock();
  //     }
  //   }
  // }, [isPointerLocked, requestPointerLock, exitPointerLock]);

  // Handle mouse movement when pointer is locked
  // useEffect(() => {
  //   if (!isPointerLocked) return;

  //   const handleMouseMove = (e: MouseEvent) => {
  //     // Handle mouse movement for camera or other interactions
  //     // e.movementX and e.movementY will give you relative mouse movement
  //     console.log('Mouse moved:', e.movementX, e.movementY);
  //   };

  //   window.addEventListener('mousemove', handleMouseMove);

  //   return () => {
  //     window.removeEventListener('mousemove', handleMouseMove);
  //   };
  // }, [isPointerLocked]);

  console.count("page.tsx render");

  return (
    <main 
      // ref={mainRef}
      className="w-full h-screen relative"
    >
      {!isModalOpen && (
        <CenteredDot 
          // isPointerLocked={isPointerLocked}
          // onTogglePointerLock={handleTogglePointerLock}
        />
      )}
      
      <MemoizedThreeScene 
        onCubeClick={handleCubeClick}
        // isPointerLocked={isPointerLocked}
      />
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        // data={modalData} 
      />
    </main>
  );
};

export default Page;