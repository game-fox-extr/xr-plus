import { useEffect } from "react";
import { useSceneStabilityStore } from "./useSceneStabilityStore";

export const useSceneStability = () => {
    const { sceneKey, playerPosition, resetScene } = useSceneStabilityStore();
  
    useEffect(() => {
      // Handle visibility change
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          resetScene();
        }
      };
  
      // Handle window resize
      const handleResize = () => {
        resetScene();
      };
  
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('resize', handleResize);
  
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleResize);
      };
    }, [resetScene]);
  
    return { sceneKey, playerPosition, resetScene };
  };
  