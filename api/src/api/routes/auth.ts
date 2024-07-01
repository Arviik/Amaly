import express from "express";
import { v4 as uuidv4 } from "uuid";
import { findUserByEmail, findUserById } from "../services/users-services";
import { generateTokens, hashToken } from "../../utils/token";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
  revokeTokens,
} from "../services/auth-services";
import {
  loginValidation,
  refreshTokenValidation,
  revokeRefreshTokenValidation,
} from "../validators/auth-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/auth-middleware";
import { authzMiddleware } from "../middlewares/authz-middleware";

export const initAuth = (app: express.Express) => {
  app.post(
    "/auth/login",
    async (req: express.Request, res: express.Response) => {
      try {
        const validation = loginValidation.validate(req.body);
        if (validation.error) {
          return res.status(400).send({ error: validation.error });
        }

        const loginRequest = validation.value;
        const existingUser = await findUserByEmail(loginRequest.email);
        if (!existingUser) {
          return res.status(403).send({ error: "Invalid login credentials" });
        }

        const validPassword = await bcrypt.compare(
          loginRequest.password,
          existingUser.password
        );
        if (!validPassword) {
          return res.status(403).send({ error: "Invalid login credentials" });
        }

        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(existingUser, jti);
        await addRefreshTokenToWhitelist({
          jti,
          refreshToken,
          userId: existingUser.id,
        });

        return res.json({
          accessToken,
          refreshToken,
        });
      } catch (error) {
        return res.status(500).send({ error: error });
      }
    }
  );

  app.post(
    "/auth/refreshToken",
    async (req: express.Request, res: express.Response) => {
      try {
        const validation = refreshTokenValidation.validate(req.body);
        if (validation.error) {
          return res.status(400).send({ error: validation.error });
        }

        const refreshTokenRequest = validation.value;
        const payload: any = jwt.verify(
          refreshTokenRequest.token,
          process.env.JWT_REFRESH_SECRET!
        );
        const savedRefreshToken = await findRefreshTokenById(payload.jti);
        if (!savedRefreshToken || savedRefreshToken.revoked === true) {
          return res.status(401).send({ error: "Refresh token revoked" });
        }

        const hashedToken = hashToken(refreshTokenRequest.token);
        if (hashedToken !== savedRefreshToken.hashed_token) {
          return res.status(401).send({ error: "Refresh token invalid" });
        }

        const user = await findUserById(payload.userId);
        if (!user) {
          return res.status(401).send({ error: "Refresh token invalid" });
        }

        await deleteRefreshToken(savedRefreshToken.id);
        const jti = uuidv4();
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(
          user,
          jti
        );
        await addRefreshTokenToWhitelist({
          jti,
          refreshToken: newRefreshToken,
          userId: user.id,
        });

        return res.json({
          accessToken,
          refreshToken: newRefreshToken,
        });
      } catch (error) {
        return res.status(400).send({ error: "Refresh token invalid" });
      }
    }
  );

  app.post(
    "/auth/revokeRefreshToken",
    async (req: express.Request, res: express.Response) => {
      try {
        const validation = revokeRefreshTokenValidation.validate(req.body);
        if (validation.error) {
          return res.status(400).send({ error: validation.error });
        }

        const revokeRefreshTokenRequest = validation.value;
        await revokeTokens(revokeRefreshTokenRequest.userId);

        return res.json({
          message: `Refresh token revoked for user with id #${revokeRefreshTokenRequest.userId}`,
        });
      } catch (error) {
        return res.status(500).send({ error: error });
      }
    }
  );

  app.get(
    "/auth/check",
    authMiddleware,
    authzMiddleware(["ADMIN", "SUPER_ADMIN", "USER"]),
    async (req: express.Request, res: express.Response) => {
      try {
        const payload = (req as any).payload;
        return res.json(payload);
      } catch (error) {
        return res.status(500).send({ error: error });
      }
    }
  );
};
