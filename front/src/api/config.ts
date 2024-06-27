import ky from "ky";
import Router from "next/router";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, TokenResponse } from "./type";

const API_URl = process.env.NEXT_PUBLIC_API_URL;

const tokenUtils = {
  getAccessToken: () => localStorage.getItem("accessToken"),
  setAccessToken: (token: string) => localStorage.setItem("accessToken", token),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  setRefreshToken: (token: string) =>
    localStorage.setItem("refreshToken", token),
  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
  decodeToken: (token: string): DecodedToken => jwtDecode(token),
};

const api = ky.create({
  prefixUrl: API_URl,
  hooks: {
    beforeRequest: [
      async (request) => {
        const accessToken = tokenUtils.getAccessToken();
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const refreshToken = tokenUtils.getRefreshToken();
          if (refreshToken) {
            const response = await api.post("auth/refreshToken", {
              json: { refreshToken },
            });
            const data: TokenResponse = await response.json();
            tokenUtils.setAccessToken(data.accessToken);
            tokenUtils.setRefreshToken(data.refreshToken);
            request.headers.set("Authorization", `Bearer ${data.accessToken}`);
            return api(request);
          } else {
            tokenUtils.clearTokens();
            Router.push("/login");
          }
        }
      },
    ],
  },
});

const isAdmin = (): boolean => {
  const token = tokenUtils.getAccessToken();
  if (!token) return false;
  const decoded = tokenUtils.decodeToken(token);
  return ["admin", "super_admin"].includes(decoded.userRole);
};

export { api, tokenUtils, isAdmin };
