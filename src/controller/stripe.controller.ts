import { Request, Response } from 'express'
import Stripe from 'stripe'

const stripe = new Stripe(
    'sk_test_51JoRKQAsmDgU6NBKaoFerhzascwnn6ok47hRAB094jdKvaco58UV9mUWe9MX44AYf4WvmfVXcGu4pLlZ2eMJBW6B00Hx4npo9E',
    { apiVersion: '2020-08-27' },
)

class StripeController {
    async createCheckoutSession(req: Request, res: Response) {
        const {
            price,
            masterId,
            cityId,
            clockSizeId,
            startAt,
            endAt,
            name,
            email,
            size,
        } = req.body
        if (price) {
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: `repair ${size} clock`,
                                images: ['https://i.imgur.com/EHyR2nP.png'],
                            },
                            unit_amount: price * 100,
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
