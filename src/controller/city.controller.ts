import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import {
    createCitySchema,
    deleteCitySchema,
    updateCitySchema,
    getCitiesSchema,
} from './city.shape'

const prisma = new PrismaClient()

class CityController {
    async getCities(req: Request, res: Response) {
        const params = getCitiesSchema.safeParse(req.query)
        if (params.success) {
            const { limit, offset } = params.data
            const cities = await prisma.city.findMany({
                skip: Number(offset),
                take: Number(limit),
            })
            res.status(200).json(cities)
        } else {
            const cities = await prisma.city.findMany()
            res.status(200).json(cities)
        }
    }

    async createCity(req: Request, res: Response) {
        const params = createCitySchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { name } = params.data
        const city = await prisma.city.findUnique({ where: { name: name } })
        if (city) {
            res.status(400).json({ message: `city with name: ${name} exsist` })
        } else {
            const newCity = await prisma.city.create({
                data: {
                    name: name,
                },
            })
            res.status(201).json(newCity)
        }
    }

    async updateCity(req: Request, res: Response) {
        const params = updateCitySchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { id, name } = params.data
        const city = await prisma.city.findUnique({ where: { id: Number(id) } })
        if (!city) {
            res.status(400).json({
                message: `City with id: ${id} is not exsisted`,
            })
        } else {
            const updatedCity = await prisma.city.update({
                where: {
                    id: Number(id),
                },
                data: {
                    name: name,
                },
            })
            res.status(201).json(updatedCity)
        }
    }

    async deleteCity(req: Request, res: Response) {
        const params = deleteCitySchema.safeParse(req.body)
        if (!params.success) {
            return
        }
        const { id } = params.data
        const city = await prisma.city.findUnique({ where: { id: Number(id) } })
        if (!city) {
            res.status(400).json({
                message: `City with that Id does not exist`,
            })
        } else {
            const deletedCity = await prisma.city.delete({
                where: {
                    id: Number(id),
                },
            })
            res.status(204).json(deletedCity)
        }
    }
}

export default new CityController()
