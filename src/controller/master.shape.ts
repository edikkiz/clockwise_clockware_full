import { z } from "zod"


const createMasterShape = {
    cityId: z.number().int().nonnegative(),
    name: z.string(),
    login: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
}

export const createMasterSchema = z.object(createMasterShape)

const deleteMasterShape = {
    id: z.number().int().nonnegative()
}

export const deleteMasterSchema = z.object(deleteMasterShape)

const getMastersShape = {
    limit: z.string(),
    offset: z.string(),
}

export const getMastersSchema = z.object(getMastersShape)

const getFreeMastersShape = {
    cityId: z.string(),
    startAt: z.string(),
    clockSizeId: z.string(),
}

export const getFreeMastersSchema = z.object(getFreeMastersShape)


const getFreeMastersForPutOrderShape = {
    orderId: z.string(),
    cityId: z.string(),
    startAt: z.string(),
    clockSizeId: z.string(),
}

export const getFreeMastersForPutOrderSchema = z.object(getFreeMastersForPutOrderShape)