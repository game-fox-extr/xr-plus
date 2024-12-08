import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SceneStabilityStore {
  sceneKey: number;
  playerPosition: [number, number, number];
  isLoading: boolean;
  loadingProgress: number;
  
  // Actions
  resetScene: () => void;
  setPlayerPosition: (position: [number, number, number]) => void;
  setLoading: (isLoading: boolean) => void;
  updateLoadingProgress: (progress: number) => void;
}

export const useSceneStabilityStore = create<SceneStabilityStore>()(
  persist(
    (set, get) => ({
      sceneKey: 0,
      playerPosition: [10, 10, 0],
      isLoading: true,
      loadingProgress: 0,
      
      resetScene: () => {
        const currentPosition = get().playerPosition;
        set((state) => ({
          sceneKey: state.sceneKey + 1,
          playerPosition: currentPosition,
          isLoading: false,
          loadingProgress: 100
        }));
      },

      setPlayerPosition: (position) => set({ playerPosition: position }),
      
      setLoading: (isLoading) => set({ 
        isLoading, 
        loadingProgress: isLoading ? 0 : 100 
      }),
      
      updateLoadingProgress: (progress) => set({ 
        loadingProgress: progress,
        isLoading: progress < 100
      })
    }),
    {
      name: 'scene-stability-storage',
      partialize: (state) => ({
        playerPosition: state.playerPosition
      })
    }
  )
);

