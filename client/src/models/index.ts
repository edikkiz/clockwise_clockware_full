export type City = {
  id: number
  name: string
}

export type User = {
  id: number
  name: string
  email: string
}

export type Master = {
  id: number
  name: string
  cityId: number
  rating: number
  login: string
  password: string
}

export type ClockSize = {
  id: number
  name: string
  timeToDone: string
  price: number
}

export enum Role {
  admin = 'ADMIN',
  master = 'MASTER',
  user = 'USER',
}

export enum FormError {
  TYPE = 'type',
  REQUIRED = 'required',
  MAXLENGTH = 'maxLength',
  MINLENGTH = 'minLength',
  PATTERN = 'pattern',
  TESTONENUMB = 'testOneNumb',
  TESTONESYMBOLLOWERCASE = 'testOneSymbolLowerCase',
  TESTONESYMBOLUPPERCASE = 'testOneSymbolUpperCase',
  TESTONESYMBOL = 'testOneSymbol',
  VALIDATE = 'validate',
}

export enum Status {
  Completed = 'Completed',
  InProgress = 'InProgress',
  Pending = 'Pending',
  Active = 'Active',
  InActive = 'InActive',
}

export type Order = {
  id: number
  userId: number
  masterId: number
  cityId: number
  clockSizeId: number
  price: number
  startAt: string
  feedback: string
  rating: number
  status: Status
  images: string[]
}

export type AllOrder = {
  id: number
  user: { name: string; email: string; id: number }
  master: { name: string; id: number; person: { email: string } }
  clockSize: { name: string; id: number }
  city: { name: string }
  price: number
  startAt: string
  endAt: string
  feedback: string
  rating: number
  status: Status
  images: string[]
  feedbackToken: string
}

export type AllOrderForOneMaster = {
  title: string
  userName: string
  userEmail: string
  masterName: string
  cityName: string
  size: string
  price: number
  startAt: string
  endAt: string
  feedback: string
  rating: number
  status: Status
}

export type OrderForTable = {
  city: { id: number; name: string }
  cityId: number
  clockSize: { id: number; name: string }
  endAt: string
  feedback: string | null
  id: number
  images: string[]
  master: { id: number; name: string }
  price: number
  rating: number | null
  startAt: string
  status: Status
  user: {
    id: number
    name: string
    email: string
  }
}

export type Rating = {
  id: number
  rating: number
}

export type MasterForTable = {
  rating: number | null
  largeOrdersCount: number
  middleOrdersCount: number
  smallOrdersCount: number
  countCompletedOrders: number
  countNotCompletedOrders: number
  id: number
  name: string
  profit: number | null
}

export type OrderForFeedback = {
  id: number
  price: number
  startAt: string
  endAt: string
  master: { name: string }
  city: { name: string }
  clockSize: { name: string }
  user: {
    name: string
    email: string
    id: number
  }
}

export type StripeUrl = {
  url: string
}

export type MasterForAdminTable = {
  id: number
  name: string
  cityId: number
  city: { name: string }
}

export type Post = {
  id: number
  title: string
  titleImg: string
  content: string
  previewText: string
}
