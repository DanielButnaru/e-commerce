import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "../../types/product"

interface WishlistState {
  items: Product[]
}

const initialState: WishlistState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist(state, action: PayloadAction<Product[]>) {
      state.items = action.payload
    },
    addToWishlist(state, action: PayloadAction<Product>) {
      if (!state.items.find(item => item.id === action.payload.id)) {
        state.items.push(action.payload)
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearWishlist(state) {
      state.items = []
    },
  },
})

export const { setWishlist, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
