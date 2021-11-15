import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { MasterWithRating } from '../models'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
    createMasterSchema,
    deleteMasterSchema,
    getMastersSchema,
    getFreeMastersSchema,
    searchForMastersByNameSchema,
} from './master.shape'

const prisma = new PrismaClient()

class MasterController {
    async getMasters(req: Request, res: Response) {
        const params = getMastersSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { limit, offset } = params.data
        const masters = await prisma.master.findMany({
            skip: Number(offset),
            take: Number(limit),
            select: {
                id: true,
                name: true,
                cityId: true,
                city: { select: { name: true } },
            },
        })
        const countAllMasters = await prisma.master.count()
        const result = { total: countAllMasters, masters: masters }
        res.status(200).json(result)
    }

    async getAllMasters(req: Request, res: Response) {
        const masters = await prisma.master.findMany()
        res.status(200).json(masters)
    }

    async searchForMastersByName(req: Request, res: Response) {
        const params = searchForMastersByNameSchema.safeParse(req.query)
        if (params.success) {
            const { searchString, limit, offset } = params.data
            const findedMasters = await prisma.master.findMany({
                where: {
                    name: { contains: searchString },
                },
                take: Number(limit),
                skip: Number(offset),
            })
            res.status(200).json(findedMasters)
        }
    }

    async getFreeMasters(req: Request, res: Response) {
        const params = getFreeMastersSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { cityId, startAt, endAt, orderId } = params.data
        const newOrderEndAt = new Date(`${endAt}`)
        const newOrderStartAt = new Date(`${startAt}`)
        let busyMastersId: number[] = []
        if (orderId) {
            const masterIdInOrders = await prisma.order.findMany({
                where: {
                    cityId: Number(cityId),
                    NOT: { id: Number(orderId) },
                    OR: [
                        {
                            startAt: { lt: newOrderEndAt },
                            endAt: { gt: newOrderEndAt },
                        },
                        {
                            startAt: { lt: newOrderStartAt },
                            endAt: { gt: newOrderStartAt },
                        },
                        {
                            startAt: newOrderStartAt,
                        },
                    ],
                },
            })
            busyMastersId = masterIdInOrders.map(elem => elem.masterId)
        } else {
            const gOrderMasterId = await prisma.order.findMany({
                where: {
                    cityId: Number(cityId),
                    OR: [
                        {
                            startAt: { lt: newOrderEndAt },
                            endAt: { gt: newOrderEndAt },
                        },
                        {
                            startAt: { lt: newOrderStartAt },
                            endAt: { gt: newOrderStartAt },
                        },
                        {
                            startAt: newOrderStartAt,
                        },
                    ],
                },
            })
            busyMastersId = gOrderMasterId.map(elem => elem.masterId)
        }
        if (busyMastersId.length) {
            const allFreeMastersWithRating = await prisma.$queryRaw<
                MasterWithRating[]
            >`
                    SELECT "masters"."id",
                    "masters"."name", 
                    "masters"."cityId", 
                    AVG("orders"."rating") AS "rating" 
                    FROM "orders"
                    RIGHT JOIN "masters" ON "masters"."id" = "orders"."masterId"
                    WHERE "masters"."cityId" = ${Number(cityId)} 
                    AND "masters"."id" NOT IN (${Number(
                        busyMastersId.join(','),
                    )})
                    GROUP BY "masters"."id"
                `

            res.status(200).json(allFreeMastersWithRating)
        } else {
            const allFreeMastersWithRating = await prisma.$queryRaw<
                MasterWithRating[]
            >`
                SELECT masters.id, 
                masters.name, 
                masters."cityId", 
                AVG(orders.rating) AS rating 
                FROM orders
                RIGHT JOIN masters ON masters.id = orders."masterId"
                WHERE masters."cityId" = ${Number(cityId)}
                GROUP BY masters.id
            `

            res.status(200).json(allFreeMastersWithRating)
        }
    }

    async createMasters(req: Request, res: Response) {
        const params = createMasterSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { name, cityId, login, password } = params.data
        const validationErrors = []
        const city = await prisma.city.findUnique({
            where: { id: Number(cityId) },
        })
        const isUnique = await prisma.person.findUnique({
            where: { email: login },
        })
        if (isUnique) {
            validationErrors.push(`Master with this email exsist`)
        }
        if (!city) {
            validationErrors.push(`City with id: ${cityId} is not exsisted`)
        }
        if (validationErrors.length) {
            res.status(400).json(validationErrors)
        }
        const token = jwt.sign(
            {},
            process.env.SECRET_KEY ? process.env.SECRET_KEY : 'key',
            { expiresIn: '2h' },
        )
        const salt2 = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt2)
        const newPersonMaste = await prisma.person.create({
            data: {
                email: login,
                password: hash,
                role: 'MASTER',
                token: token,
            },
        })
        const newMaster = await prisma.master.create({
            data: {
                name: name,
                cityId: +cityId,
                personId: +newPersonMaste.id,
            },
        })

        res.set({ Authorization: `Bearer ${token}` })
            .status(200)
            .json(newMaster)
    }

    async deleteMaster(req: Request, res: Response) {
        const params = deleteMasterSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { id } = params.data
        const master = await prisma.master.findUnique({
            where: { id: Number(id) },
        })
        if (!master) {
            res.status(400).json({
                message: `Master with that Id does not exist`,
            })
        } else {
            const delMaster = await prisma.master.delete({
                where: { id: Number(id) },
            })

            res.status(204).json(delMaster)
        }
    }
}

export default new MasterController()
