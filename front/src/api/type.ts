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
  memberships: UserMembership[];
}

export interface UserPatch {
  firstName?: string;
  lastName?: string;
  email?: string;
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
  ownerId: number;
}

export interface OrganizationPatch {
  name?: string;
  description?: string;
  type?: string;
  address?: string;
  phone?: string;
  email?: string;
  ownerId?: number;
}
export interface Member {
  id: number;
  role: string;
  isAdmin: boolean;
  userId: number;
  organizationId: number;
  status: MemberStatus;
  createdAt: Date;
  updatedAt: Date;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export enum MemberStatus {
  VOLUNTEER = "VOLUNTEER",
  SUBSCRIBER = "SUBSCRIBER",
  INTERN = "INTERN",
  EMPLOYEE = "EMPLOYEE",
}

export interface MembershipType {
  id: number;
  name: string;
  description?: string;
  duration: number;
  fee: number;
  organizationId: number;
}

export interface AGs {
  createdAt: string;
  date: string;
  description: string;
  id: number;
  organizationId: number;
  quorum: number;
  title: string;
  type: string;
  updatedAt: string;
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
