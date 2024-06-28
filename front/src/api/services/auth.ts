import { api, tokenUtils, refreshToken } from "../config";
import {
  LoginRequest,
  LoginResponse,
  TokenResponse,
  DecodedToken,
} from "../type";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post("auth/login", { json: data });
      const result: TokenResponse = await response.json();

      if (result.accessToken && result.refreshToken) {
        tokenUtils.setTokens(result);
        return result;
      } else {
        throw new Error("Invalid login credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const tokens = tokenUtils.getTokens();
      if (tokens?.refreshToken) {
        await api.post("auth/revokeRefreshToken", {
          json: { token: tokens.refreshToken },
        });
      }
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      tokenUtils.clearTokens();
    }
  },

  checkAuth: async (): Promise<boolean> => {
    const tokens = tokenUtils.getTokens();
    if (!tokens?.accessToken) {
      return false;
    }

    try {
      const decoded: DecodedToken = tokenUtils.decodeToken(tokens.accessToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < currentTime) {
        // Token expiré, essayer de le rafraîchir
        const refreshed = await refreshToken();
        if (!refreshed) {
          await authService.logout();
          return false;
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      await authService.logout();
      return false;
    }
  },

  checkAndRefreshSession: async (): Promise<boolean> => {
    const isAuthenticated = await authService.checkAuth();
    if (!isAuthenticated) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        await authService.logout();
        return false;
      }
    }
    return true;
  },
};
