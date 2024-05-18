import bcrypt from "bcrypt"
import {prisma} from "../../utils/prisma"

export const findUserByEmail = (email: string) => {
    return prisma.users.findFirst({
        where: {email}
    })
}

export const createUserByEmailAndPassword = (user: any) => {
    user.password = bcrypt.hashSync(user.password, 12)
    return prisma.users.create({
        data: user
    })
}

export const findUserById = (id: number) => {
    return prisma.users.findUnique({
        where: {id}
    })
}
