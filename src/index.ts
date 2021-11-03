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
const app = express.default()
const path = require('path')

app.use(
    cors({
        exposedHeaders: 'Authorization',
    }),
)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(`client/build`))
    app.get('/', (req: express.Request, res: express.Response) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))
app.use('/api', userRouter)

app.use('/api', cityRouter)

app.use('/api', orderRouter)

app.use('/api', masterRouter)

app.use('/api', authRouter)

app.use('/api/admin', authController.checkAccessToken('ADMIN'), adminRouter)

app.use('/api/master', authController.checkAccessToken('MASTER'),  masterRoleRouter)

app.use('/api/user', authController.checkAccessToken('USER'),  userRoleRouter)

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
