import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { profileReducer } from "./slices/profileSlice";
import { adReducer } from "./slices/adSlice";
import { controlsReducer } from "./slices/controlsSlice";
import { adminReducer } from "./slices/adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    ad: adReducer,
    controls: controlsReducer,
    admin: adminReducer,
  },
});

export default store;
