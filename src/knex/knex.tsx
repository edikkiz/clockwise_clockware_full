import { Knex, knex } from 'knex'

interface User {
    id: number
    name: string
    email: string
    orders: Order[]
}

interface ClockSize {
    id: number
    name: string
    price: number
    timeToDone: number
    orders: Order[]
}

interface City {
    id: number
    name: string
    masters: Master[]
    orders: Order[]
}

interface Master {
    id: number
    name: string
    city: City
    cityId: number
    personId: number
    person: Person
    orders: Order[]
}

interface Person {
    id: number
    login: string
    password: string
    role: Role
    masters: Master[]
}

enum Role {
    MASTER,
    ADMIN
}

enum OrderStatus {
    CREATED,
    INPROGRESS,
    COMPLITED
}

interface Order {
    id: number
    userId: number
    user: User
    masterId: number
    master: Master
    cityId: number
    city: City
    clockSizeId: number
    clockSize: ClockSize
    price: number
    startAt: string
    endAt: string
    feedbackToken: string
    rating: number
    feedback: string
    status: OrderStatus
    active: Boolean
    images: string[]
}


const config: Knex.Config = {
    client: 'pg',
    connection: process.env.DATABASE_LOCAL,
    searchPath: ['knex', 'public'],
};

knex(config);
