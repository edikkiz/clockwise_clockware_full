import { ChartsData, OrderForFeedback } from './../models/models'
import transporter from '../services/emailNotification'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient, Master, Order } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import validator from 'email-validator'
import { createOrderSchema, updateOrderSchema, deleteOrderSchema, orderByFeedbackTokenSchema, allOrderSchema, allOrdersToTheMasterSchema, updateOrderStatusSchema, allOrdersToTheUserSchema, allOrderFiltredSchema, allOrderChartsSchema } from './order.shape';
import { cloudinary } from '../utils/cloudinary'
import bcrypt from 'bcrypt'

const regPrice = new RegExp("[0-9]")
const regName = new RegExp("[A-Za-zА-Яа-я]")
const date = new Date()
const hours = date.getHours()
const minutes = date.getMinutes()
const day = date.getDate()
const month = date.getMonth() + 1
const year = date.getFullYear()
const correctDate = `${year}-${month < 10 ? `0${month}` : `${month}`}-${day < 10 ? `0${day}` : `${day}`
    } ${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`
    }`
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
        const orderByFeedbackToken = await prisma.$queryRaw<OrderForFeedback[]>
            `SELECT users.id AS "userId", orders.id, masters.name AS "masterName", cities.name AS "cityName", "clockSizes".size, users.name AS "userName", users.email AS "userEmail", orders.price, (TO_CHAR(orders."startAt",'YYYY-MM-DD THH24:MI')) AS "startAt", (TO_CHAR(orders."endAt", \'YYYY-MM-DDT HH24:MI'\)) AS "endAt" FROM orders
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

    async getAllOrderCharts(req: Request, res: Response) {
        const params = allOrderChartsSchema.safeParse(req.body)
        console.log(req.body)
        if (!params.success) {
            return
        }
        const {
            cityId,
            masterId,
            filterStart,
            filterEnd,
        } = params.data
        if (filterStart && filterEnd) {
            let filterStartDay = new Date(`${filterStart} UTC`)
            let filterEndDay = new Date(`${filterStart} 23:59:59`)
            const filterEndAt = new Date(`${filterEnd} UTC`)
            const result: ChartsData[] = []
            for (; filterStartDay <= filterEndAt; filterStartDay.setDate(filterStartDay.getDate() + 1), filterEndDay.setDate(filterEndDay.getDate() + 1)) {
                const filteredCharts = await prisma.order.aggregate({
                    where: {
                        AND: [
                            {
                                cityId: cityId?.length ? { in: cityId } : undefined,
                            },
                            {
                                masterId: masterId?.length ? { in: masterId } : undefined,
                            },
                            {
                                startAt: filterStartDay
                                    ? { gte: filterStartDay }
                                    : undefined,
                                AND: {
                                    startAt: filterEndDay
                                        ? { lte: filterEndDay }
                                        : undefined
                                }
                            },
                        ],
                    },

                    _count: { id: true }
                })
                result.push({
                    date: filterStartDay.toLocaleDateString(),
                    count: filteredCharts._count.id
                })
            }

            res.status(200).json(result)
        }
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
            filterStart,
            filterEnd,
        } = params.data

        const filterStartAt = new Date(`${filterStart} UTC`)
        const filterEndAt = new Date(`${filterEnd} 23:59:59`)
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
                        startAt: filterStart
                            ? { gte: filterStartAt }
                            : undefined,
                    },
                    {
                        endAt: filterEnd ? { lte: filterEndAt } : undefined,
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
                        size: true,
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
        if (params.success) {
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
                            size: true,
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
        else {
            const orders = await prisma.order.findMany({
                where: {
                    active: true,
                },
                orderBy: [{ id: 'desc' }],
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
                            size: true,
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
    }

    async getAllOrdersToTheMasterTable(req: Request, res: Response) {
        const params = allOrdersToTheMasterSchema.safeParse(req.query)
        if (params.success) {
            const { offset, limit, masterId } = params.data
            const orderListForOneMaster =
                await prisma.$queryRaw`SELECT orders.id, orders.status, orders.feedback, orders.rating, "clockSizeId", orders."cityId", masters.id AS "masterId", users.id AS "userId", masters.name AS "masterName", cities.name AS "cityName", "clockSizes".size, users.name AS "userName", users.email AS "userEmail", orders.price, (TO_CHAR(orders."startAt",'YYYY-MM-DD HH24:MI')) AS "startAt", (TO_CHAR(orders."endAt", \'YYYY-MM-DD HH24:MI'\)) AS "endAt", email FROM orders
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
                await prisma.$queryRaw`SELECT (TO_CHAR(orders.id, '"Order#"99999')) AS title, orders.status, orders.feedback, orders.rating, masters.name AS "masterName", cities.name AS "cityName", "clockSizes".size, users.name AS "userName", users.email AS "userEmail", orders.price, (TO_CHAR(orders."startAt",'YYYY-MM-DD HH24:MI')) AS "start", (TO_CHAR(orders."endAt", \'YYYY-MM-DD HH24:MI'\)) AS "end", email FROM orders
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
            await prisma.$queryRaw`SELECT orders."feedbackToken" AS "feedbackToken", orders.id, orders.status, orders.feedback, orders.rating, "clockSizeId", orders."cityId", masters.id AS "masterId", users.id AS "userId", masters.name AS "masterName", cities.name AS "cityName", "clockSizes".size, users.name AS "userName", users.email AS "userEmail", orders.price, (TO_CHAR(orders."startAt",'YYYY-MM-DD HH24:MI')) AS "startAt", (TO_CHAR(orders."endAt", \'YYYY-MM-DD HH24:MI'\)) AS "endAt", email FROM orders
                                                INNER JOIN masters ON orders."masterId" = masters.id
                                                INNER JOIN cities ON orders."cityId" = cities.id
                                                INNER JOIN "clockSizes" ON orders."clockSizeId" = "clockSizes".id
                                                INNER JOIN users ON orders."userId" = users.id
                                                WHERE orders."userId" = ${Number(userId)} AND orders.active = true
                                                ORDER BY orders.id DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
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
        }
        else {
            const fileStr = req.body.images

            const imagesUrls: string[] = (
                await Promise.all<cloudinary.UploadApiResponse>(
                    fileStr.map((image: string) => cloudinary.v2.uploader.upload(image)))
            ).map((response) => response.url)

            const clockInfo = await prisma.clockSize.findUnique({ where: { id: Number(clockSizeId) } })
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
                            login: email,
                            password: hash,
                            role: "USER"
                        }
                    })
                    const newUser = await prisma.user.create({
                        data: {
                            name: name,
                            email: email,
                            personId: Number(newUserRole.id)
                        }
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
                        html: `<p>your password: ${password}</p>`
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
                feedbackToken: ''
            }
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
                        status: status
                    }
                })
                status === "COMPLETED" && (await transporter.sendMail({
                    from: process.env.NOTIFICATION_EMAIL,
                    to: user?.email,
                    subject: 'your order now has a status completed',
                    text: 'your order now has a status completed',
                    html: `<p>Click <a href="${process.env.SITE_URL}/rate/${order?.feedbackToken}">here</a> to rate work</p>`
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
                    status: 'COMPLETED',
                },
            })

            await transporter.sendMail({
                from: process.env.NOTIFICATION_EMAIL,
                to: email,
                subject: 'your order now has a status completed',
                text: 'your order now has a status completed, you can rate master',
                html: `<p>Click <a href="${process.env.SITE_URL}/rate/${order?.feedbackToken}">here</a> to rate work</p>`
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
}

export default new OrderController()
