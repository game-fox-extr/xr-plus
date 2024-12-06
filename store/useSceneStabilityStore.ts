import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the store interface
interface SceneStabilityStore {
  sceneKey: number;
  playerPosition: [number, number, number];
  isLoading: boolean;
  
  // Actions
  resetScene: () => void;
  setPlayerPosition: (position: [number, number, number]) => void;
  setLoading: (isLoading: boolean) => void;
}

// Create the Zustand store
export const useSceneStabilityStore = create<SceneStabilityStore>()(
  persist(
    (set) => ({
      sceneKey: 0,
      playerPosition: [10, 10, 0],
      isLoading: true,
      
      resetScene: () => set((state) => ({
        sceneKey: state.sceneKey + 1,
        playerPosition: [10, 10, 0],
        isLoading: true
      })),
      
      setPlayerPosition: (position) => set({ playerPosition: position }),
      
      setLoading: (isLoading) => set({ isLoading })
    }),
    {
      name: 'scene-stability-storage', // unique name
      partialize: (state) => ({
        playerPosition: state.playerPosition // Only persist player position
      })
    }
  )
);
