export interface DecodedToken {
  userId: string;
  userRole: string;
  expiresIn?: string | number;
}
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/*Login type*/
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ErrorResponse {
  error: string;
}

export type LoginResponse = TokenResponse | ErrorResponse;
