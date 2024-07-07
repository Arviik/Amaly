import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenResponse, DecodedToken } from "@/api/type";
import { tokenUtils } from "@/api/config";

interface AuthState {
  isAuthenticated: boolean;
  user: null | { id: string; role: string };
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Partial<AuthState>>) => {
      if (action.payload.user) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      }
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
