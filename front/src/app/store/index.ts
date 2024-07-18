import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import navbarSlice from "./slices/navbarSlice";
import memberReducer from "./slices/memberSlice";
import organizationReducer from "./slices/organizationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navbar: navbarSlice,
    member: memberReducer,
    organization: organizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
