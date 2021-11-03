import { z } from 'zod'

export const createMasterSchema = z
    .object({
        cityId: z.number().int().nonnegative(),
        name: z.string().regex(/^[A-Za-zА-Яа-яёЁЇїІіЄєҐґ ]*$/),
        login: z.string().email(),
        password: z
            .string()
            .min(8, { message: 'Must be 8 or more characters long' })
            .regex(/[0-9]{1,}/)
            .regex(/[$.,#@&^%()*!}{/]{1,}/)
            .refine(password => password.toLowerCase() !== password, {
                message: 'Password must 1 or more symbol upper case',
            })
            .refine(password => password.toUpperCase() !== password, {
                message: 'Password must 1 or more symbol lower case',
            }),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Those passwords didn’t match',
    })

export const deleteMasterSchema = z.object({
    id: z.number().int().nonnegative(),
})

export const getMastersSchema = z.object({
    limit: z.string(),
    offset: z.string(),
})

export const getFreeMastersSchema = z.object({
    cityId: z.string(),
    startAt: z.string(),
    endAt: z.string(),
    orderId: z.string().optional(),
})
