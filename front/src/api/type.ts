export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends TokenResponse {}

export interface RefreshTokenRequest {
  token: string;
}

export interface ErrorResponse {
  error: string;
}

export type LoginResponse2 = TokenResponse | ErrorResponse;

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  isSuperAdmin: boolean;
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
  isAdmin: boolean;
  employmentType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMembership {
  id: number;
  organizationId: number;
  organizationName: string;
  isAdmin: boolean;
}

export interface DecodedToken {
  userId: number;
  firstName?: string;
  lastName?: string;
  email: string;
  isSuperAdmin: boolean;
  memberships: UserMembership[];
  iat?: number;
  exp?: number;
}
