import { addPostSchema, getPostSchema, updatePostSchema } from './blob.shape'
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { cloudinary } from '../utils/cloudinary'

const prisma = new PrismaClient()

class BlogController {
    async getPosts(req: Request, res: Response) {
        const params = getPostSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        const { limit, offset } = params.data
        const posts = await prisma.post.findMany({
            take: Number(limit),
            skip: Number(offset),
        })
        const postsCount = await prisma.post.count()
        const result = {
            total: postsCount,
            posts: posts,
        }
        res.status(200).json(result)
    }

    async addPost(req: Request, res: Response) {
        const params = addPostSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { images, titleImg, title, previewText } = params.data
        let { content } = params.data
        const titleImgUrl = await cloudinary.v2.uploader.upload(titleImg)
        if (images) {
            const imagesUrls = (
                await Promise.all<cloudinary.UploadApiResponse>(
                    images.map((image: string) =>
                        cloudinary.v2.uploader.upload(image),
                    ),
                )
            ).map(response => response.secure_url)
            for (let i = 1; i <= imagesUrls.length; i++) {
                content = content.replace(
                    `<img src="${i}"`,
                    `<img src="${imagesUrls[i - 1]}"`,
                )
            }
        }
        const newPost = await prisma.post.create({
            data: {
                content: content,
                titleImg: titleImgUrl.secure_url,
                title: title,
                previewText: previewText,
            },
        })
        res.status(200).json(newPost)
    }

    async updatePost(req: Request, res: Response) {
        const params = updatePostSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { images, titleImg, title, previewText, id } = params.data
        let { content } = params.data
        let titleImgUrl: string
        titleImg.search('https://') !== -1
            ? (titleImgUrl = titleImg)
            : (titleImgUrl = (await cloudinary.v2.uploader.upload(titleImg))
                  .secure_url)
        if (images) {
            const imagesUrls = (
                await Promise.all<cloudinary.UploadApiResponse | string>(
                    images.map((image: string) =>
                        image.search('https://') !== -1
                            ? image
                            : cloudinary.v2.uploader.upload(image),
                    ),
                )
            ).map(response =>
                typeof response === 'string' ? response : response.secure_url,
            )
            for (let i = 1; i <= imagesUrls.length; i++) {
                content = content.replace(
                    `<img src="${i}"`,
                    `<img src="${imagesUrls[i - 1]}"`,
                )
            }
        }
        const updatedPost = await prisma.post.update({
            where: { id: id },
            data: {
                content: content,
                titleImg: titleImgUrl,
                title: title,
                previewText: previewText,
            },
        })
        res.status(200).json(updatedPost)
    }
}

export default new BlogController()
