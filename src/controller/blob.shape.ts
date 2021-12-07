import { z } from 'zod'

export const addPostSchema = z.object({
    images: z.array(z.string()).optional(),
    content: z.string(),
    titleImg: z.string(),
    title: z.string(),
    previewText: z.string().max(200),
})

export const getPostSchema = z.object({
    limit: z.string(),
    offset: z.string(),
})

export const updatePostSchema = z.object({
    id: z.number().int().nonnegative(),
    images: z.array(z.string()).optional(),
    content: z.string(),
    titleImg: z.string(),
    title: z.string(),
    previewText: z.string().max(200),
})
