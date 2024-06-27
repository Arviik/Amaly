import { api, isAdmin, tokenUtils } from "../config";
import Router from "next/router";
import {
  DecodedToken,
  LoginRequest,
  LoginResponse,
  TokenResponse,
} from "../type";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post("auth/login", { json: data });
      const result: TokenResponse = await response.json();

      if (result.accessToken && result.refreshToken) {
        // Stockage des tokens dans localStorage
        tokenUtils.setAccessToken(result.accessToken);
        tokenUtils.setRefreshToken(result.refreshToken);

        // Rediriger l'utilisateur en fonction de son rôle
        if (isAdmin()) {
          Router.push("/dashboard"); // Redirection vers le dashboard pour les admins
        } else {
          Router.push("/home"); // Redirection vers la page d'accueil pour les autres utilisateurs
        }

        return response.json<LoginResponse>();
      } else {
        throw new Error("Invalid login credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: () => {
    tokenUtils.clearTokens();
    Router.push("/login");
  },

  checkAuth: () => {
    // Vérifier si l'utilisateur est authentifié en vérifiant la présence d'un accessToken valide
    const token = tokenUtils.getAccessToken();
    if (token) {
      try {
        const decoded: DecodedToken = tokenUtils.decodeToken(token);
        if (decoded.expiresIn) {
          // Vérifier si le token a expiré
          const expiresAt = new Date(decoded.expiresIn).getTime();
          if (expiresAt < Date.now()) {
            authService.logout();
            return false;
          }
        }
        return true;
      } catch (error) {
        console.error("Token validation error:", error);
        authService.logout();
        return false;
      }
    } else {
      return false;
    }
  },
};
