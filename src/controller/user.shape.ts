import { z } from "zod"

export const createUserSchema = z.object({
    name: z.string().regex(/^[A-Za-zА-Яа-яёЁЇїІіЄєҐґ ]*$/),
    email: z.string().email(),
})

export const updateUserSchema = z.object({
    id: z.number().int().nonnegative(),
    name: z.string().regex(/^[A-Za-zА-Яа-яёЁЇїІіЄєҐґ ]*$/),
    email: z.string().email(),
})


export const deleteUserSchema = z.object({
    id: z.number().int().nonnegative()
})

export const getUsersSchema = z.object({
    limit: z.string(),
    offset: z.string(),
})