import express, { Request, Response } from 'express'
const PORT = process.env.PORT || 3333
import userRouter from './routes/user.routes'
import cityRouter from './routes/city.routes'
import orderRouter from './routes/order.routes'
import masterRouter from './routes/master.routes'
import authRouter from './routes/auth.router'
import adminRouter from './routes/admin.router'
import masterRoleRouter from './routes/masterRole.router'
import userRoleRouter from './routes/userRole.route'
import cors from 'cors'
const startWorkCommunicate = require('./communicationWithUsers')
const app = express()
const path = require('path')


app.use(cors({
  exposedHeaders: 'Authorization',
}))

app.use(express.static("build"));


app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))
app.use('/api', userRouter)

app.use('/api', cityRouter)

app.use('/api', orderRouter)

app.use('/api', masterRouter)

app.use('/api', authRouter)

app.use('/api', adminRouter)

app.use('/api', masterRoleRouter)

app.use('/api', userRoleRouter)

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})
