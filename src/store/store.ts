import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./slice/cartSlice"
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
const persistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"], 
}

// Creăm reducerul persistat
const persistedCartReducer = persistReducer(persistConfig, cartReducer)

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignoră acțiunile redux-persist pentru a nu arunca erori
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

// Tipuri pentru TS
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
