import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "../features/cartSlice";

const cartPersistConfig = {
  key: "cart", 
  storage,    
};



const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);


export const store = configureStore({
  reducer: {
    allCart: persistedCartReducer,
  },
});

export const persistor = persistStore(store);
