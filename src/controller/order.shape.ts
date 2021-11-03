import { OrderStatus } from '.prisma/client'
import { z } from 'zod'

export const createOrderSchema = z.object({
    cityId: z.number().int().nonnegative(),
    masterId: z.number().int().nonnegative(),
    clockSizeId: z.number().int().nonnegative(),
    startAt: z.string(),
    name: z.string().regex(/^[A-Za-zА-Яа-яёЁЇїІіЄєҐґ ]*$/),
    email: z.string().email(),
})

export const updateOrderSchema = z.object({
    id: z.number().int().nonnegative(),
    cityId: z.number().int().nonnegative(),
    masterId: z.number().int().nonnegative(),
    userId: z.number().int().nonnegative(),
    clockSizeId: z.number().int().nonnegative(),
    startAt: z.string(),
    price: z.number(),
    status: z.nativeEnum(OrderStatus).optional(),
})

export const deleteOrderSchema = z.object({
    id: z.number().int().nonnegative(),
})

export const orderByFeedbackTokenSchema = z.object({
    feedbackToken: z.string(),
})

export const allOrderFiltredSchema = z.object({
    limit: z.string(),
    offset: z.string(),
    masterId: z.string().optional(),
    cityId: z.string().optional(),
    clockSizeId: z.string().optional(),
    status: z.nativeEnum(OrderStatus).optional(),
    start: z.string().optional().nullable(),
    end: z.string().optional().nullable(),
})

export const allOrdersToTheMasterSchema = z.object({
    limit: z.string(),
    offset: z.string(),
    masterId: z.string(),
})

export const allOrdersToTheUserSchema = z.object({
    limit: z.string(),
    offset: z.string(),
    userId: z.string(),
})

export const updateOrderStatusSchema = z.object({
    id: z.number().int().nonnegative(),
    email: z.string(),
})

export const dataForDiagramSchema = z.object({
    start: z.string(),
    end: z.string(),
})

export const dataForCityGraphSchema = z.object({
    start: z.string(),
    end: z.string(),
    citiesIDs: z.array(z.string()).min(1),
})


export const dataForMasterGraphSchema = z.object({
    start: z.string(),
    end: z.string(),
    mastersIDs: z.array(z.string()).min(1),
})

export const dataForMasterTableSchema = z.object({
    limit: z.string(),
    offset: z.string(),
})

export const orderFeedbackSchema = z.object({
    feedbackText: z.string().optional(),
    rating: z.number(),
    id: z.number(),
    feedbackToken: z.string(),
    feedbackDate: z.string(),
})