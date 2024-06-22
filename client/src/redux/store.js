import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";
import { combineReducers } from "redux";

import { authReducer } from "./slices/authSlice";
import { profileReducer } from "./slices/profileSlice";
import { adReducer } from "./slices/adSlice";
import { controlsReducer } from "./slices/controlsSlice";
import { adminReducer } from "./slices/adminSlice";
import { notificationReducer } from "./slices/notificationSlice";

const authPersistConfig = {
  key: "auth",
  storage,
};

// Create persisted reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  profile: profileReducer,
  ad: adReducer,
  controls: controlsReducer,
  admin: adminReducer,
  notification: notificationReducer,
});

// Create state sync config
const stateSyncConfig = {
  blacklist: ["persist/PERSIST", "persist/REHYDRATE"],
};

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }).concat(createStateSyncMiddleware(stateSyncConfig)),
});

// Initialize message listener for state sync
initMessageListener(store);

// Create persistor
export const persistor = persistStore(store);

export default store;
