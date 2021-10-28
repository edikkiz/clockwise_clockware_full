import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import {
    createUserSchema,
    updateUserSchema,
    deleteUserSchema,
    getUsersSchema,
} from './user.shape'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

class UserController {
    async getUsers(req: Request, res: Response) {
        const params = getUsersSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { limit, offset } = params.data
        const users = await prisma.user.findMany({
            take: Number(limit),
            skip: Number(offset),
        })

        res.status(200).json(users)
    }

    async createUser(req: Request, res: Response) {
        const params = createUserSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { name, email } = params.data

        const isUserExsist = await prisma.user.findUnique({
            where: { email: email },
        })
        if (!isUserExsist) {
            const password = uuidv4()
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const newUserRole = await prisma.person.create({
                data: {
                    email: email,
                    password: hash,
                    role: 'USER',
                },
            })
            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    personId: Number(newUserRole.id),
                },
            })
            res.status(201).json(newUser)
        } else {
            res.status(200).json(isUserExsist)
        }
    }

    async updateUser(req: Request, res: Response) {
        const params = updateUserSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { name, email, id } = params.data
        const validationErrors = []
        const user = await prisma.user.findUnique({ where: { id: Number(id) } })
        if (!user) {
            validationErrors.push(`User with id: ${id} is not exsisted`)
        }
        if (validationErrors.length) {
            res.status(400).json(validationErrors)
        } else {
            const userForUpdate = await prisma.user.update({
                where: {
                    id: Number(id),
                },
                data: {
                    name: name,
                    email: email,
                },
            })
            await prisma.person.update({
                where: {
                    id: Number(userForUpdate?.personId),
                },
                data: {
                    email: email,
                },
            })
            res.status(201).json()
        }
    }

    async deleteUser(req: Request, res: Response) {
        const params = deleteUserSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { id } = params.data
        const validationErrors = []
        const user = await prisma.user.findUnique({ where: { id: Number(id) } })
        if (!user) {
            validationErrors.push(`User with id: ${id} is not exsisted`)
        }
        if (validationErrors.length) {
            res.status(400).json(validationErrors)
        } else {
            await prisma.user.delete({
                where: { id: Number(id) },
            })
            res.status(204).send()
        }
    }
}

export default new UserController()
