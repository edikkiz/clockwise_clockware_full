import { OrderStatus } from '.prisma/client'

export type Order = {
    id: number
    userId: number
    masterId: number
    cityId: number
    clockSizeId: number
    price: number
    startAt: string
}

export type MasterWithRating = {
    id: number
    name: string
    cityId: number
    rating?: number
    login?: String
    password?: String
}

export type OrderForFeedback = {
    id: number
    masterName: string
    cityName: string
    userName: string
    userEmail: string
    size: string
    price: number
    startAt: string
    endAt: string
}

export type DataForCharts = {
    count: number
    name: string
}

export type OrderForPDF = {
    id: number
    user: { name: string; email: string; id: number }
    master: { name: string; id: number; person: { email: string } }
    clockSize: { name: string; id: number }
    city: { name: string }
    price: number
    startAt: Date
    endAt: Date
    feedback: string | null
    rating: number | null
    status: OrderStatus
    images: string[]
}
