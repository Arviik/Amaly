import { store } from "@/app/store";
import { clearCredentials, setCredentials } from "@/app/store/slices/authSlice";
import { api, tokenUtils, refreshToken } from "../config";
import {
  LoginRequest,
  LoginResponse,
  TokenResponse,
  DecodedToken,
  CheckSession,
} from "../type";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post("auth/login", { json: data });
      const result: TokenResponse = await response.json();

      if (result.accessToken && result.refreshToken) {
        tokenUtils.setTokens(result);
        const decoded: DecodedToken = tokenUtils.decodeToken(
          result.accessToken
        );
        store.dispatch(
          setCredentials({
            user: {
              id: decoded.userId,
              isSuperAdmin: decoded.isSuperAdmin,
            },
            organizations: decoded.organizations,
          })
        );
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
    tokenUtils.clearTokens();
    store.dispatch(clearCredentials());
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
      return false;
    }

    const sessionData = await authService.checkSession();
    if (sessionData) {
      store.dispatch(
        setCredentials({
          user: {
            id: sessionData.userId,
            isSuperAdmin: sessionData.isSuperAdmin,
          },
          organizations: sessionData.organizations,
        })
      );
      return true;
    }

    await authService.logout();
    return false;
  },

  checkSession: async (): Promise<CheckSession | null> => {
    try {
      const tokens = tokenUtils.getTokens();
      if (!tokens?.accessToken) {
        return null;
      }

      const response = await api.get("auth/check", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json<CheckSession>();
        return {
          userId: data.userId,
          isSuperAdmin: data.isSuperAdmin,
          organizations: data.organizations, // Ajout des organizations
        };
      }
      return null;
    } catch (error) {
      console.error("Session check error:", error);
      return null;
    }
  },
};
