import jwt from "jsonwebtoken"
import crypto from "crypto"
import {Users} from "@prisma/client"

export const generateAccessToken = (user: Users) => {
    return jwt.sign({
        userId: user.id,
        userRole: user.role,
    }, process.env.JWT_ACCESS_SECRET!, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
    })
}

export const generateRefreshToken = (user: Users, jti: string) => {
    return jwt.sign({
        userId: user.id,
        jti
    }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE
    })
}

export const generateTokens = (users: Users, jti: string) => {
    const accessToken = generateAccessToken(users)
    const refreshToken = generateRefreshToken(users, jti)

    return {
        accessToken,
        refreshToken
    }
}

export const hashToken = (token: string) => {
    return crypto.createHash("sha512").update(token).digest("hex")
}
