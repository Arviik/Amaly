import jwt from "jsonwebtoken";
import crypto from "crypto";
import { SafeUser, UserMembership } from "../utils/userTypes";

export const generateAccessToken = (
  user: SafeUser,
  userMemberships: UserMembership[]
) => {
  const organizations = userMemberships.map((membership) => ({
    id: membership.organizationId,
    name: membership.organizationName,
    isAdmin: membership.isAdmin,
  }));

  return jwt.sign(
    {
      userId: user.id,
      organizations,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
    }
  );
};

export const generateRefreshToken = (user: SafeUser, jti: string) => {
  return jwt.sign(
    {
      userId: user.id,
      jti,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
    }
  );
};

export const generateTokens = (
  user: SafeUser,
  jti: string,
  userMemberships: UserMembership[]
) => {
  const accessToken = generateAccessToken(user, userMemberships);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha512").update(token).digest("hex");
};
