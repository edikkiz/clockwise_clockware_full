import { OrderStatus } from ".prisma/client"
import { z } from "zod"

const createOrderShape = {
    cityId: z.number().int().nonnegative(),
    masterId: z.number().int().nonnegative(),
    clockSizeId: z.number().int().nonnegative(),
    startAt: z.string(),
    name: z.string(),
    email: z.string(),
}

export const createOrderSchema = z.object(createOrderShape)


const updateOrderShape = {
    id: z.number().int().nonnegative(),
    cityId: z.number().int().nonnegative(),
    masterId: z.number().int().nonnegative(),
    userId: z.number().int().nonnegative(),
    clockSizeId: z.number().int().nonnegative(),
    startAt: z.string(),
    price: z.number(),
    status: z.nativeEnum(OrderStatus).optional(),
}

export const updateOrderSchema = z.object(updateOrderShape)


const deleteOrderShape = {
    id: z.number().int().nonnegative()
}

export const deleteOrderSchema = z.object(deleteOrderShape)

const orderByFeedbackTokenShape = {
    feedbackToken: z.string()
}

export const orderByFeedbackTokenSchema = z.object(orderByFeedbackTokenShape)

const allOrderShape = {
    limit: z.string(),
    offset: z.string(),
    masterId: z.string().optional(),
}

export const allOrderSchema = z.object(allOrderShape)

const allOrderFiltredShape = {
    limit: z.string(),
    offset: z.string(),
    masterId: z.string().optional(),
    cityId: z.string().optional(),
    clockSizeId: z.string().optional(),
    status: z.nativeEnum(OrderStatus).optional(),
    filterStart: z.string().optional(),
    filterEnd: z.string().optional()
}

export const allOrderFiltredSchema = z.object(allOrderFiltredShape)

const allOrdersToTheMasterShape = {
    limit: z.string(),
    offset: z.string(),
    masterId: z.string(),
}

export const allOrdersToTheMasterSchema = z.object(allOrdersToTheMasterShape)

const allOrdersToTheUserShape = {
    limit: z.string(),
    offset: z.string(),
    userId: z.string(),
} 

export const allOrdersToTheUserSchema = z.object(allOrdersToTheUserShape)

const updateOrderStatusShape = {
    id: z.number().int().nonnegative(),
    email: z.string()
}

export const updateOrderStatusSchema = z.object(updateOrderStatusShape)