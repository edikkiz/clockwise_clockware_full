import * as express from 'express'
import userRouter from './routes/user.routes'
import cityRouter from './routes/city.routes'
import orderRouter from './routes/order.routes'
import masterRouter from './routes/master.routes'
import authRouter from './routes/auth.router'
import adminRouter from './routes/admin.router'
import masterRoleRouter from './routes/masterRole.router'
import userRoleRouter from './routes/userRole.route'
import cors from 'cors'
import authController from './controller/auth.controller'
import Stripe from 'stripe'

const PORT = process.env.PORT || 3333
const app = express.default()
const path = require('path')
const stripe = new Stripe(
    'sk_test_51JoRKQAsmDgU6NBKaoFerhzascwnn6ok47hRAB094jdKvaco58UV9mUWe9MX44AYf4WvmfVXcGu4pLlZ2eMJBW6B00Hx4npo9E',
    { apiVersion: '2020-08-27' },
)

app.use(
    cors({
        exposedHeaders: 'Authorization',
    }),
)

app.use(express.static(`${__dirname}/../client/build`))

app.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    (request, response) => {
        const payload = request.body
        const sig = request.headers['stripe-signature']
        const endpointSecret = 'whsec_S2idM3OZ9TTyZ2HVYlvXB0IolKBVVXop'
        let event

        try {
            if (sig) {
                event = stripe.webhooks.constructEvent(
                    payload,
                    sig,
                    endpointSecret,
                )
            }
        } catch (err) {
            response.status(400).json({ success: false })
            return
        }
        switch (event?.type) {
            case 'checkout.session.completed':
                const paymentIntent = event.data
                    .object as Stripe.Response<Stripe.Checkout.Session>
                console.log(paymentIntent.metadata)
                break
            default:
                console.log(`Unhandled event type ${event?.type}`)
        }
        response.json({ received: true })
    },
)

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))
app.use('/api', userRouter)

app.use('/api', cityRouter)

app.use('/api', orderRouter)

app.use('/api', masterRouter)

app.use('/api', authRouter)

app.use('/api/admin', authController.checkAccessToken('ADMIN'), adminRouter)

app.use(
    '/api/master',
    authController.checkAccessToken('MASTER'),
    masterRoleRouter,
)

app.use('/api/user', authController.checkAccessToken('USER'), userRoleRouter)

app.post('/api/create-checkout-session', async (req, res) => {
    const product = {
        name: 'iPhone 12',
        image: 'https://i.imgur.com/EHyR2nP.png',
        amount: 10000,
        quantity: 1,
    }
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: product.amount,
                },
                quantity: product.quantity,
            },
        ],
        metadata: {
            orderId: '1',
        },
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${process.env.SITE_URL_STRIPE}?success=true`,
        cancel_url: `${process.env.SITE_URL_STRIPE}?canceled=true`,
    })
    res.status(200).json({ url: session.url })
})

app.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
