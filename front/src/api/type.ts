// src/api/type.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  userId: string;
  userRole: string;
  exp?: number;
  jti?: string;
}

export interface CheckSession {
  userId: number;
  userRole: string;
}

export interface LoginResponse extends TokenResponse {}

export interface RefreshTokenRequest {
  token: string;
}

export interface ErrorResponse {
  error: string;
}

export type LoginResponse2 = TokenResponse | ErrorResponse;

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface Organization {
  id: number;
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
}
