import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./slice/cartSlice"
import wishlistReducer from "./slice/wishlistSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage" // localStorage

// Configurare persist pentru cart slice
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"],
}

// Configurare persist pentru wishlist slice
const wishlistPersistConfig = {
  key: "wishlist",
  storage,
  whitelist: ["items"],
}

// Reducer persistat pentru cart
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer)

// Reducer persistat pentru wishlist
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer)

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

// Tipuri TS
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
