import { z } from 'zod'

export const addPostSchema = z.object({
    images: z.array(z.string()),
    content: z.string(),
    previewImg: z.string(),
    title: z.string(),
    previewText: z.string().max(200),
})

export const getOnePostSchema = z.object({
    id: z.string(),
})

export const getPostsSchema = z.object({
    limit: z.string(),
    offset: z.string(),
})

export const updatePostSchema = z.object({
    id: z.number().int().nonnegative(),
    images: z.array(z.string()),
    content: z.string(),
    previewImg: z.string(),
    title: z.string(),
    previewText: z.string().max(200),
})
