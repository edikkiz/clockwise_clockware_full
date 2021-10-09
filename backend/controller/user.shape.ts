import { z } from "zod"

const createUserShape = {
    name: z.string(),
    email: z.string(),
}

export const createUserSchema = z.object(createUserShape)

const updateUserShape = {
    id: z.number().int().nonnegative(),
    name: z.string(),
    email: z.string(),
}

export const updateUserSchema = z.object(updateUserShape)

const deleteUserShape = {
    id: z.number().int().nonnegative()
}

export const deleteUserSchema = z.object(deleteUserShape)

const getUsersShape = {
    limit: z.string(),
    offset: z.string(),
}

export const getUsersSchema = z.object(getUsersShape)