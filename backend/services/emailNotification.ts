import nodemailer from 'nodemailer'

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


transporter.verify(function () {
    console.log("Server is ready to take our messages");
});
export default transporter