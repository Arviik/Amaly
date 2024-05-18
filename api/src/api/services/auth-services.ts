import {prisma} from "../../utils/prisma"
import {hashToken} from "../../utils/token"

export const addRefreshTokenToWhitelist = ({jti, refreshToken, userId}: any) => {
    return prisma.refreshToken.create({
        data: {
            id: jti,
            hashed_token: hashToken(refreshToken),
            user_id: userId
        }
    })
}

export const findRefreshTokenById = (id: string) => {
    return prisma.refreshToken.findUnique({
        where: {
            id,
        }
    })
}

export const deleteRefreshToken = (id: string) => {
    return prisma.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true
        }
    })
}

export const revokeTokens = (userId: number) => {
    return prisma.refreshToken.updateMany({
        where: {
            user_id: userId
        },
        data: {
            revoked: true
        }
    })
}
