import { create } from "zustand";

export interface Product {
  id: number | string;
  [key: string]: any;
}

interface ProductsStore {
  products: Product[];
  selectedProduct: Product | null;
  selectedProductGLB: string;
  setProducts: (products: Product[]) => void;
  setProductGLb: (url: string) => void;
  selectProduct: (product: Product) => void;
}

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [],
  selectedProduct: null,
  selectedProductGLB: "",
  setProductGLb: (url: any) =>
    set({
      selectedProductGLB: url,
    }),
  selectProduct: (product) =>
    set({
      selectedProduct: product,
    }),
  setProducts: (products: Product[]) => set({ products }),
}));
