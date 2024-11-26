import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three'

const RayCaster = () => {
    const { camera, scene } = useThree();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
  
    useEffect(() => {
      const handleClick = (event: MouseEvent) => {
        // Calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);
  
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children, true);
  
        if (intersects.length > 0) {
          const point = intersects[0].point;
          console.log("Intersection point:", {
            x: point.x.toFixed(2),
            y: point.y.toFixed(2),
            z: point.z.toFixed(2),
          });
        }
      };
  
      window.addEventListener("click", handleClick);
  
      return () => {
        window.removeEventListener("click", handleClick);
      };
    }, [camera, scene, raycaster]);
  
    return null;
  };

  export default RayCaster