import {
    addPostSchema,
    getOnePostSchema,
    getPostsSchema,
    updatePostSchema,
} from './blob.shape'
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { cloudinary } from '../utils/cloudinary'

const prisma = new PrismaClient()

class BlogController {
    async getPosts(req: Request, res: Response) {
        const params = getPostsSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        try {
            const { limit, offset } = params.data
            const result = await prisma.$transaction([
                prisma.post.findMany({
                    take: Number(limit),
                    skip: Number(offset),
                }),
                prisma.post.count(),
            ])
            res.status(200).json({
                posts: result[0],
                total: result[1],
            })
        } catch {
            res.status(500).send({
                message: `something wrong, try again later`,
            })
        }
    }

    async getOnePost(req: Request, res: Response) {
        const params = getOnePostSchema.safeParse(req.query)
        if (!params.success) {
            return
        }
        try {
            const { id } = params.data
            const post = await prisma.post.findUnique({
                where: { id: Number(id) },
            })
            res.status(200).json(post)
        } catch {
            res.status(500).send({
                message: `something wrong, try again later`,
            })
        }
    }

    async addPost(req: Request, res: Response) {
        const params = addPostSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        try {
            const { images, previewImg, title, previewText, content } =
                params.data
            let localCopyContent = content
            const previewImgUrl = await cloudinary.v2.uploader.upload(
                previewImg,
            )
            const imagesUrls = (
                await Promise.all<cloudinary.UploadApiResponse>(
                    images.map((image: string) =>
                        cloudinary.v2.uploader.upload(image),
                    ),
                )
            ).map(response => response.secure_url)
            for (let i = 1; i <= imagesUrls.length; i++) {
                localCopyContent = localCopyContent.replace(
                    `<img src="${i}"`,
                    `<img src="${imagesUrls[i - 1]}"`,
                )
            }

            const newPost = await prisma.post.create({
                data: {
                    content: localCopyContent,
                    previewImg: previewImgUrl.secure_url,
                    title: title,
                    previewText: previewText,
                },
            })
            res.status(200).json(newPost)
        } catch {
            res.status(500).send({
                message: `something wrong, try again later`,
            })
        }
    }

    async updatePost(req: Request, res: Response) {
        const params = updatePostSchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        try {
            const { images, previewImg, title, previewText, id, content } =
                params.data
            let localCopyContent = content
            let previewImgUrl: string
            previewImg.search('https://') !== -1
                ? (previewImgUrl = previewImg)
                : (previewImgUrl = (
                      await cloudinary.v2.uploader.upload(previewImg)
                  ).secure_url)
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
            for (let i = 0; i < imagesUrls.length; i++) {
                localCopyContent = localCopyContent.replace(
                    `<img src="${i}"`,
                    `<img src="${imagesUrls[i]}"`,
                )
            }
            const updatedPost = await prisma.post.update({
                where: { id: id },
                data: {
                    content: localCopyContent,
                    previewImg: previewImgUrl,
                    title: title,
                    previewText: previewText,
                },
            })
            res.status(200).json(updatedPost)
        } catch {
            res.status(500).send({
                message: `something wrong, try again later`,
            })
        }
    }
}

export default new BlogController()
