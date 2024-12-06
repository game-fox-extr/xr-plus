import { create } from "zustand";

interface GameState {
  isLoading: boolean;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  isLoading: true,
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  resetGame: () => set({ isLoading: false, loadingProgress: 0 }),
}));
