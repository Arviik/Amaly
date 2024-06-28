import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenResponse, DecodedToken } from "@/api/type";
import { tokenUtils } from "@/api/config";

interface AuthState {
  isAuthenticated: boolean;
  user: null | DecodedToken;
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
    setCredentials: (state, action: PayloadAction<TokenResponse>) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.user = tokenUtils.decodeToken(accessToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    updateAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setCredentials, logout, updateAuthStatus } = authSlice.actions;
export default authSlice.reducer;
