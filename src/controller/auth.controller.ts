import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'

const prisma = new PrismaClient()

const exp = { expiresIn: '2h' }

class AuthController {
    async checkAccessToken(req: Request, res: Response, next: NextFunction) {
        if (!process.env.SECRET_KEY) {
            throw new Error('Secret jwt key is not provided')
        }
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                res.status(401).send()
            } else if (jwt.verify(token, process.env.SECRET_KEY)) {
                const role = await prisma.person.findMany({
                    where: {
                        token: token,
                    },
                })
                if (!role) {
                    res.status(401).send()
                }
                if (
                    (req.url.split('/')[1] === 'admin' &&
                        role[0].role === 'ADMIN') ||
                    (req.url.split('/')[1] === 'master' &&
                        role[0].role === 'MASTER') ||
                    (req.url.split('/')[1] === 'user' &&
                        role[0].role === 'USER')
                ) {
                    next()
                }
            }
        } else {
            res.status(401).send()
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body
        if (!process.env.SECRET_KEY) {
            throw new Error('Secret jwt key is not provided')
        }
        const foundPerson = await prisma.person.findUnique({
            where: {
                login: email,
            },
        })
        if (foundPerson?.role === 'ADMIN') {
            const dbPass = foundPerson.password
            const ifCompare = await bcrypt.compare(password, dbPass)
            if (ifCompare) {
                const token = jwt.sign({}, process.env.SECRET_KEY, exp)
                await prisma.person.update({
                    where: {
                        id: foundPerson.id,
                    },
                    data: {
                        token: token,
                    },
                })
                res.set({
                    Authorization: `Bearer ${token}`,
                })
                    .status(200)
                    .json(foundPerson)
            } else {
                res.status(400).json({
                    massage: 'login or password is not valid',
                })
            }
        } else if (foundPerson?.role === 'MASTER') {
            const masterPassword = foundPerson.password
            const ifCompare = await bcrypt.compare(password, masterPassword)
            if (ifCompare) {
                const token = jwt.sign({}, process.env.SECRET_KEY, exp)
                const master = await prisma.master.findMany({
                    where: {
                        personId: +foundPerson.id,
                    },
                })
                const result = {
                    role: foundPerson.role,
                    name: master[0].name,
                    id: master[0].id,
                }
                await prisma.person.update({
                    where: {
                        id: foundPerson.id,
                    },
                    data: {
                        token: token,
                    },
                })
                res.set({ Authorization: `Bearer ${token}` })
                    .status(200)
                    .json(result)
            }
        } else if (foundPerson?.role === 'USER') {
            const userPassword = foundPerson.password
            const ifCompare = await bcrypt.compare(password, userPassword)
            if (ifCompare) {
                const token = jwt.sign({}, process.env.SECRET_KEY, exp)
                const user = await prisma.user.findMany({
                    where: {
                        personId: +foundPerson.id,
                    },
                })
                const result = {
                    role: foundPerson.role,
                    name: user[0].name,
                    id: user[0].id,
                }
                await prisma.person.update({
                    where: {
                        id: foundPerson.id,
                    },
                    data: {
                        token: token,
                    },
                })
                res.set({ Authorization: `Bearer ${token}` })
                    .status(200)
                    .json(result)
            } else {
                res.status(400).json({
                    massage: 'login or password is not valid',
                })
            }
        } else {
            res.status(400).send()
        }
    }
}

export default new AuthController()
