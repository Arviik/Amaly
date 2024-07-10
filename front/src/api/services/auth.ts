import { store } from "@/app/store";
import {
  logout as logoutAction,
  setCredentials,
} from "@/app/store/slices/authSlice";
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
    store.dispatch(logoutAction());
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

    // Si l'authentification locale est valide, vérifiez la session côté serveur
    const sessionData = await authService.checkSession();
    if (sessionData) {
      // Mettre à jour les informations de l'utilisateur si nécessaire
      store.dispatch(
        setCredentials({
          user: {
            id: sessionData.userId.toString(),
            isSuperAdmin: sessionData.isSuperAdmin,
          },
        })
      );
      return true;
    }

    // Si la session n'est pas valide côté serveur, déconnectez l'utilisateur
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
        return { userId: data.userId, isSuperAdmin: data.isSuperAdmin };
      }
      return null;
    } catch (error) {
      console.error("Session check error:", error);
      return null;
    }
  },
};
