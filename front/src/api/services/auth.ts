import { store } from "@/app/store";
import { clearCredentials, setCredentials } from "@/app/store/slices/authSlice";
import { api, refreshToken, tokenUtils } from "../config";
import {
  LoginRequest,
  LoginResponse,
  TokenResponse,
  DecodedToken,
  SignupRequest,
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
              firstName: decoded.firstName || "",
              lastName: decoded.lastName || "",
              email: decoded.email,
              isSuperAdmin: decoded.isSuperAdmin,
            },
            memberships: decoded.memberships,
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

  refreshToken: refreshToken,

  getInitialRoute: (
    decoded: DecodedToken,
    selectedOrganizationId: number | null
  ): string => {
    if (decoded.isSuperAdmin) {
      return "/admin/overview";
    }

    const membershipsCount = decoded.memberships.length;

    if (membershipsCount === 0) {
      return "/";
    }

    if (selectedOrganizationId) {
      const selectedMembership = decoded.memberships.find(
        (m) => m.organizationId === selectedOrganizationId && m.isAdmin
      );
      if (selectedMembership) {
        return selectedMembership.isAdmin ? "/dashboard" : "/member";
      }
    }

    if (membershipsCount === 1) {
      const membership = decoded.memberships[0];
      return membership.isAdmin ? "/dashboard" : "/member";
    }

    return "/profiles";
  },
  sendPasswordResetEmail: async (email: string): Promise<void> => {
    try {
      await api.post("auth/forgot-password", { json: { email } });
    } catch (error) {
      console.error("Send password reset email error:", error);
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await api.post("auth/reset-password", { json: { token, newPassword } });
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },
  signup: async (data: SignupRequest): Promise<TokenResponse> => {
    try {
      const response = await api.post("auth/signup", { json: data });
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
              firstName: decoded.firstName || "",
              lastName: decoded.lastName || "",
              email: decoded.email,
              isSuperAdmin: decoded.isSuperAdmin,
            },
            memberships: decoded.memberships,
          })
        );
        return result;
      } else {
        throw new Error("Invalid signup response");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },
};
