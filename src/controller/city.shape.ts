import { z } from 'zod'

const createCityShape = {
    name: z.string().regex(/[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]/),
}

export const createCitySchema = z.object(createCityShape)

const updateCityShape = {
    id: z.number().int().nonnegative(),
    name: z.string().regex(/[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]/),
}

export const updateCitySchema = z.object(updateCityShape)

const deleteCityShape = {
    id: z.number().int().nonnegative(),
}

export const deleteCitySchema = z.object(deleteCityShape)

const getCitiesShape = {
    limit: z.string(),
    offset: z.string(),
}

export const getCitiesSchema = z.object(getCitiesShape)
