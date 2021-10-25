import { DataForCharts, OrderForFeedback } from '../models'
import transporter from '../services/emailNotification'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient, Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import validator from 'email-validator'
import {
    createOrderSchema,
    updateOrderSchema,
    deleteOrderSchema,
    orderByFeedbackTokenSchema,
    allOrderSchema,
    allOrdersToTheMasterSchema,
    updateOrderStatusSchema,
    allOrdersToTheUserSchema,
    allOrderFiltredSchema,
    dataForDiagramSchema,
    dataForCityGraphSchema,
    dataForMasterGraphSchema,
    dataForMasterTableSchema,
} from './order.shape'
import { cloudinary } from '../utils/cloudinary'
import bcrypt from 'bcrypt'

const regName = new RegExp('[A-Za-zА-Яа-я]')
const date = new Date()
const hours = date.getHours()
const minutes = date.getMinutes()
const day = date.getDate()
const month = date.getMonth() + 1
const year = date.getFullYear()
const correctDate = `${year}-${month < 10 ? `0${month}` : `${month}`}-
${day < 10 ? `0${day}` : `${day}`} 
${hours < 10 ? `0${hours}` : `${hours}`}:
${minutes < 10 ? `0${minutes}` : `${minutes}`}`

const corDate = new Date(`${correctDate} UTC`)

const prisma = new PrismaClient()

class OrderController {
    async getOrder(req: Request, res: Response) {
        const orders = await prisma.order.findMany()

        res.status(200).json(orders)
    }

    async getOrderByFeedbackToken(req: Request, res: Response) {
        const params = orderByFeedbackTokenSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { feedbackToken } = req.query
        const orderByFeedbackToken = await prisma.$queryRaw<
            OrderForFeedback[]
        >`SELECT users.id AS "userId", orders.id, masters.name AS "masterName", cities.name AS "cityName", "clockSizes".name AS size, users.name AS "userName", users.email AS "userEmail", orders.price, orders."startAt" AS "startAt", orders."endAt" AS "endAt" FROM orders
                INNER JOIN masters ON orders."masterId" = masters.id
                INNER JOIN cities ON orders."cityId" = cities.id
                INNER JOIN "clockSizes" ON orders."clockSizeId" = "clockSizes".id
                INNER JOIN users ON orders."userId" = users.id
                WHERE orders."feedbackToken" = ${feedbackToken}`

        res.status(200).json(orderByFeedbackToken)
    }

    async getClockSizes(req: Request, res: Response) {
        const clockSizes = await prisma.clockSize.findMany()
        res.status(200).json(clockSizes)
    }

    async getAllOrderFiltred(req: Request, res: Response) {
        const params = allOrderFiltredSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const {
            offset,
            limit,
            cityId,
            masterId,
            clockSizeId,
            status,
            start,
            end,
        } = params.data

        const filterStartAt = new Date(`${start} UTC`)
        const filterEndAt = new Date(`${end} 23:59:59`)
        const Orders = await prisma.order.findMany({
            where: {
                active: true,
                AND: [
                    {
                        cityId: cityId ? Number(cityId) : undefined,
                    },
                    {
                        masterId: masterId ? Number(masterId) : undefined,
                    },
                    {
                        clockSizeId: clockSizeId
                            ? Number(clockSizeId)
                            : undefined,
                    },
                    {
                        status: status ? status : undefined,
                    },
                    {
                        startAt: start ? { gte: filterStartAt } : undefined,
                    },
                    {
                        endAt: end ? { lte: filterEndAt } : undefined,
                    },
                ],
            },
            orderBy: [{ id: 'desc' }],
            take: Number(limit),
            skip: Number(offset),
            select: {
                images: true,
                id: true,
                status: true,
                feedback: true,
                rating: true,
                price: true,
                startAt: true,
                endAt: true,
                master: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                clockSize: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                city: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })
        res.status(200).json(Orders)
    }

    async getAllOrder(req: Request, res: Response) {
        const params = allOrderSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { offset, limit } = params.data

        const orders = await prisma.order.findMany({
            where: {
                active: true,
            },
            orderBy: [{ id: 'desc' }],
            take: Number(limit),
            skip: Number(offset),
            select: {
                images: true,
                id: true,
                status: true,
                feedback: true,
                rating: true,
                price: true,
                startAt: true,
                endAt: true,
                master: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                clockSize: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                city: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        res.status(200).json(orders)
    }

    async getAllOrdersToTheMasterTable(req: Request, res: Response) {
        const params = allOrdersToTheMasterSchema.safeParse(req.query)
        if (params.success) {
            const { offset, limit, masterId } = params.data
            const orderListForOneMaster =
                await prisma.$queryRaw`SELECT orders.id, orders.status, orders.feedback, orders.rating, "clockSizeId", orders."cityId", masters.id AS "masterId", users.id AS "userId", masters.name AS "masterName", cities.name AS "cityName", "clockSizes".name AS size, users.name AS "userName", users.email AS "userEmail", orders.price, orders."startAt" AS "startAt", orders."endAt" AS "endAt", email FROM orders
                                                INNER JOIN masters ON orders."masterId" = masters.id
                                                INNER JOIN cities ON orders."cityId" = cities.id
                                                INNER JOIN "clockSizes" ON orders."clockSizeId" = "clockSizes".id
                                                INNER JOIN users ON orders."userId" = users.id
                                                WHERE orders."masterId" = ${Number(
                                                    masterId,
                                                )} AND orders.active = true
                                                ORDER BY orders.id DESC LIMIT ${Number(
                                                    limit,
                                                )} OFFSET ${Number(offset)}`
            res.status(200).json(orderListForOneMaster)
        } else {
            const { masterId } = req.query
            const orderListForOneMaster =
                await prisma.$queryRaw`SELECT (TO_CHAR(orders.id, '"Order#"99999')) AS title, orders.status, orders.feedback, orders.rating, masters.name AS "masterName", cities.name AS "cityName", "clockSizes".name AS size, users.name AS "userName", users.email AS "userEmail", orders.price, orders."startAt" AS "start", orders."endAt" AS "end", email FROM orders
                                                INNER JOIN masters ON orders."masterId" = masters.id
                                                INNER JOIN cities ON orders."cityId" = cities.id
                                                INNER JOIN "clockSizes" ON orders."clockSizeId" = "clockSizes".id
                                                INNER JOIN users ON orders."userId" = users.id
                                                WHERE orders."masterId" = ${Number(
                                                    masterId,
                                                )} AND orders.active = true
                                                ORDER BY orders.id`
            res.status(200).json(orderListForOneMaster)
        }
    }

    async getAllOrdersToTheUserTable(req: Request, res: Response) {
        allOrdersToTheUserSchema.parse(req.query)
        const { offset, limit, userId } = req.query
        const orderListForOneUser =
            await prisma.$queryRaw`SELECT orders."feedbackToken" AS "feedbackToken", orders.id, orders.status, orders.feedback, orders.rating, "clockSizeId", orders."cityId", masters.id AS "masterId", users.id AS "userId", masters.name AS "masterName", cities.name AS "cityName", "clockSizes".name AS size, users.name AS "userName", users.email AS "userEmail", orders.price, orders."startAt" AS "startAt", orders."endAt" AS "endAt", email FROM orders
                                                INNER JOIN masters ON orders."masterId" = masters.id
                                                INNER JOIN cities ON orders."cityId" = cities.id
                                                INNER JOIN "clockSizes" ON orders."clockSizeId" = "clockSizes".id
                                                INNER JOIN users ON orders."userId" = users.id
                                                WHERE orders."userId" = ${Number(
                                                    userId,
                                                )} AND orders.active = true
                                                ORDER BY orders.id DESC LIMIT ${Number(
                                                    limit,
                                                )} OFFSET ${Number(offset)}`
        res.status(200).json(orderListForOneUser)
    }

    async createOrder(req: Request, res: Response) {
        const params = createOrderSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { masterId, cityId, clockSizeId, startAt, name, email } =
            params.data
        const validationErrors = []
        const date = new Date(`${startAt} UTC`)
        const master = await prisma.master.findUnique({
            where: { id: Number(masterId) },
        })
        const city = await prisma.city.findUnique({
            where: { id: Number(cityId) },
        })
        const clockSize = await prisma.clockSize.findUnique({
            where: { id: Number(clockSizeId) },
        })

        if (!master) {
            validationErrors.push(`Master with id: ${masterId} is not exsisted`)
        }
        if (!city) {
            validationErrors.push(`City with id: ${cityId} is not exsisted`)
        }
        if (!clockSize) {
            validationErrors.push(
                `Clock size with id: ${clockSizeId} is not exsisted`,
            )
        }
        if (!regName.test(name)) {
            validationErrors.push('Invalid name')
        }
        if (
            date.getMinutes() !== 0 ||
            date.getSeconds() !== 0 ||
            date.getMilliseconds() !== 0 ||
            date < corDate
        ) {
            validationErrors.push('Invalid date or time')
        }
        if (!validator.validate(email)) {
            validationErrors.push('Invalid email')
        }
        if (validationErrors.length) {
            res.status(400).json(validationErrors)
        } else {
            const fileStr = req.body.images

            const imagesUrls: string[] = (
                await Promise.all<cloudinary.UploadApiResponse>(
                    fileStr.map((image: string) =>
                        cloudinary.v2.uploader.upload(image),
                    ),
                )
            ).map(response => response.url)

            const clockInfo = await prisma.clockSize.findUnique({
                where: { id: Number(clockSizeId) },
            })
            const feedbackToken = uuidv4()
            if (clockInfo) {
                const price = Number(clockInfo.price)
                const workTime = clockInfo.timeToDone
                const d = new Date(`${startAt} UTC`)
                const newOrderStartAt = new Date(`${startAt} UTC`)
                d.setHours(d.getHours() + workTime)
                const endAt = d
                const user = await prisma.user.findUnique({
                    where: { email: email },
                })
                if (user) {
                    const newOrder = await prisma.order.create({
                        data: {
                            userId: user.id,
                            masterId: Number(masterId),
                            cityId: Number(cityId),
                            clockSizeId: Number(clockSizeId),
                            price: price,
                            startAt: newOrderStartAt,
                            endAt: endAt,
                            feedbackToken: feedbackToken,
                            images: imagesUrls,
                        },
                    })
                    await transporter.sendMail({
                        from: process.env.NOTIFICATION_EMAIL,
                        to: email,
                        subject: 'confirm your order',
                        text: 'confirm order',
                        html: `<p>Click <a href="${process.env.SITE_URL}/rate/${feedbackToken}">here</a> to rate work</p>`,
                    })
                    res.status(201).json(newOrder)
                }

                if (!user) {
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
                    const newOrder = await prisma.order.create({
                        data: {
                            userId: newUser.id,
                            masterId: Number(masterId),
                            cityId: Number(cityId),
                            clockSizeId: Number(clockSizeId),
                            price: price,
                            startAt: newOrderStartAt,
                            endAt: endAt,
                            feedbackToken: feedbackToken,
                            images: imagesUrls,
                        },
                    })

                    await transporter.sendMail({
                        from: process.env.NOTIFICATION_EMAIL,
                        to: email,
                        subject: 'confirm your order',
                        text: `confirm order`,
                        html: `<p>your password: ${password}</p>`,
                    })
                    res.status(201).json(newOrder)
                }
            }
        }
    }

    async feedbackUpdate(req: Request, res: Response) {
        const { feedbackText, rating, id } = req.body
        const orderWithFeedback = await prisma.order.update({
            where: {
                id: Number(id),
            },
            data: {
                feedback: feedbackText,
                rating: Number(rating),
                feedbackToken: '',
            },
        })

        res.status(201).json(orderWithFeedback)
    }

    async updateOrder(req: Request, res: Response) {
        const params = updateOrderSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const {
            id,
            userId,
            masterId,
            cityId,
            clockSizeId,
            price,
            startAt,
            status,
        } = params.data
        const validationErrors = []
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
        })
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
        })
        const master = await prisma.master.findUnique({
            where: { id: Number(masterId) },
        })
        const city = await prisma.city.findUnique({
            where: { id: Number(cityId) },
        })
        const clockSize = await prisma.clockSize.findUnique({
            where: { id: Number(clockSizeId) },
        })
        if (typeof price !== 'number') {
            validationErrors.push('Invalid price')
        }
        if (!order) {
            validationErrors.push(`Order with id: ${id} is not exsisted`)
        }
        if (!user) {
            validationErrors.push(`User with id: ${userId} is not exsisted`)
        }
        if (!master) {
            validationErrors.push(`Master with id: ${masterId} is not exsisted`)
        }
        if (!city) {
            validationErrors.push(`City with id: ${cityId} is not exsisted`)
        }
        if (!clockSize) {
            validationErrors.push(
                `Clock size with id: ${clockSizeId} is not exsisted`,
            )
        }
        if (validationErrors.length) {
            res.status(400).json(validationErrors)
        } else {
            const user = await prisma.user.findUnique({
                where: { id: Number(userId) },
            })
            const clockInfo = await prisma.clockSize.findUnique({
                where: {
                    id: clockSizeId,
                },
            })
            if (clockInfo) {
                const workTime = clockInfo.timeToDone
                const d = new Date(`${startAt} UTC`)
                d.setHours(d.getHours() + workTime)
                const newOrderEndAt = d.toISOString()
                const newOrderStartAt = new Date(`${startAt} UTC`)

                const upOrder = await prisma.order.update({
                    where: {
                        id: Number(id),
                    },
                    data: {
                        userId: Number(userId),
                        masterId: Number(masterId),
                        cityId: Number(cityId),
                        clockSizeId: Number(clockSizeId),
                        price: Number(price),
                        startAt: newOrderStartAt,
                        endAt: newOrderEndAt,
                        status: status,
                    },
                })
                status === 'Completed' &&
                    (await transporter.sendMail({
                        from: process.env.NOTIFICATION_EMAIL,
                        to: user?.email,
                        subject: 'your order now has a status completed',
                        text: 'your order now has a status completed',
                        html: `<p>Click <a href="${process.env.SITE_URL}/rate/${order?.feedbackToken}">here</a> to rate work</p>`,
                    }))

                res.status(201).json(upOrder)
            }
        }
    }

    async updateOrderStatus(req: Request, res: Response) {
        const params = updateOrderStatusSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { id, email } = params.data
        const validationErrors = []
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
        })
        if (!order) {
            validationErrors.push(`Order with id: ${id} is not exsisted`)
        }
        if (validationErrors.length) {
            res.status(400).json(validationErrors)
        } else {
            const orderWithNewStatus = await prisma.order.update({
                where: {
                    id: Number(id),
                },
                data: {
                    status: 'Completed',
                },
            })

            await transporter.sendMail({
                from: process.env.NOTIFICATION_EMAIL,
                to: email,
                subject: 'your order now has a status completed',
                text: 'your order now has a status completed, you can rate master',
                html: `<p>Click <a href="${process.env.SITE_URL}/rate/${order?.feedbackToken}">here</a> to rate work</p>`,
            })

            res.status(200).json(orderWithNewStatus)
        }
    }

    async deleteOrder(req: Request, res: Response) {
        const params = deleteOrderSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { id } = params.data
        const delOrder = await prisma.order.update({
            where: {
                id: Number(id),
            },
            data: {
                active: false,
            },
        })

        res.status(204).json(delOrder)
    }

    async getDataForMasterDiagram(req: Request, res: Response) {
        const params = dataForDiagramSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { start, end } = params.data
        const firstDay = new Date(`${start} UTC`)
        const lastDay = new Date(`${end} 23:59:59`)
        const DataForMasterDiagram = await prisma.$queryRaw<DataForCharts[]>`
            (SELECT COUNT(*) AS count, masters.name FROM orders  
            INNER JOIN masters ON orders."masterId" = masters.id
            WHERE "startAt" >= ${firstDay} AND "endAt" <= ${lastDay}
            GROUP BY masters.name
            ORDER BY count DESC LIMIT 3)
            UNION
            (SELECT SUM(count) AS count, 'other' as name FROM (
            SELECT COUNT(*) AS count, masters.name FROM orders
            INNER JOIN masters ON orders."masterId" = masters.id
            WHERE "startAt" >= ${firstDay} AND "endAt" <= ${lastDay}
            GROUP BY masters.name
            ORDER BY count DESC OFFSET 3) AS result)
            `

        res.status(200).json(DataForMasterDiagram)
    }

    async getDataForCityDiagram(req: Request, res: Response) {
        const params = dataForDiagramSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { start, end } = params.data
        const firstDay = new Date(`${start} UTC`)
        const lastDay = new Date(`${end} 23:59:59`)
        const DataForMasterDiagram = await prisma.$queryRaw<DataForCharts[]>`
            (SELECT COUNT(*) AS count, cities.name FROM orders  
            INNER JOIN cities ON orders."cityId" = cities.id
            WHERE "startAt" >= ${firstDay} AND "endAt" <= ${lastDay}
            GROUP BY cities.name
            ORDER BY count DESC)
            `

        res.status(200).json(DataForMasterDiagram)
    }

    async getDataForCityGraph(req: Request, res: Response) {
        const params = dataForCityGraphSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { start, end, citiesId } = params.data
        const startDate = new Date(`${start} UTC`)
        const endDate = new Date(`${end} 23:59:59`)

        const dataForCityGraph = await prisma.$queryRaw<DataForCharts[]>`
        select date::date, (SELECT COUNT(*) 
            FROM orders 
            WHERE "cityId" IN (${Prisma.join(citiesId)}) 
            AND DATE("startAt") = date) from generate_series(${startDate}::date,
            ${endDate}::date,
            '1 day'::interval) AS date
        `
        res.status(200).json(dataForCityGraph)
    }

    async getDataForMasterGraph(req: Request, res: Response) {
        const params = dataForMasterGraphSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { start, end, mastersId } = params.data
        const startDate = new Date(`${start} UTC`)
        const endDate = new Date(`${end} 23:59:59`)

        const dataForMasterGraph = await prisma.$queryRaw<DataForCharts[]>`
        SELECT date::date, (SELECT COUNT(*) 
            FROM orders 
            WHERE "masterId" IN (${Prisma.join(mastersId)}) 
            AND DATE("startAt") = date) FROM generate_series(${startDate}::date,
            ${endDate}::date,
            '1 day'::interval) AS date
        `
        res.status(200).json(dataForMasterGraph)
    }

    async getDataForMasterTable(req: Request, res: Response) {
        const params = dataForMasterTableSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { limit, offset } = params.data
        const dataForMasterTable = await prisma.$queryRaw`
        SELECT masters.id, masters.name AS name, (	
            SELECT COUNT(*) FROM orders 
            WHERE orders."clockSizeId" = 1 AND orders."masterId" = masters.id
            ) AS "countClockSizeSmallOrders", (	
                SELECT COUNT(*) FROM orders 
                WHERE orders."clockSizeId" = 2 AND orders."masterId" = masters.id
            ) AS "countClockSizeMiddleOrders", (	
                SELECT COUNT(*) FROM orders 
                WHERE orders."clockSizeId" = 3 AND orders."masterId" = masters.id
            ) AS "countClockSizeLargeOrders", (	
                SELECT COUNT(*) FROM orders 
                WHERE orders.status = 'COMPLETED' AND orders."masterId" = masters.id
            ) AS "countCompletedOrders", (	
                SELECT COUNT(*) FROM orders 
                WHERE orders.status != 'COMPLETED' AND orders."masterId" = masters.id
            ) AS "countNotCompletedOrders", (
                SELECT SUM(orders.price) FROM orders
                WHERE orders.status = 'COMPLETED' AND orders."masterId" = masters.id
            ) AS profit, AVG(orders.rating) AS rating
                    FROM orders 
                    RIGHT JOIN masters ON orders."masterId" = masters.id
                    GROUP BY masters.name, masters.id
                    ORDER BY masters.name DESC
                    LIMIT ${Number(limit)} OFFSET ${Number(offset)}
        `
        res.status(200).json(dataForMasterTable)
    }
}
export default new OrderController()
