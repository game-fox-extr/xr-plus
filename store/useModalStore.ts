import { create } from "zustand";

type ModalType = "product" | "settings" | "cart" | "chatbot";

interface ModalStore {
  modals: Record<ModalType, boolean>;
  openModal: (modalType: ModalType) => void;
  closeModal: (modalType: ModalType) => void;
  toggleModal: (modalType: ModalType) => void;
  openChatbotModal: (modalType: ModalType) => void;
  closeChatbotModal: (modalType: ModalType) => void;
}

export const useModalStore = create<ModalStore>()((set) => ({
  modals: {
    product: false,
    settings: false,
    cart: false,
    chatbot: false,
  },

  openModal: (modalType) =>
    set((state) => ({
      modals: { ...state.modals, [modalType]: true },
    })),

  closeModal: (modalType) =>
    set((state) => ({
      modals: { ...state.modals, [modalType]: false },
    })),

  toggleModal: (modalType) =>
    set((state) => ({
      modals: { ...state.modals, [modalType]: !state.modals[modalType] },
    })),

  openChatbotModal: (modalType) =>
    set((state) => ({
      modals: { ...state.modals, [modalType]: true },
    })),

  closeChatbotModal: (modalType) =>
    set((state) => ({
      modals: { ...state.modals, [modalType]: false },
    })),
}));
