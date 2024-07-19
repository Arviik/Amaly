import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import navbarSlice from "./slices/navbarSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navbar: navbarSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
