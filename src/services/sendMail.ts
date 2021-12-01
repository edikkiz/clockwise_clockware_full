import * as nodemailer from 'nodemailer'
import { OptionsForNodemailer } from '../models'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    port: 587,
    auth: {
        user: process.env.NOTIFICATION_EMAIL,
        pass: process.env.NOTIFICATION_PASS,
    },
    logger: true,
})

const sendMail = async (
    to: string,
    subject: string,
    text: string,
    html: string,
    filename?: string,
    pdf?: Buffer,
) => {
    if (!process.env.NOTIFICATION_EMAIL) {
        throw new Error('Nodemailer notification email is not provided')
    }
    const options: OptionsForNodemailer = {
        from: process.env.NOTIFICATION_EMAIL,
        to: to,
        subject: subject,
        text: text,
        html: html,
    }
    if (filename && pdf) {
        options.attachments = [
            {
                filename: filename,
                content: pdf,
            },
        ]
    }
    await transporter.sendMail(options)
}

transporter.verify(function () {
    console.log('Server is ready to take our messages')
})
export default sendMail
