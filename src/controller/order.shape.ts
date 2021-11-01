import { OrderStatus } from '.prisma/client'
import { z } from 'zod'

const createOrderShape = {
    cityId: z.number().int().nonnegative(),
    masterId: z.number().int().nonnegative(),
    clockSizeId: z.number().int().nonnegative(),
    startAt: z.string(),
    name: z.string().regex(/[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]/),
    email: z.string().email(),
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
    id: z.number().int().nonnegative(),
}

export const deleteOrderSchema = z.object(deleteOrderShape)

const orderByFeedbackTokenShape = {
    feedbackToken: z.string(),
}

export const orderByFeedbackTokenSchema = z.object(orderByFeedbackTokenShape)

const allOrderFiltredShape = {
    limit: z.string(),
    offset: z.string(),
    masterId: z.string().optional(),
    cityId: z.string().optional(),
    clockSizeId: z.string().optional(),
    status: z.nativeEnum(OrderStatus).optional(),
    start: z.string().optional(),
    end: z.string().optional(),
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
    email: z.string(),
}

export const updateOrderStatusSchema = z.object(updateOrderStatusShape)

const dataForDiagramShape = {
    start: z.string(),
    end: z.string(),
}

export const dataForDiagramSchema = z.object(dataForDiagramShape)

const dataForCityGraphShape = {
    start: z.string(),
    end: z.string(),
    citiesIDs: z.array(z.string()).min(1),
}

export const dataForCityGraphSchema = z.object(dataForCityGraphShape)

const dataForMasterGraphShape = {
    start: z.string(),
    end: z.string(),
    mastersIDs: z.array(z.string()).min(1),
}

export const dataForMasterGraphSchema = z.object(dataForMasterGraphShape)

const dataForMasterTableShape = {
    limit: z.string(),
    offset: z.string(),
}

export const dataForMasterTableSchema = z.object(dataForMasterTableShape)

const orderFeedbackShape = {
    feedbackText: z.string().optional(),
    rating: z.number(),
    id: z.number(),
    feedbackToken: z.string(),
    feedbackDate: z.string(),
}

export const orderFeedbackSchema = z.object(orderFeedbackShape)
