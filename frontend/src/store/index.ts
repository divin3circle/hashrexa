import { create } from "zustand";

interface StockStore {
  selectedStock: string;
  setSelectedStock: (stock: string) => void;
}

export const useStockStore = create<StockStore>((set) => ({
  selectedStock: "AAPL",
  setSelectedStock: (stock) => set({ selectedStock: stock }),
}));
