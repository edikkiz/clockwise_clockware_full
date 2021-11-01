import { z } from 'zod'

const createMasterShape = {
    cityId: z.number().int().nonnegative(),
    name: z.string().regex(/[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]/),
    login: z.string().email(),
    password: z
        .string()
        .regex(/[0-9]{1,}/)
        .regex(/[$.,#@&^%()*!}{/]{1,}/)
        .refine(password => password.toLowerCase() !== password, {
            message: 'Password must 1 or more symbol upper case',
        })
        .refine(password => password.toUpperCase() !== password, {
            message: 'Password must 1 or more symbol lower case',
        }),
    confirmPassword: z.string(),
}

export const createMasterSchema = z
    .object(createMasterShape)
    .refine(data => data.password === data.confirmPassword, {
        message: 'Those passwords didn’t match',
    })

const deleteMasterShape = {
    id: z.number().int().nonnegative(),
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
    timeToDone: z.string(),
    orderId: z.string().optional(),
}

export const getFreeMastersSchema = z.object(getFreeMastersShape)
