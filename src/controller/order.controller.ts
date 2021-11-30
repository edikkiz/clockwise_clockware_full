import { DataForCharts } from '../models'
import sendMail from '../services/sendMail'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient, Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import {
    updateOrderSchema,
    deleteOrderSchema,
    orderByFeedbackTokenSchema,
    allOrdersToTheMasterSchema,
    updateOrderStatusSchema,
    allOrdersToTheUserSchema,
    allOrderFiltredSchema,
    dataForDiagramSchema,
    dataForCityGraphSchema,
    dataForMasterGraphSchema,
    dataForMasterTableSchema,
    orderFeedbackSchema,
    addPhotoInOrderSchema,
    allOrdersToTheMasterCalendarSchema,
    sendCheckPdfFileSchema,
} from './order.shape'
import { cloudinary } from '../utils/cloudinary'
import bcrypt from 'bcrypt'
import { startOfDay, endOfDay } from 'date-fns'
import Stripe from 'stripe'
import pdf from 'html-pdf'
import { orderCheckPdf } from '../pdf/pdf'

const prisma = new PrismaClient()
const sendEmailIfStatusCompleted = async (
    email: string,
    feedbackToken: string,
    buffer?: Buffer,
    fileName?: string,
) => {
    await sendMail(
        email,
        'your order now has a status completed',
        'your order now has a status completed, you can rate master',
        `<p>Click <a href="${process.env.SITE_URL}/rate/${feedbackToken}">here</a> to rate work</p>`,
        `${fileName}.pdf`,
        buffer,
    )
}

class OrderController {
    async getOrderByFeedbackToken(req: Request, res: Response) {
        const params = orderByFeedbackTokenSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { feedbackToken } = params.data
        const orderByFeedbackToken = await prisma.order.findUnique({
            where: {
                feedbackToken: feedbackToken,
            },
            include: {
                master: true,
                city: true,
                clockSize: true,
                user: true,
            },
        })
        res.status(200).json(orderByFeedbackToken)
    }

    async getClockSizes(req: Request, res: Response) {
        const clockSizes = await prisma.clockSize.findMany()
        res.status(200).json(clockSizes)
    }

    async getAllOrders(req: Request, res: Response) {
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
        const filterStartAt = new Date(`${start}`)
        const filterEndAt = new Date(`${end} 23:59:59`)
        const filter = {
            active: true,
            AND: [
                {
                    cityId: cityId ? Number(cityId) : undefined,
                },
                {
                    masterId: masterId ? Number(masterId) : undefined,
                },
                {
                    clockSizeId: clockSizeId ? Number(clockSizeId) : undefined,
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
        }
        const Orders = await prisma.order.findMany({
            where: filter,
            orderBy: [{ id: 'desc' }],
            take: Number(limit),
            skip: Number(offset),
            include: {
                master: true,
                city: true,
                clockSize: true,
                user: true,
            },
        })
        const countOrders = await prisma.order.count({
            where: filter,
        })
        const result = { total: countOrders, orders: Orders }
        res.status(200).json(result)
    }

    async getAllOrdersToTheMasterTable(req: Request, res: Response) {
        const params = allOrdersToTheMasterSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { offset, limit, masterId } = params.data
        const filter = { masterId: Number(masterId), active: true }
        const orderListForOneMaster = await prisma.order.findMany({
            where: filter,
            include: {
                master: {
                    select: { name: true, person: { select: { email: true } } },
                },
                city: true,
                clockSize: true,
                user: true,
            },
            orderBy: { id: 'desc' },
            take: Number(limit),
            skip: Number(offset),
        })
        const countOrders = await prisma.order.count({
            where: filter,
        })
        const result = {
            total: countOrders,
            orders: orderListForOneMaster,
        }
        res.status(200).json(result)
    }

    async getAllOrdersToTheMasterCalendar(req: Request, res: Response) {
        const params = allOrdersToTheMasterCalendarSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { masterId } = params.data
        const orderListForOneMaster =
            await prisma.$queryRaw`SELECT (TO_CHAR(orders.id, '"Order#"99999')) AS title, 
                    orders.status, 
                    orders.feedback, 
                    orders.rating, 
                    masters.name AS "masterName", 
                    cities.name AS "cityName", 
                    "clockSizes".name, 
                    users.name AS "userName", 
                    users.email AS "userEmail", 
                    orders.price, 
                    orders."startAt" AS "start", 
                    orders."endAt" AS "end", 
                    email 
                    FROM orders
                    INNER JOIN masters ON orders."masterId" = masters.id
                    INNER JOIN cities ON orders."cityId" = cities.id
                    INNER JOIN "clockSizes" ON orders."clockSizeId" = "clockSizes".id
                    INNER JOIN users ON orders."userId" = users.id
                    WHERE orders."masterId" = ${Number(masterId)} 
                    AND orders.active = true
                    ORDER BY orders.id`

        res.status(200).json(orderListForOneMaster)
    }

    async getAllOrdersToTheUserTable(req: Request, res: Response) {
        allOrdersToTheUserSchema.parse(req.query)
        const { offset, limit, userId } = req.query
        const filter = { userId: Number(userId), active: true }
        const orderListForOneUser = await prisma.order.findMany({
            where: filter,
            include: {
                master: true,
                city: true,
                clockSize: true,
                user: true,
            },
            orderBy: { id: 'desc' },
            take: Number(limit),
            skip: Number(offset),
        })
        const countOrders = await prisma.order.count({
            where: filter,
        })
        const result = { total: countOrders, orders: orderListForOneUser }
        res.status(200).json(result)
    }

    async createOrder(
        data: Stripe.Response<Stripe.Checkout.Session>,
        res: Response,
    ) {
        if (data.metadata) {
            const {
                masterId,
                cityId,
                clockSizeId,
                startAt,
                endAt,
                name,
                email,
            } = data.metadata

            let imagesUrls: string[] = []
            const feedbackToken = uuidv4()
            const password = uuidv4()
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const newOrderEndAt = new Date(`${endAt}`)
            const newOrderStartAt = new Date(`${startAt}`)
            const price = await prisma.clockSize.findUnique({
                where: { id: Number(clockSizeId) },
                select: { price: true },
            })
            const user = await prisma.user.findUnique({
                where: { email: email },
            })
            if (user) {
                await prisma.order.create({
                    data: {
                        userId: user.id,
                        masterId: Number(masterId),
                        cityId: Number(cityId),
                        clockSizeId: Number(clockSizeId),
                        price: Number(price?.price),
                        startAt: newOrderStartAt,
                        endAt: newOrderEndAt,
                        feedbackToken: feedbackToken,
                        images: imagesUrls,
                    },
                })
                res.status(201)
            }
            if (!user) {
                await prisma.order.create({
                    data: {
                        user: {
                            create: {
                                name: name,
                                email: email,
                                person: {
                                    create: {
                                        email: email,
                                        password: hash,
                                        role: 'USER',
                                    },
                                },
                            },
                        },
                        master: { connect: { id: Number(masterId) } },
                        city: { connect: { id: Number(cityId) } },
                        clockSize: { connect: { id: Number(clockSizeId) } },
                        price: Number(price?.price),
                        startAt: newOrderStartAt,
                        endAt: endAt,
                        feedbackToken: feedbackToken,
                        images: imagesUrls,
                    },
                })

                await sendMail(
                    email,
                    'confirm your order',
                    `confirm order`,
                    `<p>your password: ${password}</p>`,
                )
                res.status(201)
            }
        }
    }

    async addPhotoInOrder(req: Request, res: Response) {
        const params = addPhotoInOrderSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { images, orderId } = params.data

        if (images) {
            const imagesUrls = (
                await Promise.all<cloudinary.UploadApiResponse>(
                    images.map((image: string) =>
                        cloudinary.v2.uploader.upload(image),
                    ),
                )
            ).map(response => response.secure_url)

            const orderWithPhotos = await prisma.order.update({
                where: { id: orderId },
                data: { images: imagesUrls },
            })
            res.status(201).json(orderWithPhotos)
        } else {
            res.status(400).send({ message: 'no files' })
        }
    }

    async feedbackUpdate(req: Request, res: Response) {
        const params = orderFeedbackSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { feedbackToken, feedbackText, rating, id, feedbackDate } =
            params.data

        const orderWithFeedback = await prisma.order.updateMany({
            where: {
                feedbackToken: feedbackToken,
                id: Number(id),
            },
            data: {
                feedbackDate: feedbackDate,
                feedback: feedbackText,
                rating: Number(rating),
                feedbackToken: null,
            },
        })
        orderWithFeedback.count
            ? res.status(201).json(orderWithFeedback)
            : res.status(400).json({ message: 'no orders with this token' })
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
            include: {
                master: {
                    select: { name: true, person: { select: { email: true } } },
                },
                user: true,
                clockSize: true,
            },
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
        }
        if (clockSize) {
            const workTime = clockSize.timeToDone
            const d = new Date(`${startAt}`)
            d.setHours(d.getHours() + workTime)
            const newOrderEndAt = d.toISOString()
            const newOrderStartAt = new Date(`${startAt}`)

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
            const feedbackToken = order?.feedbackToken
            if (status === 'Completed' && order && feedbackToken && user) {
                const HTMLString = await orderCheckPdf(order)
                const createPDFBuffer = (
                    HTMLString: string,
                ): Promise<Buffer> => {
                    return new Promise((resolve, reject) => {
                        pdf.create(HTMLString).toBuffer((err, buffer) => {
                            if (err) return reject(err)
                            return resolve(buffer)
                        })
                    })
                }
                const buffer = await createPDFBuffer(HTMLString)
                await sendEmailIfStatusCompleted(
                    user.email,
                    feedbackToken,
                    buffer,
                    `Order#${order.id}`,
                )
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
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: {
                master: {
                    select: { name: true, person: { select: { email: true } } },
                },
                user: true,
                clockSize: true,
            },
        })
        if (!order) {
            res.status(400).json({
                message: `Order with id: ${id} is not exsisted`,
            })
        } else {
            const feedbackToken = order.feedbackToken
            if (feedbackToken) {
                const HTMLString = await orderCheckPdf(order)
                const createPDFBuffer = (
                    HTMLString: string,
                ): Promise<Buffer> => {
                    return new Promise((resolve, reject) => {
                        pdf.create(HTMLString).toBuffer((err, buffer) => {
                            if (err) return reject(err)
                            return resolve(buffer)
                        })
                    })
                }
                const buffer = await createPDFBuffer(HTMLString)
                await sendEmailIfStatusCompleted(
                    email,
                    feedbackToken,
                    buffer,
                    `Order#${order.id}`,
                )
                const orderWithNewStatus = await prisma.order.update({
                    where: {
                        id: Number(id),
                    },
                    data: {
                        status: 'Completed',
                    },
                })
                res.status(200).json(orderWithNewStatus)
            }
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
        const params = dataForDiagramSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { start, end } = params.data
        const firstDay = startOfDay(new Date(`${start}`))
        const lastDay = endOfDay(new Date(`${end}`))
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
        const params = dataForDiagramSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { start, end } = params.data
        const firstDay = startOfDay(new Date(`${start}`))
        const lastDay = endOfDay(new Date(`${end}`))
        const DataForMasterDiagram = await prisma.$queryRaw<DataForCharts[]>`
            (SELECT COUNT(*) AS count, cities.name FROM orders  
            INNER JOIN cities ON orders."cityId" = cities.id
            WHERE "startAt" >= ${firstDay} AND "endAt" <= ${lastDay}
            GROUP BY cities.name
            ORDER BY count DESC LIMIT 9)
            UNION
            (SELECT SUM(count) AS count, 'other' as name FROM (
                SELECT COUNT(*) AS count, cities.name FROM orders
                INNER JOIN cities ON orders."cityId" = cities.id
                WHERE "startAt" >= ${firstDay} AND "endAt" <= ${lastDay}
                GROUP BY cities.name
                ORDER BY count DESC OFFSET 9) AS result)
            `

        res.status(200).json(DataForMasterDiagram)
    }

    async getDataForCityGraph(req: Request, res: Response) {
        const params = dataForCityGraphSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { start, end, citiesIDs } = params.data
        const citiesIDsNumber = citiesIDs.map(cityId => Number(cityId))
        const startDate = startOfDay(new Date(`${start}`))
        const endDate = endOfDay(new Date(`${end}`))

        const dataForCityGraph = await prisma.$queryRaw<DataForCharts[]>`
        select date::date, (SELECT COUNT(*)
            FROM orders
            WHERE "cityId" IN (${Prisma.join(citiesIDsNumber)})
            AND DATE("startAt") = date) from generate_series(${startDate}::date,
            ${endDate}::date,
            '1 day'::interval) AS date
        `
        res.status(200).json(dataForCityGraph)
    }

    async getDataForMasterGraph(req: Request, res: Response) {
        const params = dataForMasterGraphSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { start, end, mastersIDs } = params.data
        const mastersIDsNumber = mastersIDs.map(masterId => Number(masterId))
        const startDate = startOfDay(new Date(`${start}`))
        const endDate = endOfDay(new Date(`${end}`))
        const dataForMasterGraph = await prisma.$queryRaw<DataForCharts[]>`
        SELECT date::date, (SELECT COUNT(*)
            FROM orders
            WHERE "masterId" IN (${Prisma.join(mastersIDsNumber)})
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
            INNER JOIN "clockSizes" ON orders."clockSizeId" = "clockSizes".id
            WHERE "clockSizes".name = 'small' AND orders."masterId" = masters.id
            ) AS "smallOrdersCount", (	
                SELECT COUNT(*) FROM orders 
                INNER JOIN "clockSizes" ON orders."clockSizeId" = "clockSizes".id
                WHERE "clockSizes".name = 'middle' AND orders."masterId" = masters.id
            ) AS "middleOrdersCount", (	
                SELECT COUNT(*) FROM orders 
                INNER JOIN "clockSizes" ON orders."clockSizeId" = "clockSizes".id
                WHERE "clockSizes".name = 'large' AND orders."masterId" = masters.id
            ) AS "largeOrdersCount", (	
                SELECT COUNT(*) FROM orders 
                WHERE orders.status = 'Completed' AND orders."masterId" = masters.id
            ) AS "countCompletedOrders", (	
                SELECT COUNT(*) FROM orders 
                WHERE orders.status != 'Completed' AND orders."masterId" = masters.id
            ) AS "countNotCompletedOrders", (
                SELECT SUM(orders.price) FROM orders
                WHERE orders.status = 'Completed' AND orders."masterId" = masters.id
            ) AS profit, AVG(orders.rating) AS rating
                    FROM orders 
                    RIGHT JOIN masters ON orders."masterId" = masters.id
                    GROUP BY masters.name, masters.id
                    ORDER BY masters.name DESC
                    LIMIT ${Number(limit)} OFFSET ${Number(offset)}
        `
        const countAllMasters = await prisma.master.count()
        const result = { total: countAllMasters, masters: dataForMasterTable }
        res.status(200).json(result)
    }

    async sendCheckPdfFile(req: Request, res: Response) {
        const params = sendCheckPdfFileSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { orderId } = params.data

        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            include: {
                master: {
                    select: { name: true, person: { select: { email: true } } },
                },
                user: true,
                clockSize: true,
            },
        })

        if (order) {
            const HTMLString = await orderCheckPdf(order)
            const pathToPdfFile = `${__dirname}/../Order#${orderId}.pdf`
            const createPDFFile = (HTMLString: string) => {
                return new Promise((resolve, reject) => {
                    pdf.create(HTMLString).toFile(pathToPdfFile, err => {
                        if (err) return reject(err)
                        return resolve(true)
                    })
                })
            }
            await createPDFFile(HTMLString)
            res.download(pathToPdfFile)
        }
    }
}
export default new OrderController()
