import { create } from "zustand";

interface PointerState {
    pointerLocked: boolean;
    setLock: (locked: boolean) => void;  
}

export const usePointerStore = create<PointerState>((set) => ({
    pointerLocked: true,
    setLock: (locked) => set( {pointerLocked: locked} )
}));