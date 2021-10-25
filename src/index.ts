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

const PORT = process.env.PORT || 3333
// import { loadStripe } from '@stripe/stripe-js'
const app = express.default()
const path = require('path')
const stripe = require('stripe')(
    'sk_test_51JoRKQAsmDgU6NBKaoFerhzascwnn6ok47hRAB094jdKvaco58UV9mUWe9MX44AYf4WvmfVXcGu4pLlZ2eMJBW6B00Hx4npo9E',
)

app.post('/api/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // TODO: replace this with the `price` of the product you want to sell
                price: '{{PRICE_ID}}',
                unit_amount: 1000,
                quantity: 1,
            },
        ],
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${process.env.SITE_URL_STRIPE}?success=true`,
        cancel_url: `${process.env.SITE_URL_STRIPE}?canceled=true`,
    })
    res.redirect(303, session.url)
})

app.use(
    cors({
        exposedHeaders: 'Authorization',
    }),
)

app.use(express.static(`${__dirname}/../client/build`))

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

app.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
})
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
