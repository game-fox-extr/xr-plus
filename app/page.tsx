"use client";
import "./styles/defaults/reset.scss";
import dynamic from "next/dynamic";
import { useState } from "react";
import styled from "styled-components";

// Dynamically import ThreeScene with no SSR
const ThreeScene = dynamic(
  () => import("../components/Experience/ThreeScene"),
  { ssr: false }
);

const Button = styled.button`
  color: grey;
`;

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <main className="w-full h-screen">
      <div style={{ width: "100vw", height: "100vh" }}>
        <ThreeScene />
      </div>
    </main>
  );
};

export default Page;
