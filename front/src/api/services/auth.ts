import { store } from "@/app/store";
import { clearCredentials, setCredentials } from "@/app/store/slices/authSlice";
import { api, refreshToken, tokenUtils } from "../config";
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
      return "/"; // À remplacer par "/marketplace" une fois implémenté
    }

    if (selectedOrganizationId) {
      const selectedMembership = decoded.memberships.find(
        (m) => m.organizationId === selectedOrganizationId
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
};
