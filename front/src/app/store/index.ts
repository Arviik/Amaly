import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import navbarSlice from "./slices/navbarSlice";
import memberReducer from "./slices/memberSlice";
import organizationReducer from "./slices/organizationSlice";
import membershipTypeReducer from "./slices/membershipTypeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navbar: navbarSlice,
    member: memberReducer,
    organization: organizationReducer,
    membershipTypes: membershipTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
