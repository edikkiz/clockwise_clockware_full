import { z } from 'zod'

export const createCitySchema = z.object({
    name: z.string().regex(/^[A-Za-zА-Яа-яёЁЇїІіЄєҐґ ]*$/),
})

export const updateCitySchema = z.object({
    id: z.number().int().nonnegative(),
    name: z.string().regex(/^[A-Za-zА-Яа-яёЁЇїІіЄєҐґ ]*$/),
})

export const deleteCitySchema = z.object({
    id: z.number().int().nonnegative(),
})

export const getCitiesSchema = z.object({
    limit: z.string(),
    offset: z.string(),
})
