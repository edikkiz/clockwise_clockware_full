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
    feedbackToken?: string | null
    user: { email: string }
    master: { name: string; person: { email: string } }
    clockSize: { name: string }
    price: number
    startAt: Date
    endAt: Date
}

export type OptionsForNodemailer = {
    from: string
    to: string
    subject: string
    text: string
    html: string
    attachments?: {
        filename: string
        content: Buffer
    }[]
}

export type OrderXLSXTable = {
    city: { id: number; name: string }
    cityId: number
    clockSize: { id: number; name: string }
    endAt: Date
    feedback: string | null
    id: number
    images: string[]
    master: { id: number; name: string }
    price: number
    rating: number | null
    startAt: Date
    status: OrderStatus
    user: {
        id: number
        name: string
        email: string
    }
}
