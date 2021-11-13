import * as express from 'express'
import userRouter from './routes/user.routes'
import cityRouter from './routes/city.routes'
import orderRouter from './routes/order.routes'
import masterRouter from './routes/master.routes'
import authRouter from './routes/auth.router'
import adminRouter from './routes/admin.router'
import masterRoleRouter from './routes/masterRole.router'
import userRoleRouter from './routes/userRole.route'
import stripeRouter from './routes/stripe.router'
import cors from 'cors'
import authController from './controller/auth.controller'
import Stripe from 'stripe'
import orderController from './controller/order.controller'

const PORT = process.env.PORT || 3333
const app = express.default()
const path = require('path')
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('stripe secret key is not provided')
}
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
})
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
        if (!process.env.STRIPE_SECRET_WEBHOOK_KEY) {
            throw new Error('stripe secret webhook key is not provided')
        }
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
        } catch {
            response.status(400).send(`Webhook Error`)
            return
        }
        if (event?.type === 'checkout.session.completed') {
            const paymentIntent = event.data
                .object as Stripe.Response<Stripe.Checkout.Session>
            const createOrder = async () => {
                await orderController.createOrder(paymentIntent, response)
                response.status(200)
            }
            createOrder()
        } else {
            console.log(`Unhandled event type ${event?.type}`)
        }
        response.send()
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

app.use('/api', stripeRouter)

app.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
