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
  owner: {
    firstName: string;
    lastName: string;
    email: string;
  };
  documents: Document[];
  ags: AGs[];
  members: Member[];
}

export interface Document {
  id: number;
  title: string;
  description: string;
  path: string;
  createdAt: Date;
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
  startDate: Date;
  endDate?: Date;
  userId: number;
  organizationId: number;
  status: MemberStatus;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
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
  status: MemberStatus;
  role: string;
  isAdmin: boolean;
  organizationId: number;
  organizationName: string;
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

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  organizationId: number;
}

export interface ActivityPatch {
  title?: string;
  description?: string;
  date?: string;
  organizationId?: number;
}

export interface MembershipType {
  id: number;
  name: string;
  description: string;
  amount: number;
  duration: number;
  organizationId: number;
}
