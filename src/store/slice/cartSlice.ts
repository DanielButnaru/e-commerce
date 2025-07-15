import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";

export  interface CartItem extends Product {
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
           ...action.payload,
            quantity: 1,
            price: action.payload.salePrice || action.payload.basePrice});
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
         id: string;
          quantity: number;
          selectedSize?: string;
          selectedColor?: string;
         }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("persist:cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
