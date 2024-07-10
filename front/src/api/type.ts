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
  isSuperAdmin: boolean;
  exp?: number;
  jti?: string;
}

export interface CheckSession {
  userId: number;
  isSuperAdmin: boolean;
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

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Member {
  id: number;
  membershipType: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  userId: number;
  organizationId: number;
  employmentType?: string;
  createdAt: Date;
  updatedAt: Date;
}
