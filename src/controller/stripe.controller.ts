import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { createOrderSchema } from './order.shape'
import { stripe } from '../index'

const prisma = new PrismaClient()

class StripeController {
    async createCheckoutSession(req: Request, res: Response) {
        const params = createOrderSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { masterId, cityId, clockSizeId, startAt, endAt, name, email } =
            params.data

        const validationErrors = []
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
        if (validationErrors.length) {
            res.status(400).json(validationErrors)
        }
        if (clockSize) {
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: `repair ${clockSize.name} clock`,
                                images: [
                                    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fbigl.ua%2Fp1442091260-mehanicheskie-napolnye-chasy&psig=AOvVaw0dG4cTKoVLaxQUuBRQG6E6&ust=1636450402865000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNCsnsGMlfQCFQAAAAAdAAAAABAF',
                                ],
                            },
                            unit_amount: clockSize.price * 100,
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    masterId: masterId,
                    cityId: cityId,
                    clockSizeId: clockSizeId,
                    startAt: startAt,
                    endAt: endAt,
                    name: name,
                    email: email,
                },
                payment_method_types: ['card'],
                mode: 'payment',
                success_url: `${process.env.SITE_URL_STRIPE}?success=true`,
                cancel_url: `${process.env.SITE_URL_STRIPE}?canceled=true`,
            })
            res.status(200).json({ url: session.url })
        }
    }
}
export default new StripeController()
