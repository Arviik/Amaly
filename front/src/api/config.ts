import ky from "ky";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { DecodedToken, TokenResponse } from "./type";

const tokenUtils = {
  getTokens: (): TokenResponse | null => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  },
  setTokens: (tokenObject: TokenResponse) => {
    localStorage.setItem("accessToken", tokenObject.accessToken);
    Cookies.set("refreshToken", tokenObject.refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },
  clearTokens: () => {
    localStorage.removeItem("accessToken");
    Cookies.remove("refreshToken");
  },
  decodeToken: (token: string): DecodedToken => jwtDecode(token),
};

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
  hooks: {
    beforeRequest: [
      (request) => {
        const tokens = tokenUtils.getTokens();
        if (tokens?.accessToken) {
          request.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const tokens = tokenUtils.getTokens();
          if (tokens?.refreshToken) {
            try {
              const refreshResponse = await api
                .post("auth/refreshToken", {
                  json: { token: tokens.refreshToken },
                })
                .json<TokenResponse>();
              tokenUtils.setTokens(refreshResponse);
              request.headers.set(
                "Authorization",
                `Bearer ${refreshResponse.accessToken}`
              );
              return ky(request);
            } catch (error) {
              tokenUtils.clearTokens();
              throw error;
            }
          }
        }
      },
    ],
  },
});

let refreshPromise: Promise<boolean> | null = null;

const refreshToken = async (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = new Promise(async (resolve) => {
    const tokens = tokenUtils.getTokens();
    if (!tokens?.refreshToken) {
      resolve(false);
      return;
    }

    try {
      const refreshResponse = await api
        .post("auth/refreshToken", {
          json: { token: tokens.refreshToken },
        })
        .json<TokenResponse>();

      tokenUtils.setTokens(refreshResponse);
      resolve(true);
    } catch (error) {
      tokenUtils.clearTokens();
      resolve(false);
    } finally {
      refreshPromise = null;
    }
  });

  return refreshPromise;
};

const getUserRole = (): string | null => {
  const tokens = tokenUtils.getTokens();
  if (!tokens?.accessToken) {
    return null;
  }

  try {
    const decodedToken = tokenUtils.decodeToken(
      tokens.accessToken
    ) as DecodedToken;
    return decodedToken.userRole || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === "ADMIN" || role === "SUPER_ADMIN";
};

export { api, tokenUtils, refreshToken, getUserRole, isAdmin };
