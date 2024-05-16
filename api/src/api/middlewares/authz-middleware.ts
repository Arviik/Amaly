import {NextFunction, Request, Response} from "express"
import {Role} from "@prisma/client"

export const authzMiddleware = function (role: Role | Role[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const payload = (req as any).payload

        if (!payload?.userRole) {
            return res.status(401).send({error: 'Unauthorized'})
        }

        if (Array.isArray(role) ? !role.includes(payload.userRole) : payload.userRole !== role) {
            return res.status(403).json({error: "Forbidden"})
        }

        return next()
    }
}
