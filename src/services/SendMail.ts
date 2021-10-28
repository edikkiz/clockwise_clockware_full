import * as nodemailer from 'nodemailer'

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

const sendMail = async (to: string, subject: string, text: string, html: string) => {
  await transporter.sendMail({
    from: process.env.NOTIFICATION_EMAIL,
    to: to,
    subject: subject,
    text: text,
    html: html,
  })
}

transporter.verify(function () {
    console.log("Server is ready to take our messages");
});
export default sendMail