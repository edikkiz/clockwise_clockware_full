// import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

// const prisma = new PrismaClient()

class BlogController {
    async uploadImage(req: Request, res: Response) {
        console.log(req.body)
        res.status(200).send()
    }
}

export default new BlogController()
