import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface TelevisionProps {
  videoPath: string;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number]; // Optional rotation
}

const Television: React.FC<TelevisionProps> = ({
  videoPath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const gltf = useLoader(GLTFLoader, '/models/tv_modified.glb');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (!videoPath || !gltf) return;

    // Initialize the video element
    const video = document.createElement('video');
    video.src = videoPath;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.playsInline = true; // iOS support
    video.muted = true; // Required for autoplay policies
    video.autoplay = true;

    // Attempt to play the video
    video.play().catch((error) => {
      console.warn('Video playback failed:', error);
    });

    videoRef.current = video;

    // Create a VideoTexture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;
    videoTexture.type = THREE.UnsignedByteType;
    videoTexture.flipY = false;
    videoTexture.needsUpdate = true;
    videoTexture.colorSpace = THREE.SRGBColorSpace; //VERY IMPORTANT FOR VIDEO QUALITY - RGB encoding alternative for vanilla

    // Apply the video texture to the screen
    const monitorScreen = gltf.scene.getObjectByName('monitor-screen');
    if (monitorScreen && (monitorScreen as THREE.Mesh).isMesh) {
      (monitorScreen as THREE.Mesh).material = new THREE.MeshBasicMaterial({
        map: videoTexture,
        toneMapped: false, // Ensure the texture isn't affected by tone mapping
        side: THREE.FrontSide,
      });
    } else {
      console.error("Mesh named 'monitor-screen' not found in the model.");
    }

    return () => {
      // Cleanup to avoid memory leaks
      video.pause();
      video.src = '';
      video.load(); // Release video resources
      videoTexture.dispose();
    };
  }, [videoPath, gltf, scene]);

  return (
    <primitive
      object={gltf.scene}
      scale={scale}
      position={position}
      rotation={rotation.map((r) => r * (Math.PI / 180)) as [number, number, number]}
      dispose={null}
    />
  );
};

export default Television;
