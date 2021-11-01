import { PrismaClient, Master } from '@prisma/client'
import { Request, Response } from 'express';
import { MasterWithRating } from '../models';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from "zod"
import validator from 'email-validator'
import { createMasterSchema, updateMasterSchema, deleteMasterSchema, getMastersSchema, getFreeMastersSchema, getFreeMastersForPutOrderSchema } from './master.shape';

const regName = new RegExp("[A-Za-zА-Яа-я]")
const regPasswordWithOneNumb = new RegExp("[0-9]{1,}")
const regPasswordWithOneSymbol = new RegExp("[$.,#@&^%()*!}{/]{1,}")

const prisma = new PrismaClient()

class MasterController {

  async getMasters(req: Request, res: Response) {
    try {
      getMastersSchema.parse(req.query)
      const { limit, offset } = req.query
      const masters = await prisma.master.findMany({
        skip: Number(offset),
        take: Number(limit)
      })
      res.status(200).json(masters)
    }
    catch {
      const masters = await prisma.master.findMany()
      res.status(200).json(masters)
    }
  }


  async getFreeMasters(req: Request, res: Response) {
    const params = getFreeMastersSchema.safeParse(req.query)
    if (!params.success) {
      return
    }
    const { cityId, startAt, clockSizeId } = params.data
    const timeToDone = await prisma.clockSize.findUnique({
      where: {
        id: Number(clockSizeId)
      }
    })
    if (timeToDone) {
      const plusTime = timeToDone.timeToDone

      const d = new Date(`${startAt} UTC`)
      d.setHours(d.getHours() + plusTime)
      const newOrderEndAt = d
      const newOrderStartAt = new Date(`${startAt} UTC`)

      const gOrderMasterId = await prisma.order.findMany({
        where: {
              cityId: Number(cityId),
          AND: {
            OR: [{
              startAt: { lt: newOrderEndAt },
              AND: { endAt: { gt: newOrderEndAt } }
            },
            {
                    startAt: { lt: newOrderStartAt },
              AND: { endAt: { gt: newOrderStartAt }, 
               }
            },
            {
              startAt: newOrderStartAt,
            }
            ]
          }
        }
      })
      const busyMastersId = gOrderMasterId.map(elem => elem.masterId)
      if (busyMastersId) {
        const allFreeMaster = await prisma.master.findMany({
          where: {
            id: { notIn: busyMastersId.map(elem => elem) },
            cityId: Number(cityId)
          }
        })
        const allFreeMastersWithRating = await prisma.$queryRaw<MasterWithRating[]>`
      SELECT "masters"."id", "masters"."name", "masters"."cityId", AVG("orders"."rating") AS "rating" from "masters"
                                      INNER JOIN "orders" ON "masters"."id" = "orders"."masterId"
                                      WHERE "masters"."cityId" = ${Number(cityId)} AND "masters"."id" NOT IN (${Number(busyMastersId.join(','))})
                                      GROUP BY "masters"."id"
      `

        const x = allFreeMastersWithRating.filter((elem) => elem.id != (allFreeMaster.find((element) => element.id === elem.id)?.id))

        const result = x.concat(allFreeMaster)

        res.status(200).json(result)
      }

    }
    else {
      const allFreeMaster = await prisma.master.findMany({
        where: {
          cityId: Number(cityId)
        }
      })
      const allFreeMastersWithRating = await prisma.$queryRaw<MasterWithRating[]>`
      SELECT masters.id, masters.name, masters."cityId", AVG(orders.rating) AS rating from masters
                                      INNER JOIN orders ON masters.id = orders."masterId"
                                      WHERE masters."cityId" = ${Number(cityId)}
                                      GROUP BY masters.id
      `
      const x = allFreeMastersWithRating.filter((elem) => elem.id != (allFreeMaster.find((element) => element.id === elem.id)?.id))

      const result = x.concat(allFreeMaster)

      res.status(200).json(result)
    }
  }

  async getFreeMastersForPutOrder(req: Request, res: Response) {
    const params = getFreeMastersForPutOrderSchema.safeParse(req.query)
    if (!params.success) {
      return
    }
    const { cityId, startAt, clockSizeId, orderId } = params.data
    const timeToDone = await prisma.clockSize.findMany({
      where: {
        id: Number(clockSizeId)
      }
    })
    const plusTime = timeToDone[0].timeToDone

    const d = new Date(`${startAt} UTC`)
    d.setHours(d.getHours() + plusTime)
    const newOrderEndAt = d
    const newOrderStartAt = new Date(`${startAt} UTC`)

    const masterIdInOrders = await prisma.order.findMany({
      where: {
        cityId: Number(cityId),
        NOT: { id: Number(orderId) },
        AND: {
          OR: [{
            startAt: { lt: newOrderEndAt },
            AND: { endAt: { gt: newOrderEndAt } }
          },
          {
            startAt: { lt: newOrderStartAt },
            AND: { endAt: { gt: newOrderStartAt } }
          },
          {
            startAt: newOrderStartAt,
          }
          ]
        }
      }
    })

    const busyMastersId = masterIdInOrders.map(elem => elem.masterId)

    if (busyMastersId.length !== 0) {

      const allFreeMaster = await prisma.master.findMany({
        where: {
          id: { notIn: busyMastersId },
          cityId: Number(cityId)
        }
      })

      const allFreeMastersWithRating = await prisma.$queryRaw<Master[]>`
          SELECT masters.id, masters.name, masters."cityId", AVG(orders.rating) AS rating from masters
                                          INNER JOIN orders ON masters.id = orders."masterId"
                                          WHERE masters."cityId" = ${Number(cityId)} AND masters.id NOT IN (
                                          ${Number(busyMastersId.join(','))})
                                          GROUP BY masters.id
                                          `

      const x = allFreeMastersWithRating.filter((elem) => elem.id != (allFreeMaster.find((element) => element.id === elem.id)?.id))

      const result = x.concat(allFreeMaster)

      res.status(200).json(result)
    } else {
      const allFreeMaster = await prisma.master.findMany({
        where: {
          cityId: Number(cityId)
        }
      })

      const allFreeMastersWithRating = await prisma.$queryRaw<Master[]>`
          SELECT masters.id, masters.name, masters."cityId", AVG(orders.rating) AS rating from masters
                                      INNER JOIN orders ON masters.id = orders."masterId"
                                      WHERE masters."cityId" = ${Number(cityId)}
                                      GROUP BY masters.id
          `


      const x = allFreeMastersWithRating.filter((elem) => elem.id != (allFreeMaster.find((element) => element.id === elem.id)?.id))

      const result = x.concat(allFreeMaster)

      res.status(200).json(result)
    }
  }


  async createMasters(req: Request, res: Response) {
    const params = createMasterSchema.safeParse(req.body)
    if (!params.success) {
      return
    }
    const { name, cityId, login, password, confirmPassword } = params.data
    const validationErrors = []
    const PasswordWithOneNumb = z.string().regex(regPasswordWithOneNumb)
    const PasswordWithOneSymbol = z.string().regex(regPasswordWithOneSymbol)
    const validName = z.string().regex(regName)
    const masterValidateUpper = z.function().args(z.string()).implement((arg) => {
      return arg.toLowerCase() === arg
    })
    const masterValidateLower = z.function().args(z.string()).implement((arg) => {
      return arg.toUpperCase() === arg
    })
    const city = await prisma.city.findUnique({ where: { id: Number(cityId) } })
    const isUnique = await prisma.person.findUnique({ where: { email: login } })
    if (isUnique) {
      validationErrors.push(`Master with this email exsist`)
    }
    if (confirmPassword !== password) {
      validationErrors.push(`Those passwords didn’t match`)
    }
    if (!PasswordWithOneNumb.safeParse(password)) {
      validationErrors.push(`Password must 1 or more number`)
    }
    if (masterValidateUpper(password)) {
      validationErrors.push(`Password must 1 or more symbol upper case `)
    }
    if (masterValidateLower(password)) {
      validationErrors.push(`Password must 1 or more symbol lower case`)
    }
    if (!PasswordWithOneSymbol.safeParse(password)) {
      validationErrors.push(`Password must 1 or more symbol ${"[.,/\$#@&^%()*!}{}]"}`)
    }
    if (!validator.validate(login)) {
      validationErrors.push(`this email does not exsisted`)
    }
    if (!city) {
      validationErrors.push(`City with id: ${cityId} is not exsisted`)
    }
    if (!validName.safeParse(name)) {
      validationErrors.push('Invalid master name')
    }
    if (validationErrors.length) {
      res.status(400).json(validationErrors)
    }
    else {
      const token = jwt.sign(
        {},
        process.env.SECRET_KEY ? process.env.SECRET_KEY : "key",
        { expiresIn: '2h' }
      )
      const salt2 = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt2)
      const newPersonMaste = await prisma.person.create({
        data: {
          email: login,
          password: hash,
          role: "MASTER",
          token: token
        }
      })
      const newMaster = await prisma.master.create({
        data: {
          name: name,
          cityId: +cityId,
          personId: +newPersonMaste.id
        }
      })

      res.set({ Authorization: `Bearer ${token}` }).status(200).json(newMaster)
    }
  }




  async updateMaster(req: Request, res: Response) {
    const params = updateMasterSchema.safeParse(req.body)
    if (!params.success) {
      return
    }
    const { id, name, cityId } = params.data
    const validationErrors = []
    const city = await prisma.city.findUnique({ where: { id: Number(cityId) } })
    const master = await prisma.master.findUnique({ where: { id: Number(id) } })
    if (!city) {
      validationErrors.push(`City with id: ${cityId} is not exsisted`)
    }
    if (!regName.test(name)) {
      validationErrors.push('Invalid master name')
    }
    if (!master) {
      validationErrors.push(`Master with id: ${id} is not exsisted`)
    }
    if (validationErrors.length) {
      res.status(400).json(validationErrors)
    }
    else {
      const upMaster = await prisma.master.update({
        where: {
          id: Number(id),
        },
        data: {
          name: name,
          cityId: Number(cityId)
        }
      })

      res.status(201).json(upMaster)
    }
  }

  async deleteMaster(req: Request, res: Response) {
    const params = deleteMasterSchema.safeParse(req.body)
    if (!params.success) {
      return
    }
    const { id } = params.data
    const validationErrors = []
    const master = await prisma.master.findUnique({ where: { id: Number(id) } })
    if (!master) {
      validationErrors.push(`Master with id: ${id} is not exsisted`)
    }
    if (validationErrors.length) {
      res.status(400).json(validationErrors)
    }
    else {
      const delMaster = await prisma.master.delete({ where: { id: Number(id) } })

      res.status(204).json(delMaster)
    }
  }
}


export default new MasterController()