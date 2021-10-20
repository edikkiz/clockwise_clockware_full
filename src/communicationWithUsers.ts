import { CronJob } from "cron"
import transporter from './services/emailNotification'

import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

const communicateStartWork = new CronJob('0 55 */1 * * *', () => {
    const date = new Date()
    let minutes = date.getMinutes() + 5
    let hours = date.getHours()
    if (minutes >= 60) {
        hours = hours + 1
        minutes = minutes - 60
    }
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const correctDate = `${year}-${month < 10 ? `0${month}` : `${month}`}-${day < 10 ? `0${day}` : `${day}`} ${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}`
    const corDate = new Date(`${correctDate} UTC`)
    const communicate = async () => {
        const orders = await prisma.order.findMany()
        await Promise.all(orders.map(async (elem) => {
            const startAt = new Date(`${elem.startAt} UTC`)
            if (startAt.toISOString() === corDate.toISOString()) {
                const email = await prisma.user.findUnique({ where: { id: elem.userId } })
                if (email) {
                    await transporter.sendMail({
                        from: process.env.NOTIFICATION_EMAIL,
                        to: email.email,
                        subject: '5 minutes before the arrival of the master',
                        text: '5 minutes before the arrival of the master'
                    })
                }
            }
        }))
    }
    communicate()
})
communicateStartWork.start()


// const communicateEndWork = new CronJob('0 0 */1 * * *', () =>  {
//     const date = new Date()
//     const hours = date.getHours()
//     const minutes = date.getMinutes()
//     const day = date.getDate()
//     const month = date.getMonth() + 1
//     const year = date.getFullYear()
//     const correctDate = `${year}-${month < 10 ? `0${month}` : `${month}`}-${day < 10 ? `0${day}` : `${day}`} ${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}`
//     const corDate = new Date(`${correctDate} UTC`)

//     const communicate = async () => {
//         const orders = await db.query('SELECT "endAt", "userId", "masterId" FROM orders')
//         await Promise.all(orders.rows.map( async (elem) => {
//             const endAtTime = new Date(`${elem.endAt} UTC`)
//             if(endAtTime.toISOString() === corDate.toISOString()) {
//                 const email = await db.query('SELECT email FROM users WHERE id = $1', [elem.userId])
//                 await transporter.sendMail({
//                     from: process.env.NOTIFICATION_EMAIL,
//                     to: email.rows[0].email,
//                     subject: 'appreciate the work of the master',
//                     html: `<p>Click <a href="${process.env.SITE_URL}/rate/${elem.masterId}">here</a> to rate work</p>`
//                 })
//             }
//           }))
//         }
//     communicate()
// })
// communicateEndWork.start()