import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Users } from "@prisma/client";

export const generateAccessToken = (user: Users, userMemberships: any[]) => {
  const organizations = userMemberships.map((membership) => ({
    id: membership.organization.id,
    name: membership.organization.name,
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

export const generateRefreshToken = (user: Users, jti: string) => {
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
  user: Users,
  jti: string,
  userMemberships: any[]
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
