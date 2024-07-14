import { User, Organization, UserMembership } from "@/api/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isSuperAdmin: boolean;
}

interface AuthState {
  user: AuthUser | null;
  memberships: UserMembership[];
  isAuthenticated: boolean;
  selectedOrganizationId: number | null;
}

const initialState: AuthState = {
  user: null,
  memberships: [],
  isAuthenticated: false,
  selectedOrganizationId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; memberships: UserMembership[] }>
    ) => {
      state.user = action.payload.user;
      state.memberships = action.payload.memberships;
      state.isAuthenticated = true;
    },
    setSelectedOrganization: (state, action: PayloadAction<number>) => {
      state.selectedOrganizationId = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.memberships = [];
      state.isAuthenticated = false;
      state.selectedOrganizationId = null;
    },
  },
});

export const { setCredentials, setSelectedOrganization, clearCredentials } =
  authSlice.actions;

export default authSlice.reducer;

// Sélecteurs
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsSuperAdmin = (state: RootState) =>
  state.auth.user?.isSuperAdmin ?? false;
export const selectMemberships = (state: RootState) => state.auth.memberships;
export const selectSelectedOrganizationId = (state: RootState) =>
  state.auth.selectedOrganizationId;
