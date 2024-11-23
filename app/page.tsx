"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Preloader from "../components/Experience/Preloader";
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
        <Suspense fallback={null}>
          <ThreeScene />
        </Suspense>
      </div>
    </main>
  );
};

export default Page;
